<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('banks', \App\Http\Controllers\BankAccountController::class);
    Route::get('banks/{bank}/transactions', [\App\Http\Controllers\BankTransactionController::class, 'index'])->name('banks.transactions.index');
    Route::post('banks/{bank}/transactions', [\App\Http\Controllers\BankTransactionController::class, 'store'])->name('banks.transactions.store');

    // Configuration Routes
    Route::get('/configuration', [\App\Http\Controllers\ConfigurationController::class, 'index'])->name('configuration.index');
    Route::post('/configuration/{module}', [\App\Http\Controllers\ConfigurationController::class, 'update'])->name('configuration.update');

    // PaymentTerms CRUD
    Route::resource('configuration/payment-terms', \App\Http\Controllers\PaymentTermController::class)->except(['show'])->parameters(['payment-terms' => 'paymentTerm']);

    // Numbering CRUD
    Route::resource('configuration/numbering', \App\Http\Controllers\NumberingController::class)->except(['show']);

    // Tax CRUD
    Route::resource('configuration/taxes', \App\Http\Controllers\TaxController::class)->except(['show']);

    // Seller CRUD
    Route::resource('configuration/sellers', \App\Http\Controllers\SellerController::class)->except(['show']);

    // Company CRUD
    Route::resource('configuration/company', \App\Http\Controllers\CompanyController::class)->except(['show']);

    // Withholding CRUD
    Route::resource('configuration/withholdings', \App\Http\Controllers\WithholdingController::class)->except(['show']);

    // User Types CRUD
    Route::resource('configuration/user-types', \App\Http\Controllers\UserTypeController::class)->except(['show'])->parameters(['user-types' => 'userType']);

    // Users CRUD (Configuration context)
    Route::resource('configuration/users', \App\Http\Controllers\Configuration\UserController::class)->except(['show']);

    // Profile (Current user)
    Route::get('/configuration/profile', [\App\Http\Controllers\Configuration\ProfileController::class, 'index'])->name('configuration.profile.index');
    Route::post('/configuration/profile', [\App\Http\Controllers\Configuration\ProfileController::class, 'update'])->name('configuration.profile.update');

    // Tags CRUD
    Route::resource('configuration/tags', \App\Http\Controllers\TagController::class)->except(['show']);

    // Configuration Sub-Modules (CRUDs) - Placeholders for modules not yet implemented
    $placeholderRoutes = [
        'security',
        'general-data',
        'watermark',
        'pos-general',
        'contact-types',
        'barcodes',
        'inventory-fields',
        'subscription-payments',
        'custom-plan',
        'plans',
        'payment-methods',
        'categories',
        'puc',
        'locations',
        'seller-goals',
        'crm-tags',
        'buyers',
        'payment-preferences',
        'fixed-calculations',
        'dian-assistant',
        'subscription-plans',
        'table-columns',
    ];

    foreach ($placeholderRoutes as $route) {
        Route::get("/configuration/{$route}", function () use ($route) {
            return Inertia::render('Configuration/Placeholder', ['title' => ucfirst(str_replace('-', ' ', $route))]);
        })->name("configuration.{$route}.index");

        if ($route === 'locations') {
            Route::get("/configuration/{$route}/create", function () {
                return Inertia::render('Configuration/Placeholder', ['title' => 'Create Location']);
            })->name("configuration.{$route}.create");
        }
    }
});

require __DIR__ . '/settings.php';
require __DIR__ . '/contacts.php';
require __DIR__ . '/inventory.php';

