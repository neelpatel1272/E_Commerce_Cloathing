<?php

namespace Database\Seeders;

use App\Models\Size;
use Illuminate\Database\Seeder;

class SizeSeeder extends Seeder
{
    public function run(): void
    {
        $sizes = [
            'XS',
            'S',
            'M',
            'L',
            'XL',
            'XXL',
            'XXXL',
        ];

        foreach ($sizes as $size) {
            Size::firstOrCreate([
                'name' => $size,
            ]);
        }
    }
}