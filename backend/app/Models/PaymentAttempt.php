<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentAttempt extends Model
{
    protected $fillable = ['user_id', 'order_id', 'razorpay_order_id', 'amount', 'checkout_data', 'status', 'expires_at'];

    protected function casts(): array
    {
        return ['checkout_data' => 'array', 'expires_at' => 'datetime'];
    }
}
