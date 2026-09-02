<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\ShippingCharge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ShippingController extends Controller
{
   public function getshipping(){
        $shipping = ShippingCharge::first();
        return response()->json([
            'status' => true,
            'data' => $shipping
        ], 200);
   }

   public function updateshipping(Request $request){

        $validator = Validator::make($request->all(), [
             'shipping_charge' => 'required|numeric',
             'status' => 'required|in:0,1',
        ]);

        if($validator->fails()){
            return response()->json([
                 'status' => false,
                 'message' => $validator->errors()
             ], 400);
        }


        $shipping = ShippingCharge::first();

        if ($shipping == null) {
             $shipping = new ShippingCharge();
        }
        
       
        $shipping->shipping_charge = $request->shipping_charge;
        $shipping->save();

        return response()->json([
             'status' => true,
             'message' => "Shipping Saved Successfully",
        ], 200);
   }
}
