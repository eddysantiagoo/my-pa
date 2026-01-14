<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Numbering extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;

    protected $fillable = ['prefix', 'next_number', 'document_type', 'is_active', 'description'];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
