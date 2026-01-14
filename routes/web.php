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

    Route::resource('vouchers', \App\Http\Controllers\VoucherController::class);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/contacts.php';
require __DIR__ . '/inventory.php';

