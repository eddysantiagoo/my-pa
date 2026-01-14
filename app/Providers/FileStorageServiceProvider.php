<?php

namespace App\Providers;

use App\Services\FileStorageInterface;
use App\Services\LocalFileStorage;
use App\Services\S3FileStorage;
use Illuminate\Support\ServiceProvider;

class FileStorageServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(FileStorageInterface::class, function ($app) {
            // Para cambiar a S3, simplemente cambia esta línea o usa una variable de entorno
            $driver = config('filesystems.contact_documents', 'local');

            return match ($driver) {
                's3' => new S3FileStorage(),
                default => new LocalFileStorage(),
            };
        });
    }

    public function boot(): void
    {
        //
    }
}
