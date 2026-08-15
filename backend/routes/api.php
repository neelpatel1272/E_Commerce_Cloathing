<?php

use App\Http\Controllers\admin\AuthController;
use App\Http\Controllers\admin\BrandController;
use App\Http\Controllers\admin\CategoryController;
use App\Http\Controllers\admin\ProductController;
use App\Http\Controllers\admin\SizeController;
use App\Http\Controllers\admin\TempImageController;

use App\Http\Controllers\front\ProductController as FrontProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::post('admin/login',[AuthController::class, 'authenticate']);
Route::get('get-latest-products',[FrontProductController::class, 'latestproduct']);
Route::get('get-featured-products',[FrontProductController::class, 'featuredproduct']);
Route::get('get-categories',[FrontProductController::class, 'getcategories']);
Route::get('get-brands',[FrontProductController::class, 'getbrands']);
Route::get('get-products',[FrontProductController::class, 'getproducts']);
Route::get('get-product/{id}',[FrontProductController::class, 'getProduct']);
Route::get('sizes', [ProductController::class, 'getSizes']);



// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');


Route::group(['middleware' => 'auth:sanctum'], function (){

    // categories
    Route::resource('categories', CategoryController::class);
    Route::resource('brands', BrandController::class);
    Route::resource('products', ProductController::class);

    Route::get('sizes', [SizeController::class, 'index']);
    Route::post('temp-images', [TempImageController::class, 'store']);



});