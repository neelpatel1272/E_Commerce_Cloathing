<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function getproducts(Request $request)
    {
        $query = Product::with(['category', 'brand'])
            ->where('status', 1)
            ->orderBy('created_at', 'DESC');

        if ($request->filled('category')) {

            $catArray = explode(',', $request->category);

            $catArray = array_filter($catArray);

            if (! empty($catArray)) {
                $query->whereIn('category_id', $catArray);
            }
        }

        // Brand filter
        if ($request->filled('brand')) {

            $brandArray = explode(',', $request->brand);

            $brandArray = array_filter($brandArray);

            if (! empty($brandArray)) {
                $query->whereIn('brand_id', $brandArray);
            }
        }

        // Get products AFTER filters
        $products = $query->get();

        $products->transform(function ($product) {

            $product->image_url = $product->image
                ? asset('uploads/products/large/'.$product->image)
                : null;

            return $product;
        });

        return response()->json([
            'status' => true,
            'data' => $products,
        ], 200);
    }

    public function latestproduct()
    {
        $products = Product::orderBy('created_at', 'DESC')
            ->where('status', 1)
            ->limit(8)
            ->get();

        $products->transform(function ($product) {

            $product->image_url = $product->image
                ? asset('uploads/products/large/'.$product->image)
                : null;

            return $product;
        });

        return response()->json([
            'status' => true,
            'data' => $products,
        ], 200);
    }

    public function featuredproduct()
    {
        $products = Product::orderBy('created_at', 'DESC')
            ->where('status', 1)
            ->where('is_featured', 'yes')
            ->limit(8)
            ->get();

        $products->transform(function ($product) {

            $product->image_url = $product->image
                ? asset('uploads/products/large/'.$product->image)
                : null;

            return $product;
        });

        return response()->json([
            'status' => true,
            'data' => $products,
        ], 200);
    }

    public function getcategories()
    {
        $categories = Category::orderBy('name', 'Asc')->where('status', 1)->get();

        return response()->json([
            'status' => true,
            'data' => $categories,
        ], 200);

    }

    public function getbrands()
    {
        $brands = Brand::orderBy('name', 'Asc')->where('status', 1)->get();

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
            $image->image_url = $baseUrl . '/uploads/products/large/' . $image->image;
            $image->url = $image->image_url;

            return $image;
        });

        return response()->json([
            'status' => true,
            'data' => $product,
        ], 200);
    }
}
