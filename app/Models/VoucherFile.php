<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VoucherFile extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'files_voucher';

    protected $guarded = [];

    public function voucher(): BelongsTo
    {
        return $this->belongsTo(Voucher::class);
    }
}
