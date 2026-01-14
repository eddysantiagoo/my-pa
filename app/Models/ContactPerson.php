<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContactPerson extends Model
{
    protected $table = 'contact_persons';

    protected $fillable = [
        'contact_id',
        'name',
        'email',
        'phone',
        'cellphone',
        'receives_notifications',
    ];

    protected $casts = [
        'receives_notifications' => 'boolean',
    ];

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }

    /**
     * Scope for persons that receive notifications.
     */
    public function scopeReceivesNotifications($query)
    {
        return $query->where('receives_notifications', true);
    }
}
