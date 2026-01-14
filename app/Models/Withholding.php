<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Withholding extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;

    protected $fillable = ['name', 'rate', 'type', 'min_base', 'is_active', 'description'];

    protected $casts = [
        'rate' => 'decimal:2',
        'min_base' => 'decimal:2',
        'is_active' => 'boolean',
    ];
}
