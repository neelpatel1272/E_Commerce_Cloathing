<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class AccountController extends Controller
{

    public function register(Request $request){
        $rules =[
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required'
        ];

        $validate = Validator::make($request->all(), $rules);

        if($validate -> fails()){
            return response()->json([
                'status' => 'false',
                'error' => $validate->errors()
            ],400);
        }

        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->role = 'customer';
        $user->save();

        return response()->json([
                'status' => 'true',
                'data' => $user
            ],200);
        
    }

   public function authenticate(Request $request){
    $validate = Validator::make($request->all(),[
        'email' => 'required|email',
        'password' => 'required'
    ]);

    if($validate->fails()){
        return response()->json([
            'status' => 400,
            'error' => $validate->errors() 
        ],400);
    }

    if(Auth::attempt(['email' => $request->email, 'password' => $request->password])){
        $user = User::find(Auth::user()->id);

        $token = $user->createToken('token')->plainTextToken;

       
            return response()->json([
            'status' => true,
            'token' => $token,
            'id' => $user->id,
            'email' => $user->email,
            'name' => $user->name
        ],200); 
            
    }else{
        return response()->json([
            'status' => 401,
            'message' => 'Either Email/Password is incorrect'
        ],401);
    }
   }

    public function getOrderDetails($id, Request $request){
        $order = Order::where(['user_id' => $request->user()->id, 'id' => $id])->with('items')
                                    ->first();

        if($order == null){
            return response()->json([
                'status' => false,
                'message' => "Order Not Found",
                'data' => []
            ],400);
        }

            return response()->json([
                'status' => true,
                'data' => $order
            ],200);
    }


    public function getorders(Request $request)
    {
        $orders = Order::with('items.product')
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'DESC')
            ->get();

        if ($orders->isEmpty()) {
            return response()->json([
                'status' => true,
                'data' => []
            ], 200);
        }

        $orders->each(function ($order) {
            $order->items->transform(function ($item) {
                if ($item->product && $item->product->image) {
                    $item->image_url = asset('uploads/products/large/' . $item->product->image);
                } else {
                    $item->image_url = null;
                }

                return $item;
            });
        });

        return response()->json([
            'status' => true,
            'data' => $orders
        ], 200);
    }


    public function updateprofile(Request $request){

        $user = User::find($request->user()->id);

        if(empty($user)){
            return response()->json([
                    'status' => false,
                    'message' => 'User is Not Found' 
                ],404);
        }

        $validator = Validator::make($request->all(),[
            'name' => 'required',
            'email' => 'required|email|unique:users,email,'.$request->user()->id.',id',
            'address' => 'required',
            'city' => 'required',
            'state' => 'required',
            'zip' => 'required',
            'mobile' => 'required',
        ]);

        if($validator->fails()){
            return response()->json([
                'status' => false,
                'error' => $validator->errors() 
            ],404);
        }

        $user->name = $request->name;
        $user->email = $request->email;
        $user->city = $request->city;
        $user->state = $request->state;
        $user->zip = $request->zip;
        $user->mobile = $request->mobile;
        $user->address = $request->address;
        $user->save();

        return response()->json([
                'status' => true,
                'message' => 'Profile Updated Successfully'
            ],200);

    }
}
