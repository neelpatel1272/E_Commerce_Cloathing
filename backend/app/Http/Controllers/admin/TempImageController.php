<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\TempImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class TempImageController extends Controller
{
    public function store(Request $request){
        $validate = Validator::make($request->all(),[
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg'
        ]);

         if($validate->fails()){
                return response()->json([
                'status' => 400,
                'error' => $validate->errors() 
            ],400);
        }

        $tempImage = new TempImage();
        $tempImage->name = "Dummy Name";
        $tempImage->save();

        $image = $request->file('image');
        $imageName = time().'.'.$image->extension();
        $image->move(public_path('uploads/temp'), $imageName);
        $tempImage->name = $imageName;
        $tempImage->save();
        
        $manager = new ImageManager(Driver::class);
        $img = $manager->read(public_path('uploads/temp/'. $imageName));   
        $img->coverDown(400, 450);
       $thumbPath = public_path('uploads/temp/thumb/' . $imageName);
        $img->save($thumbPath);


         return response()->json([
            'status' => true,
            'data' => $tempImage,
        ],200);


    }
}
