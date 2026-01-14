<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Product Aliases (Multiple references/SKUs per product)
        Schema::create('product_aliases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('alias')->index(); // The extra SKU/Reference
            $table->string('description')->nullable(); // e.g. "Barcode", "Old SKU", "Vendor SKU"
            $table->boolean('is_main')->default(false); // If true, might override main reference display? Or just a flag.
            $table->timestamps();
        });

        // 2. Applications (Tree structure for "Aplicación" - Vehicles/Machines)
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->nullable()->constrained('applications')->nullOnDelete();
            $table->string('name');
            $table->string('slug')->nullable(); // Simplify, maybe not unique if nested? Let's keep distinct.
            $table->string('image_path')->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        // 3. Product <-> Application Pivot
        Schema::create('product_application', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('application_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            
            $table->unique(['product_id', 'application_id']);
        });

        // 4. Product Storage Locations (Specific strings per Warehouse per Product)
        Schema::create('product_storage_locations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('warehouse_id')->constrained()->cascadeOnDelete();
            $table->string('location_name'); // e.g. "Aisle 1, Shelf B"
            $table->timestamps();
        });

        // 5. Update Products table
        Schema::table('products', function (Blueprint $table) {
            $table->string('unit_of_measure')->default('UNID')->after('name'); // UNID, KG, MT, etc.
            // Check if unit_cost is needed separate from purchase_price? 
            // Often purchase_price IS the unit cost, or we use average weighted cost.
            // User requirement: "manejar Precio de venta, Costo unitario". 
            // We already have 'price' (Venta) and 'purchase_price' (Costo?). 
            // Let's ensure purchase_price is treated as Costo Unitario.
            // Maybe add 'average_cost' if we want to track that separately from last purchase price.
            // For now, purchase_price acts as cost.
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['unit_of_measure']);
        });

        Schema::dropIfExists('product_storage_locations');
        Schema::dropIfExists('product_application');
        Schema::dropIfExists('applications');
        Schema::dropIfExists('product_aliases');
    }
};
