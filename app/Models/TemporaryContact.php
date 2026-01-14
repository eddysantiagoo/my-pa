<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TemporaryContact extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'email',
        'status',
        'converted_to',
    ];

    public const STATUS_INCOMPLETE = 'incomplete';
    public const STATUS_CONVERTED = 'converted';
    public const STATUS_DISCARDED = 'discarded';

    public function convertedContact(): BelongsTo
    {
        return $this->belongsTo(Contact::class, 'converted_to');
    }

    /**
     * Convert this temporary contact to a formal contact.
     */
    public function convertToContact(array $additionalData = []): Contact
    {
        $contact = Contact::create(array_merge([
            'name' => $this->name,
            'phone' => $this->phone,
            'email' => $this->email,
            'is_customer' => true,
        ], $additionalData));

        $this->update([
            'status' => self::STATUS_CONVERTED,
            'converted_to' => $contact->id,
        ]);

        return $contact;
    }

    /**
     * Scope for incomplete contacts only.
     */
    public function scopeIncomplete($query)
    {
        return $query->where('status', self::STATUS_INCOMPLETE);
    }

    /**
     * Scope for searching.
     */
    public function scopeSearch($query, ?string $search)
    {
        if (empty($search)) {
            return $query;
        }

        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('phone', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
        });
    }
}
