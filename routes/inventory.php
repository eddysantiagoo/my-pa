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

    // Brands
    Route::get('inventory/brands-list', [\App\Http\Controllers\Inventory\BrandController::class, 'list'])->name('brands.list'); // For Selects
    Route::resource('inventory/brands', \App\Http\Controllers\Inventory\BrandController::class); // For Management CRUD

    // Categories
    Route::get('inventory/categories-list', [\App\Http\Controllers\Inventory\CategoryController::class, 'list'])->name('categories.list');
    Route::resource('inventory/categories', \App\Http\Controllers\Inventory\CategoryController::class);

    // Applications
    Route::get('inventory/applications-list', [\App\Http\Controllers\Inventory\ApplicationController::class, 'list'])->name('applications.list');
    Route::resource('inventory/applications', \App\Http\Controllers\Inventory\ApplicationController::class);
});
