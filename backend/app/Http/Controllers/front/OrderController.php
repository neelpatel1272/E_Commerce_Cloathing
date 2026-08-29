<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function saveOrder(Request $request)
    {

    if(!empty($request->cart)){
     $order = new Order();
        $order->name = $request->name;
        $order->email = $request->email;
        $order->mobile = $request->mobile;
        $order->address = $request->address;
        $order->city = $request->city;
        $order->state = $request->state;
        $order->zip = $request->zip;
        $order->user_id = $request->User()->id;
        $order->sub_total = $request->sub_total;
        $order->grand_total = $request->grand_total;
        $order->shipping = $request->shipping;
        $order->discount = $request->discount;
        $order->payment_status = $request->payment_status;
        $order->status = $request->status;
        $order->save();


        //save order Item
        foreach ($request->cart as $item) {
           $orderItem = new OrderItem();
             $orderItem->price = $item['qty'] * $item['price'];
             $orderItem->unit_price = $item['price'];
             $orderItem->name = $item['name'];
             $orderItem->qty = $item['qty'];
             $orderItem->order_id = $order->id;
             $orderItem->product_id = $item['product_id'];
             $orderItem->size = $item['size'];
             $orderItem->save();
        }

        return response()->json([
            'status' => true,
            'id'=>$order->id,
            'message' => "You Have Successfully Place Your Order."
        ], 200);
    }  else{
           return response()->json([
            'status' => false,
            'message' => "Your Cart is Empty."
        ], 400);
    }
     
    
    }

   
}
