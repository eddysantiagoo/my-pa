<?php

use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::delete('inventory/products/bulk-destroy', [ProductController::class, 'bulkDestroy'])->name('products.bulk-destroy');
    Route::get('inventory/products/{product}/barcode', [ProductController::class, 'generateBarcode'])->name('products.barcode');
    Route::resource('inventory/products', ProductController::class);

    // Warehouses
    Route::resource('inventory/warehouses', \App\Http\Controllers\Inventory\WarehouseController::class)->except(['show', 'create', 'edit']);

    // Price Lists
    Route::resource('inventory/price-lists', \App\Http\Controllers\Inventory\PriceListController::class)->except(['show', 'create', 'edit']);

    // Adjustments
    Route::resource('inventory/adjustments', \App\Http\Controllers\Inventory\InventoryAdjustmentController::class)->only(['index', 'create', 'store', 'show']);

    // Transfers
    Route::post('inventory/transfers/{transfer}/confirm', [\App\Http\Controllers\Inventory\WarehouseTransferController::class, 'confirm'])->name('transfers.confirm');
    Route::post('inventory/transfers/{transfer}/cancel', [\App\Http\Controllers\Inventory\WarehouseTransferController::class, 'cancel'])->name('transfers.cancel');
    Route::resource('inventory/transfers', \App\Http\Controllers\Inventory\WarehouseTransferController::class)->only(['index', 'create', 'store']);
});
