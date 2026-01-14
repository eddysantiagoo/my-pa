<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;

interface FileStorageInterface
{
    /**
     * Store a file and return the path.
     */
    public function store(UploadedFile $file, string $path): string;

    /**
     * Delete a file.
     */
    public function delete(string $path): bool;

    /**
     * Get the URL for a file.
     */
    public function getUrl(string $path): string;

    /**
     * Get a temporary URL for a file (useful for private S3 files).
     */
    public function getTemporaryUrl(string $path, int $minutes = 60): string;

    /**
     * Check if a file exists.
     */
    public function exists(string $path): bool;

    /**
     * Get the disk name being used.
     */
    public function getDisk(): string;
}
