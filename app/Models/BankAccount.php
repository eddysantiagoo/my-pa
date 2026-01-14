<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BankAccount extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;

    protected $fillable = [
        'name',
        'account_number',
        'type',
        'initial_balance',
        'description',
        'meta_data',
    ];

    protected $casts = [
        'initial_balance' => 'decimal:2',
        'meta_data' => 'array',
    ];

    public function transactions()
    {
        return $this->hasMany(BankTransaction::class);
    }
}
