<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {   
        $orders = Order::orderBy('created_at', 'DESC')->get();

        return response()->json([
            'status' => true,
            'data' => $orders
        ],200);
    }

    public function details($id)
    {
        $order = Order::with('items', 'items.product')->find($id);

        if($order == null){
            return response()->json([
            'status' => false,
            'message' => 'Order Not Found'
        ],404);
        }

             $order->items->transform(function ($item) {
        if ($item->product && $item->product->image) {
            $item->product->image_url = asset(
                'uploads/products/large/' . $item->product->image
            );
        } else {
            $item->product->image_url = null;
        }

        return $item;
    });


        return response()->json([
            'status' => true,
            'data' => $order
        ],200);
    }

    public function update($id, Request $request){
        $order = Order::find($id);

          if($order == null){
            return response()->json([
            'status' => false,
            'message' => 'Order Not Found'
        ],404);
        }

        $order->status = $request->status;
        $order->payment_status = $request->payment_status;
        $order->save();

        return response()->json([
            'status' => true,
            'data' => $order,
            'message' => 'Order Updated Successfully'
        ],200);
    }
}
