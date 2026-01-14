<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Asegura columnas nuevas en instalaciones existentes
        Schema::table('price_lists', function (Blueprint $table) {
            if (!Schema::hasColumn('price_lists', 'type')) {
                $table->enum('type', ['base', 'percentage', 'fixed'])->default('base');
            }

            if (!Schema::hasColumn('price_lists', 'percentage')) {
                $table->decimal('percentage', 5, 2)->default(0)->comment('Margin or discount');
            }
        });
    }

    public function down(): void
    {
        Schema::table('price_lists', function (Blueprint $table) {
            if (Schema::hasColumn('price_lists', 'percentage')) {
                $table->dropColumn('percentage');
            }

            if (Schema::hasColumn('price_lists', 'type')) {
                $table->dropColumn('type');
            }
        });
    }
};
