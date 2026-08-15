<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Size;
use App\Models\TempImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('images','sizes')
            ->orderBy('created_at', 'DESC')
            ->get();

        return response()->json([
            'status' => true,
            'data' => $products,
        ]);
    }

    public function getSizes(){
          $sizes = Size::orderBy('name', 'ASC')->get();

        return response()->json([
            'status' => true,
            'data' => $sizes,
        ], 200);
    }

    public function store(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'title' => 'required',
            'price' => 'required|numeric',
            'category' => 'required|integer',
            'is_featured' => 'required',
            'sku' => 'required|unique:products,sku',
            'status' => 'required',
            'sizes'=>'nullable|array',
            'sizes.*'=> 'integer|exists:sizes,id'
        ]);

        if ($validate->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validate->errors(),
            ], 400);
        }

        $product = new Product;

        $product->title = $request->title;
        $product->price = $request->price;
        $product->compare_price = $request->compare_price;
        $product->description = $request->description;
        $product->short_description = $request->short_description;
        $product->category_id = $request->category;
        $product->brand_id = $request->brand;
        $product->qty = $request->qty;
        $product->sku = $request->sku;
        $product->barcode = $request->barcode;
        $product->status = $request->status;
        $product->is_featured = $request->is_featured;

        $product->save();

        if($request->has('sizes') && is_array($request->sizes)){
            $product->sizes()->sync($request->sizes);
        }

        if ($request->has('gallery') && is_array($request->gallery)) {
            foreach ($request->gallery as $key => $tempImageId) {
                $tempImage = TempImage::find($tempImageId);

                if (! $tempImage) {
                    continue;
                }

                $imageName = $this->createProductImage(
                    $product->id,
                    $tempImage->name,
                    $key
                );

                $product->images()->create([
                    'image' => $imageName,
                    'sort_order' => $key,
                ]);

                if ($key === 0) {
                    $product->image = $imageName;
                    $product->save();
                }
            }
        }

        $product->load('images','sizes');

        return response()->json([
            'status' => true,
            'message' => 'Product Created Successfully',
            'data' => $product,
        ], 200);
    }

    public function show($id)
    {
        $product = Product::with('images','sizes')->find($id);

        if (! $product) {
            return response()->json([
                'status' => false,
                'message' => 'Product Not Found',
            ], 404);
        }

        $product->images->transform(function ($image) {
            $image->url = asset(
                'uploads/products/large/'.$image->image
            );

            return $image;
        });

        return response()->json([
            'status' => true,
            'data' => $product,
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $product = Product::with('images','sizes')->find($id);

        if (! $product) {
            return response()->json([
                'status' => false,
                'message' => 'Product Not Found',
            ], 404);
        }

        $validate = Validator::make($request->all(), [
            'title' => 'required',
            'price' => 'required|numeric',
            'category' => 'required|integer',
            'is_featured' => 'required',
            'sku' => 'required|unique:products,sku,'.$id,
            'sizes'=>'nullable|array',
            'sizes.*'=> 'integer|exists:sizes,id',
            'status' => 'required',
        ]);

        if ($validate->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validate->errors(),
            ], 400);
        }

        $product->title = $request->title;
        $product->price = $request->price;
        $product->compare_price = $request->compare_price;
        $product->description = $request->description;
        $product->short_description = $request->short_description;
        $product->category_id = $request->category;
        $product->brand_id = $request->brand;
        $product->qty = $request->qty;
        $product->sku = $request->sku;
        $product->barcode = $request->barcode;
        $product->status = $request->status;
        $product->is_featured = $request->is_featured;

        $product->save();

        $product->sizes()->sync($request->input('sizes',[]));

      

        $deleteImages = $request->input('delete_images', []);

        if (is_array($deleteImages)) {
            foreach ($deleteImages as $imageId) {
                $image = $product->images()->find($imageId);

                if (! $image) {
                    continue;
                }

                $this->deleteProductImageFiles($image->image);

                $image->delete();
            }
        }



        $newGallery = $request->input('gallery', []);

        if (is_array($newGallery)) {
            foreach ($newGallery as $tempImageId) {
                $tempImage = TempImage::find($tempImageId);

                if (! $tempImage) {
                    continue;
                }

                $imageName = $this->createProductImage(
                    $product->id,
                    $tempImage->name,
                    $product->images()->count()
                );

                $product->images()->create([
                    'image' => $imageName,
                    'sort_order' => $product->images()->count(),
                ]);
            }
        }


        $imageOrder = $request->input('image_order', []);

        if (is_array($imageOrder)) {
            foreach ($imageOrder as $sortOrder => $imageId) {
                $image = $product->images()->find($imageId);

                if ($image) {
                    $image->sort_order = $sortOrder;
                    $image->save();
                }
            }
        }

        $firstImage = $product->images()
            ->orderBy('sort_order', 'ASC')
            ->first();

        if ($firstImage) {
            $product->image = $firstImage->image;
        } else {
            $product->image = null;
        }

        $product->save();

        $product->load([
            'images' => function ($query) {
                $query->orderBy('sort_order', 'ASC');
            },
            'sizes',
        ]);

        $product->images->transform(function ($image) {
            $image->url = asset(
                'uploads/products/large/'.$image->image
            );

            return $image;
        });

        return response()->json([
            'status' => true,
            'message' => 'Product Updated Successfully',
            'data' => $product,
        ], 200);
    }

    public function destroy($id)
    {
        $product = Product::with('images','sizes')->find($id);

        if (! $product) {
            return response()->json([
                'status' => false,
                'message' => 'Product Not Found',
            ], 404);
        }

        foreach ($product->images as $image) {
            $this->deleteProductImageFiles($image->image);
            $image->delete();
        }

        $product->delete();

        return response()->json([
            'status' => true,
            'message' => 'Product Deleted Successfully',
        ], 200);
    }

    private function createProductImage($productId, $tempImageName, $key)
    {
        $extension = pathinfo($tempImageName, PATHINFO_EXTENSION);

        $imageName = $productId.'-'.time().'-'.uniqid().'-'.$key.'.'.$extension;

        $manager = new ImageManager(Driver::class);

        $tempPath = public_path(
            'uploads/temp/'.$tempImageName
        );

        $img = $manager->read($tempPath);

        $img->scaleDown(1200);

        $largePath = public_path(
            'uploads/products/large/'.$imageName
        );

        $img->save($largePath);

        /*
        |--------------------------------------------------------------------------
        | SMALL IMAGE
        |--------------------------------------------------------------------------
        */

        $img = $manager->read($tempPath);

        $img->coverDown(400, 460);

        $smallPath = public_path(
            'uploads/products/small/'.$imageName
        );

        $img->save($smallPath);

        return $imageName;
    }

    private function deleteProductImageFiles($imageName)
    {
        $largePath = public_path(
            'uploads/products/large/'.$imageName
        );

        $smallPath = public_path(
            'uploads/products/small/'.$imageName
        );

        if (file_exists($largePath)) {
            unlink($largePath);
        }

        if (file_exists($smallPath)) {
            unlink($smallPath);
        }
    }
}
