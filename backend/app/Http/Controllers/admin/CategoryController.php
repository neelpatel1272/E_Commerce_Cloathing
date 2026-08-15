<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    public function index(){
        $categories = Category::orderBy('created_at','DESC')->get();

         return response()->json([
                  'status' => true,
                  'data' => $categories
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

        $category = new Category();
        $category->name=$request->name;
        $category->status=$request->status;
        $category->save();

         return response()->json([
            'status' => true,
            'message' => "Category Created Successfully",
            'data' => $category
        ],200);
    }

    public function show($id){
         $category = Category::find($id);
        if($category == null){
          return response()->json([
                'status' => 404,
                'message' => "Category Not Found"
            ],404);
        } 

        return response()->json([
            'status' => true,
            'data' => $category
        ],200);
    }

    public function update(Request $request, $id){

        $category = Category::find($id);
        if(!$category){
          return response()->json([
                'status' => 404,
                'message' => "Category Not Found"
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

        $category->name=$request->name;
        $category->status=$request->status;
        $category->save();

         return response()->json([
            'status' => true,
            'message' => "Category Updated Successfully",
            'data' => $category
        ],200);
    }

    public function destroy($id){
    $category = Category::find($id);
        if(!$category){
          return response()->json([
                'status' => 404,
                'message' => "Category Not Found"
            ],404);
        } 

        $category->delete();

         return response()->json([
            'status' => true,
            'message' => "Category Deleted Successfully",
        ],200);

    }
}
