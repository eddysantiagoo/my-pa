<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Voucher extends Model
{
    use HasFactory, HasUuids;

    protected $guarded = [];

    protected $casts = [
        'seller_json' => 'array',
        'provider_json' => 'array',
        'user_created_json' => 'array',
        'invoice_json' => 'array',
        'total' => 'decimal:2',
    ];

    public function files(): HasMany
    {
        return $this->hasMany(VoucherFile::class);
    }
}
