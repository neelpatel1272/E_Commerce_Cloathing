<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
public function saveOrder(Request $request)
{
    if (empty($request->cart)) {
        return response()->json([
            'status' => false,
            'message' => 'Your Cart is Empty.'
        ], 400);
    }

    DB::beginTransaction();

    try {

        $order = new Order();
        $order->name = $request->name;
        $order->email = $request->email;
        $order->mobile = $request->mobile;
        $order->address = $request->address;
        $order->city = $request->city;
        $order->state = $request->state;
        $order->zip = $request->zip;
        $order->user_id = $request->user()->id;
        $order->sub_total = $request->sub_total;
        $order->grand_total = $request->grand_total;
        $order->shipping = $request->shipping;
        $order->discount = $request->discount;
        $order->payment_status = $request->payment_status;
        $order->status = $request->status;
        $order->save();

        foreach ($request->cart as $item) {

            $product = Product::find($item['product_id']);

            if (!$product) {
                throw new \Exception(
                    "Product {$item['name']} not found."
                );
            }

            $orderedQty = (int) $item['qty'];

            if ($product->qty < $orderedQty) {
                throw new \Exception(
                    "Only {$product->qty} quantity available for {$product->title}."
                );
            }

            $orderItem = new OrderItem();
            $orderItem->price = $orderedQty * $item['price'];
            $orderItem->unit_price = $item['price'];
            $orderItem->name = $item['name'];
            $orderItem->qty = $orderedQty;
            $orderItem->order_id = $order->id;
            $orderItem->product_id = $item['product_id'];
            $orderItem->size = $item['size'] ?? '';
            $orderItem->save();

            $product->qty = $product->qty - $orderedQty;
            $product->save();
        }

        DB::commit();

        return response()->json([
            'status' => true,
            'id' => $order->id,
            'message' => 'You Have Successfully Place Your Order.'
        ], 200);

    } catch (\Throwable $e) {

        DB::rollBack();

        return response()->json([
            'status' => false,
            'message' => $e->getMessage()
        ], 422);
    }
}

   
}
