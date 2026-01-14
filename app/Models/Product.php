<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'reference',
        'name',
        'description',
        'brand_id',
        'category_id',
        'purchase_price',
        'price',
        'tax_rate',
        'stock',
        'unit_of_measure', // New
        'is_active',
        'is_public',
        'is_inventariable',
        'is_rotative',
        'main_image_path',
    ];

    protected $casts = [
        'purchase_price' => 'decimal:2',
        'price' => 'decimal:2',
        'tax_rate' => 'decimal:2',
        'stock' => 'decimal:2',
        'is_active' => 'boolean',
        'is_public' => 'boolean',
        'is_inventariable' => 'boolean',
        'is_rotative' => 'boolean',
    ];

    // Relationships

    public function aliases(): HasMany
    {
        return $this->hasMany(ProductAlias::class);
    }

    public function applications(): BelongsToMany
    {
        return $this->belongsToMany(Application::class);
    }

    public function storageLocations(): HasMany
    {
        return $this->hasMany(ProductStorageLocation::class);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    public function stocks(): HasMany
    {
        return $this->hasMany(Stock::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(InventoryTransaction::class);
    }

    public function priceListItems(): HasMany
    {
        // Assumes reference maps to inventory_code
        return $this->hasMany(PriceListItem::class, 'inventory_code', 'reference');
    }

    // Bidirectional Equivalences
    // We can define two relationships and merge them via an accessor or service logic
    public function equivalencesA(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'product_equivalences', 'product_a_id', 'product_b_id');
    }

    public function equivalencesB(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'product_equivalences', 'product_b_id', 'product_a_id');
    }

    // Helper to get all equivalent products
    public function getEquivalencesAttribute()
    {
        return $this->equivalencesA->merge($this->equivalencesB);
    }
}
