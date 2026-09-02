<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\Size;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function getproducts(Request $request)
    {
        $query = Product::with(['category', 'brand', 'sizes'])
            ->where('status', 1)
            ->orderBy('created_at', 'DESC');

        if ($request->filled('category')) {
            $catArray = array_filter(
                explode(',', $request->category)
            );

            if (!empty($catArray)) {
                $query->whereIn('category_id', $catArray);
            }
        }

        if ($request->filled('brand')) {
            $brandArray = array_filter(
                explode(',', $request->brand)
            );

            if (!empty($brandArray)) {
                $query->whereIn('brand_id', $brandArray);
            }
        }

        $products = $query->get();

        $products->transform(function ($product) {
            $product->image_url = $product->image
                ? asset('uploads/products/large/' . $product->image)
                : null;
            
            $this->flattenSizeQty($product);

            return $product;
        });

        return response()->json([
            'status' => true,
            'data' => $products,
        ], 200);
    }

    public function collection(Request $request, $slug)
    {
        $category = Category::where('slug', $slug)
            ->where('status', 1)
            ->first();

        if (!$category) {
            return response()->json([
                'status' => false,
                'message' => 'Collection Not Found',
            ], 404);
        }

        $query = Product::with([
            'category',
            'brand',
            'sizes'
        ])
        ->where('status', 1)
        ->where('category_id', $category->id);

        if ($request->filled('brand')) {
            $brandArray = array_filter(
                explode(',', $request->brand)
            );

            if (!empty($brandArray)) {
                $query->whereIn('brand_id', $brandArray);
            }
        }

        if ($request->filled('min_price')) {
            $query->where(
                'price',
                '>=',
                $request->min_price
            );
        }

        if ($request->filled('max_price')) {
            $query->where(
                'price',
                '<=',
                $request->max_price
            );
        }

        if ($request->filled('size')) {
            $sizeArray = array_filter(
                explode(',', $request->size)
            );

            if (!empty($sizeArray)) {
                $query->whereHas('sizes', function ($q) use ($sizeArray) {
                    $q->whereIn('sizes.id', $sizeArray);
                });
            }
        }

        $products = $query
            ->orderBy('created_at', 'DESC')
            ->get();

        $products->transform(function ($product) {
            $product->image_url = $product->image
                ? asset('uploads/products/large/' . $product->image)
                : null;
             $this->flattenSizeQty($product);

            return $product;
        });

        return response()->json([
            'status' => true,
            'collection' => $category,
            'data' => $products,
        ], 200);
    }

    public function latestproduct()
    {
        $products = Product::with([
            'category',
            'brand',
            'sizes'
        ])
        ->orderBy('created_at', 'DESC')
        ->where('status', 1)
        ->limit(8)
        ->get();

        $products->transform(function ($product) {
            $product->image_url = $product->image
                ? asset('uploads/products/large/' . $product->image)
                : null;

             $this->flattenSizeQty($product);
            return $product;
        });

        return response()->json([
            'status' => true,
            'data' => $products,
        ], 200);
    }

    public function featuredproduct()
    {
        $products = Product::with([
            'category',
            'brand',
            'sizes'
        ])
        ->orderBy('created_at', 'DESC')
        ->where('status', 1)
        ->where('is_featured', 'yes')
        ->limit(8)
        ->get();

        $products->transform(function ($product) {
            $product->image_url = $product->image
                ? asset('uploads/products/large/' . $product->image)
                : null;
                 $this->flattenSizeQty($product);

            return $product;
        });

        return response()->json([
            'status' => true,
            'data' => $products,
        ], 200);
    }

    public function getcategories()
    {
        $categories = Category::orderBy('name', 'ASC')
            ->where('status', 1)
            ->get();

        return response()->json([
            'status' => true,
            'data' => $categories,
        ], 200);
    }

    public function getbrands()
    {
        $brands = Brand::orderBy('name', 'ASC')
            ->where('status', 1)
            ->get();

        return response()->json([
            'status' => true,
            'data' => $brands,
        ], 200);
    }

    public function getProduct(Request $request, $id)
    {
        $product = Product::with([
            'category',
            'brand',
            'images',
            'sizes'
        ])->find($id);

        if (!$product) {
            return response()->json([
                'status' => false,
                'message' => 'Product Not Found',
            ], 404);
        }

        $baseUrl = $request->getSchemeAndHttpHost();

        $product->image_url = $product->image
            ? $baseUrl . '/uploads/products/large/' . $product->image
            : null;

        $product->images->transform(function ($image) use ($baseUrl) {
            $image->image_url =
                $baseUrl . '/uploads/products/large/' . $image->image;

            $image->url = $image->image_url;

            return $image;
        });

        $this->flattenSizeQty($product);

        return response()->json([
            'status' => true,
            'data' => $product,
        ], 200);
    }

    public function getsizes()
    {
        $sizes = Size::orderBy('name', 'ASC')->get();

        return response()->json([
            'status' => true,
            'data' => $sizes,
        ], 200);
    }

     private function flattenSizeQty($product)
        {
            $product->sizes->transform(function ($size) {
                $size->qty = $size->pivot->qty ?? 0;
                unset($size->pivot);
                return $size;
            });

            return $product;
        }
}