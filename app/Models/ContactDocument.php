<?php

namespace App\Models;

use App\Services\FileStorageInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class ContactDocument extends Model
{
    protected $fillable = [
        'contact_id',
        'document_type',
        'disk',
        'file_path',
        'original_name',
        'mime_type',
        'size',
    ];

    protected $casts = [
        'size' => 'integer',
    ];

    /**
     * Document types available.
     */
    public const DOCUMENT_TYPES = [
        'RUT' => 'RUT',
        'CEDULA' => 'Cédula',
        'CAMARA_COMERCIO' => 'Cámara de Comercio',
        'CERTIFICADO_BANCARIO' => 'Certificado Bancario',
        'CONTRATO' => 'Contrato',
        'OTRO' => 'Otro',
    ];

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }

    /**
     * Get the URL for the document.
     */
    public function getUrlAttribute(): string
    {
        return Storage::disk($this->disk)->url($this->file_path);
    }

    /**
     * Get a temporary URL for the document (useful for S3).
     */
    public function getTemporaryUrl(int $minutes = 60): string
    {
        if ($this->disk === 'public') {
            return $this->url;
        }

        return Storage::disk($this->disk)->temporaryUrl($this->file_path, now()->addMinutes($minutes));
    }

    /**
     * Delete the file from storage when model is deleted.
     */
    protected static function booted(): void
    {
        static::deleting(function (ContactDocument $document) {
            Storage::disk($document->disk)->delete($document->file_path);
        });
    }
}
