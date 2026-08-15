<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BrandController extends Controller
{
     public function index(){
        $brands = Brand::orderBy('created_at','DESC')->get();

         return response()->json([
                  'status' => true,
                  'data' => $brands
            ]);
    }


    public function store(Request $request){
        $validate = Validator::make($request->all(),[
            'name' => 'required',
        ]);

        if($validate->fails()){
                return response()->json([
                'status' => 400,
                'error' => $validate->errors() 
            ],400);
        }

        $brand = new Brand();
        $brand->name=$request->name;
        $brand->status=$request->status;
        $brand->save();

         return response()->json([
            'status' => true,
            'message' => "Brand Creatd Successfully",
            'data' => $brand
        ],200);
    }

    public function show($id){
         $brand = Brand::find($id);
        if($brand == null){
          return response()->json([
                'status' => 404,
                'message' => "Brand Not Found"
            ],404);
        } 

        return response()->json([
            'status' => true,
            'data' => $brand
        ],200);
    }

    public function update(Request $request, $id){

        $brand = Brand::find($id);
        if($brand == null){
          return response()->json([
                'status' => 404,
                'message' => "brand Not Found"
            ],404);
        } 

         $validate = Validator::make($request->all(),[
            'name' => 'required',
        ]);

        if($validate->fails()){
                return response()->json([
                'status' => 400,
                'error' => $validate->errors() 
            ],400);
        }

        $brand->name=$request->name;
        $brand->status=$request->status;
        $brand->save();

         return response()->json([
            'status' => true,
            'message' => "Brand Updated Successfully",
            'data' => $brand
        ],200);
    }

    public function destroy($id){
    $brand = Brand::find($id);
        if($brand == null){
          return response()->json([
                'status' => 404,
                'message' => "Brand Not Found"
            ],404);
        } 

        $brand->delete();

         return response()->json([
            'status' => true,
            'message' => "Brand Deleted Successfully",
        ],200);

    }
}
