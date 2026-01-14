<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Warehouses (Bodegas)
        Schema::create('warehouses', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->string('address')->nullable();
            $table->boolean('is_default')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        // 2. Stocks (Pivot: Product <-> Warehouse)
        Schema::create('stocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('warehouse_id')->constrained()->cascadeOnDelete();
            $table->decimal('quantity', 15, 2)->default(0);
            $table->timestamps();

            $table->unique(['product_id', 'warehouse_id']);
        });

        // 3. Inventory Transactions (Audit Log / Kardex)
        Schema::create('inventory_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('warehouse_id')->constrained()->cascadeOnDelete();
            $table->string('type'); // adjustment, transfer_in, transfer_out, sale, purchase, initial
            
            $table->decimal('quantity', 15, 2); // Change amount (+ or -)
            $table->decimal('previous_quantity', 15, 2); // Snapshot before
            $table->decimal('new_quantity', 15, 2); // Snapshot after
            
            // Polymorphic relation to source (Adjustment, Transfer, Sale, etc.)
            $table->nullableMorphs('reference');
            
            $table->foreignId('user_id')->nullable()->constrained(); // Responsible
            $table->timestamp('created_at')->useCurrent();
        });

        // 4. Inventory Adjustments (Manual Corrections)
        Schema::create('inventory_adjustments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('warehouse_id')->constrained();
            // Note: One adjustment per product as per rules, or header/detail? 
            // Prompts says "One adjustment = one product". Keeping it simple.
            $table->foreignId('product_id')->constrained();
            
            $table->enum('type', ['increment', 'decrement']);
            $table->decimal('quantity', 15, 2);
            $table->decimal('unit_cost', 15, 2)->nullable()->comment('Informative');
            
            $table->date('date');
            $table->text('observations')->nullable();
            $table->foreignId('user_id')->constrained(); // Creator
            
            $table->timestamps();
        });

        // 5. Warehouse Transfers (Headers)
        Schema::create('warehouse_transfers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('origin_warehouse_id')->constrained('warehouses');
            $table->foreignId('destination_warehouse_id')->constrained('warehouses');
            
            $table->enum('status', ['pending', 'confirmed', 'cancelled'])->default('pending');
            $table->text('observations')->nullable();
            
            $table->foreignId('user_id')->constrained(); // Creator
            $table->timestamp('confirmed_at')->nullable();
            
            $table->timestamps();
        });

        // 6. Warehouse Transfer Items (Details)
        Schema::create('warehouse_transfer_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transfer_id')->constrained('warehouse_transfers')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained();
            $table->decimal('quantity', 15, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('warehouse_transfer_items');
        Schema::dropIfExists('warehouse_transfers');
        Schema::dropIfExists('inventory_adjustments');
        Schema::dropIfExists('inventory_transactions');
        Schema::dropIfExists('stocks');
        Schema::dropIfExists('warehouses');
    }
};
