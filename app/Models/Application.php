<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Application extends Model
{
    protected $fillable = [
        'parent_id',
        'name',
        'slug',
        'image_path',
        'order',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Application::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Application::class, 'parent_id')->orderBy('order')->orderBy('name');
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class);
    }
}
