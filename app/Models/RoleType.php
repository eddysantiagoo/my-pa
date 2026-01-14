<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RoleType extends Model
{
    protected $fillable = [
        'code',
        'name',
        'description',
    ];

    public function roles(): HasMany
    {
        return $this->hasMany(Role::class);
    }
}
