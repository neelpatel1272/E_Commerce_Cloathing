<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\ProductImage;
use App\Models\Size;
use App\Models\Category;
use App\Models\Brand;

class Product extends Model
{
    public function images()
    {
        return $this->hasMany(ProductImage::class)
            ->orderBy('sort_order');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function sizes()
    {
        return $this->belongsToMany(
            Size::class,
            'product_sizes',
            'product_id',
            'size_id'
        )->withTimestamps();
    }
}