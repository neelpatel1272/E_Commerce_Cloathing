<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\PaymentAttempt;
use App\Models\Product;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Razorpay\Api\Api;

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


public function createRazorpayOrder(Request $request)
{
    try {

        if (empty($request->cart)) {
            return response()->json([
                'status' => false,
                'message' => 'Your Cart is Empty.'
            ], 400);
        }

        /*
         * Calculate amount on server.
         */
        $subTotal = 0;

        foreach ($request->cart as $item) {

            $product = Product::find($item['product_id']);

            if (!$product) {
                throw new \Exception(
                    "Product not found."
                );
            }

            $qty = (int) $item['qty'];

            if ($qty <= 0) {
                throw new \Exception(
                    "Invalid quantity."
                );
            }

            if ($product->qty < $qty) {
                throw new \Exception(
                    "Only {$product->qty} quantity available for {$product->title}."
                );
            }

            $subTotal += $product->price * $qty;
        }
        $shipping = $subTotal >= 999 ? 0 : 99;
        $discount = 0;
        $grandTotal = $subTotal + $shipping - $discount;

        /*
         * Razorpay
         */
        $api = new Api(
            config('services.razorpay.key_id'),
            config('services.razorpay.key_secret')
        );

        $razorpayOrder = $api->order->create([
            'receipt' => 'receipt_' . time(),
            'amount' => (int) round($grandTotal * 100),
            'currency' => 'INR',
        ]);

        /*
         * Store payment attempt.
         */
        PaymentAttempt::create([
            'user_id' => $request->user()->id,
            'razorpay_order_id' => $razorpayOrder['id'],
            'amount' => $razorpayOrder['amount'],
            'checkout_data' => [
                'name' => $request->name,
                'email' => $request->email,
                'mobile' => $request->mobile,
                'address' => $request->address,
                'city' => $request->city,
                'state' => $request->state,
                'zip' => $request->zip,
                'cart' => $request->cart,
                'sub_total' => $subTotal,
                'shipping' => $shipping,
                'discount' => $discount,
                'grand_total' => $grandTotal,
            ],
            'status' => 'created',
            'expires_at' => now()->addMinutes(30),
        ]);

        return response()->json([
            'status' => true,
            'key_id' => config('services.razorpay.key_id'),
            'amount' => $razorpayOrder['amount'],
            'currency' => $razorpayOrder['currency'],
            'razorpay_order_id' => $razorpayOrder['id'],
        ]);

    } catch (\Throwable $e) {

        return response()->json([
            'status' => false,
            'message' => $e->getMessage()
        ], 422);
    }
}

public function verifyRazorpayPayment(Request $request)
{
    DB::beginTransaction();

    try {

        $request->validate([
            'razorpay_payment_id' => 'required|string',
            'razorpay_order_id' => 'required|string',
            'razorpay_signature' => 'required|string',
        ]);

        $paymentAttempt = PaymentAttempt::where(
            'razorpay_order_id',
            $request->razorpay_order_id
        )->first();

        if (!$paymentAttempt) {
            throw new \Exception(
                'Payment attempt not found.'
            );
        }

        if ($paymentAttempt->status === 'paid') {
            throw new \Exception(
                'This payment has already been processed.'
            );
        }

        if ($paymentAttempt->expires_at->isPast()) {
            throw new \Exception(
                'Payment session has expired.'
            );
        }

        /*
         * Verify Razorpay signature
         */
        $api = new Api(
            config('services.razorpay.key_id'),
            config('services.razorpay.key_secret')
        );

        $api->utility->verifyPaymentSignature([
            'razorpay_order_id' => $request->razorpay_order_id,
            'razorpay_payment_id' => $request->razorpay_payment_id,
            'razorpay_signature' => $request->razorpay_signature,
        ]);

        /*
         * Get original checkout data from DB.
         */
        $checkoutData = $paymentAttempt->checkout_data;

        /*
         * Create Order
         */
        $order = new Order();

        $order->name = $checkoutData['name'];
        $order->email = $checkoutData['email'];
        $order->mobile = $checkoutData['mobile'];
        $order->address = $checkoutData['address'];
        $order->city = $checkoutData['city'];
        $order->state = $checkoutData['state'];
        $order->zip = $checkoutData['zip'];

        $order->user_id = $paymentAttempt->user_id;

        $order->sub_total = $checkoutData['sub_total'];
        $order->grand_total = $checkoutData['grand_total'];
        $order->shipping = $checkoutData['shipping'];
        $order->discount = $checkoutData['discount'];

        $order->payment_method = 'razorpay';
        $order->payment_status = 'paid';
        $order->status = 'pending';

        $order->razorpay_order_id =
            $request->razorpay_order_id;

        $order->razorpay_payment_id =
            $request->razorpay_payment_id;

        $order->razorpay_signature =
            $request->razorpay_signature;

        $order->save();

        /*
         * Create order items
         */
        foreach ($checkoutData['cart'] as $item) {

            $product = Product::lockForUpdate()
                ->find($item['product_id']);

            if (!$product) {
                throw new \Exception(
                    "Product not found."
                );
            }

            $orderedQty = (int) $item['qty'];

            if ($product->qty < $orderedQty) {
                throw new \Exception(
                    "Only {$product->qty} quantity available for {$product->title}."
                );
            }

            $orderItem = new OrderItem();

            $orderItem->price =
                $product->price * $orderedQty;

            $orderItem->unit_price =
                $product->price;

            $orderItem->name =
                $product->title;

            $orderItem->qty =
                $orderedQty;

            $orderItem->order_id =
                $order->id;

            $orderItem->product_id =
                $product->id;

            $orderItem->size =
                $item['size'] ?? '';

            $orderItem->save();

            /*
             * Reduce stock
             */
            $product->qty =
                $product->qty - $orderedQty;

            $product->save();
        }

        /*
         * Mark payment attempt as paid.
         */
        $paymentAttempt->update([
            'order_id' => $order->id,
            'status' => 'paid',
        ]);

        DB::commit();

        return response()->json([
            'status' => true,
            'id' => $order->id,
            'message' =>
                'You Have Successfully Placed Your Order.'
        ]);

    } catch (\Throwable $e) {

        DB::rollBack();

        return response()->json([
            'status' => false,
            'message' => $e->getMessage()
        ], 422);
    }
}

   
}
