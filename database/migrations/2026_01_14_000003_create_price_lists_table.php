<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Listas de precios
        Schema::create('price_lists', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('description')->nullable();
            
            // New fields for derived lists
            $table->enum('type', ['base', 'percentage', 'fixed'])->default('base');
            $table->decimal('percentage', 5, 2)->default(0)->comment('Margin or discount');
            
            $table->boolean('is_default')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Precios por producto (para precios fijos por lista)
        Schema::create('price_list_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('price_list_id')->constrained()->cascadeOnDelete();
            $table->string('inventory_code');           // código del producto en inventario
            $table->decimal('price', 15, 2);
            $table->decimal('discount_percentage', 5, 2)->default(0);
            $table->timestamps();
            $table->unique(['price_list_id', 'inventory_code']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('price_list_items');
        Schema::dropIfExists('price_lists');
    }
};
