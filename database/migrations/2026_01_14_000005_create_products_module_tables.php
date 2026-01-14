<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Brands
        Schema::create('brands', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps();
        });

        // 2. Categories
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps();
        });

        // 3. Tags
        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('color')->default('#CCCCCC'); // Hex color
            $table->timestamps();
        });

        // 4. Products
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique()->index(); // Should match price_list_items.inventory_code
            $table->string('name');
            $table->text('description')->nullable();
            
            $table->foreignId('brand_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            
            // Pricing & Costs
            $table->decimal('purchase_price', 15, 2)->default(0);
            $table->decimal('price', 15, 2)->default(0); // Base sale price
            $table->decimal('tax_rate', 5, 2)->default(0); // e.g., 19.00
            
            // Stock (Read-Only context for this module, but field exists)
            $table->decimal('stock', 15, 2)->default(0);
            
            // Toggles
            $table->boolean('is_active')->default(true); // "Desactivar / Activar ítem"
            $table->boolean('is_public')->default(false); // "Publicar en la web"
            $table->boolean('is_inventariable')->default(true);
            $table->boolean('is_rotative')->default(false);
            
            $table->string('main_image_path')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
        });

        // 5. Product Images (Extras)
        Schema::create('product_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('path');
            $table->boolean('is_main')->default(false);
            $table->timestamps();
        });

        // 6. Product Equivalences (Bidirectional A <-> B)
        Schema::create('product_equivalences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_a_id')->constrained('products')->cascadeOnDelete();
            $table->foreignId('product_b_id')->constrained('products')->cascadeOnDelete();
            $table->timestamps();
            
            $table->unique(['product_a_id', 'product_b_id']);
        });

        // 7. Product Tags Pivot
        Schema::create('product_tag', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('tag_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            
            $table->unique(['product_id', 'tag_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_tag');
        Schema::dropIfExists('product_equivalences');
        Schema::dropIfExists('product_images');
        Schema::dropIfExists('products');
        Schema::dropIfExists('tags');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('brands');
    }
};
