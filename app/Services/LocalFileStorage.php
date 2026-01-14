<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class LocalFileStorage implements FileStorageInterface
{
    protected string $disk = 'public';

    public function store(UploadedFile $file, string $path): string
    {
        return $file->store($path, $this->disk);
    }

    public function delete(string $path): bool
    {
        return Storage::disk($this->disk)->delete($path);
    }

    public function getUrl(string $path): string
    {
        return Storage::disk($this->disk)->url($path);
    }

    public function getTemporaryUrl(string $path, int $minutes = 60): string
    {
        // Local storage doesn't support temporary URLs, return regular URL
        return $this->getUrl($path);
    }

    public function exists(string $path): bool
    {
        return Storage::disk($this->disk)->exists($path);
    }

    public function getDisk(): string
    {
        return $this->disk;
    }
}
