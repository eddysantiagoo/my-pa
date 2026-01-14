<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('numberings', function (Blueprint $table) {
            $table->id();
            $table->string('prefix')->nullable();
            $table->integer('next_number')->default(1);
            $table->string('document_type'); // e.g., invoice, quote, order
            $table->boolean('is_active')->default(true);
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('numberings');
    }
};
