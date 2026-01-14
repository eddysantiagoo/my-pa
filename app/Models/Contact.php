<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Contact extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'identification_type',
        'identification_number',
        'name',
        'email',
        'phone',
        'phone2',
        'fax',
        'cellphone',
        'is_customer',
        'is_supplier',
        'contact_category',
        'credit_term',
        'credit_limit',
        'ecommerce_discount',
        'price_list_id',
        'seller_id',
        'observations',
    ];

    protected $casts = [
        'is_customer' => 'boolean',
        'is_supplier' => 'boolean',
        'credit_term' => 'integer',
        'credit_limit' => 'decimal:2',
        'ecommerce_discount' => 'decimal:2',
    ];

    /**
     * Identification types available.
     */
    public const IDENTIFICATION_TYPES = [
        'CC' => 'Cédula de Ciudadanía',
        'NIT' => 'NIT',
        'DIE' => 'Documento de Identificación Extranjero',
        'CE' => 'Cédula de Extranjería',
        'PP' => 'Pasaporte',
    ];

    public function priceList(): BelongsTo
    {
        return $this->belongsTo(PriceList::class);
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function addresses(): HasMany
    {
        return $this->hasMany(ContactAddress::class);
    }

    public function primaryAddress(): ?ContactAddress
    {
        return $this->addresses()->where('is_primary', true)->first();
    }

    public function persons(): HasMany
    {
        return $this->hasMany(ContactPerson::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(ContactDocument::class);
    }

    public function observations(): HasMany
    {
        return $this->hasMany(ContactObservation::class)->orderByDesc('created_at');
    }

    /**
     * Scope for customers only.
     */
    public function scopeCustomers($query)
    {
        return $query->where('is_customer', true);
    }

    /**
     * Scope for suppliers only.
     */
    public function scopeSuppliers($query)
    {
        return $query->where('is_supplier', true);
    }

    /**
     * Search scope for flexible searching.
     */
    public function scopeSearch($query, ?string $search)
    {
        if (empty($search)) {
            return $query;
        }

        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('identification_number', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('phone', 'like', "%{$search}%")
                ->orWhere('cellphone', 'like', "%{$search}%");
        });
    }
}
