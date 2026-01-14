<?php

use App\Http\Controllers\Contacts\ContactController;
use App\Http\Controllers\Contacts\ContactDocumentController;
use App\Http\Controllers\Contacts\GeographicController;
use App\Http\Controllers\Contacts\TemporaryContactController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    // Main contacts resource
    Route::resource('contacts', ContactController::class);

    // Contact documents
    Route::post('contacts/{contact}/documents', [ContactDocumentController::class, 'store'])
        ->name('contacts.documents.store');
    Route::delete('documents/{document}', [ContactDocumentController::class, 'destroy'])
        ->name('documents.destroy');

    // Temporary contacts (prospects)
    Route::resource('temporary-contacts', TemporaryContactController::class)
        ->except(['show', 'edit', 'create']);
    Route::post('temporary-contacts/{temporaryContact}/convert', [TemporaryContactController::class, 'convert'])
        ->name('temporary-contacts.convert');

    // Geographic APIs for cascading selects
    Route::prefix('api')->group(function () {
        Route::get('countries', [GeographicController::class, 'countries'])->name('api.countries');
        Route::get('departments/{country}', [GeographicController::class, 'departments'])->name('api.departments');
        Route::get('cities/{department}', [GeographicController::class, 'cities'])->name('api.cities');
    });
});
