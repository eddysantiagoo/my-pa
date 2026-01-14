<?php

use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::delete('inventory/products/bulk-destroy', [ProductController::class, 'bulkDestroy'])->name('products.bulk-destroy');
    Route::get('inventory/products/{product}/barcode', [ProductController::class, 'generateBarcode'])->name('products.barcode');
    Route::resource('inventory/products', ProductController::class);
});
