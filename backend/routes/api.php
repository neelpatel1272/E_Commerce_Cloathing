<?php

use App\Http\Controllers\admin\AuthController;
use App\Http\Controllers\admin\BrandController;
use App\Http\Controllers\admin\CategoryController;
use App\Http\Controllers\admin\OrderController;
use App\Http\Controllers\admin\ProductController;
use App\Http\Controllers\admin\ShippingController;
use App\Http\Controllers\admin\SizeController;
use App\Http\Controllers\admin\TempImageController;

use App\Http\Controllers\front\ProductController as FrontProductController;
use App\Http\Controllers\front\AccountController as FrontAccountController;
use App\Http\Controllers\front\OrderController as FrontOrderController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::post('admin/login',[AuthController::class, 'authenticate']);
Route::get('get-latest-products',[FrontProductController::class, 'latestproduct']);
Route::get('get-featured-products',[FrontProductController::class, 'featuredproduct']);
Route::get('get-categories',[FrontProductController::class, 'getcategories']);
Route::get('get-brands',[FrontProductController::class, 'getbrands']);
Route::get('get-products',[FrontProductController::class, 'getproducts']);
Route::get('get-product/{id}',[FrontProductController::class, 'getProduct']);

Route::post('register', [FrontAccountController::class, 'register']);
Route::post('login', [FrontAccountController::class, 'authenticate']);

//protected User Routes
Route::group(['middleware' => ['auth:sanctum','checkUserRole']], function (){
     Route::post('save-order',[FrontOrderController::class, 'saveOrder']);
     Route::get('get-orders',[FrontAccountController::class, 'getorders']);
     Route::put('update-profile',[FrontAccountController::class, 'updateprofile']);
     Route::get('get-order-details/{id}',[FrontAccountController::class, 'getOrderDetails']);
});

Route::get('collections/{slug}', [FrontProductController::class, 'collection']);
Route::get('sizes', [FrontProductController::class, 'getsizes']);



// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

//admin Routes
Route::group(['middleware' => ['auth:sanctum', 'checkAdminRole']], function (){


    Route::resource('categories', CategoryController::class);
    Route::resource('brands', BrandController::class);
    Route::resource('products', ProductController::class);


    Route::get('get-shipping',[ShippingController::class,'getshipping']);
    Route::post('save-shipping',[ShippingController::class,'updateshipping']);

    //orders
    Route::get('orders', [OrderController::class, 'index']);
    Route::get('orders/{id}', [OrderController::class, 'details']);
    Route::put('update-order/{id}', [OrderController::class, 'update']);

    Route::get('admin/sizes', [SizeController::class, 'index']);
    Route::post('temp-images', [TempImageController::class, 'store']);



});