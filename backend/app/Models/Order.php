<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{

 protected  $casts = [
    'created_at' =>  'datetime:d-F-Y',
 ];

    public function items(){
        return $this->hasMany(OrderItem::class)->with('product');
    }
}
