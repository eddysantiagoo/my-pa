<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vouchers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->json('seller_json')->nullable()->comment('Buyer / purchaser info');
            $table->json('provider_json')->nullable()->comment('Supplier info');
            $table->string('type_voucher_id')->nullable()->index(); // Assuming FK to a types table or just a string ID
            $table->decimal('total', 15, 2)->default(0);
            $table->string('label')->nullable()->comment('Status / tag');
            $table->text('notes')->nullable();
            $table->json('user_created_json')->nullable();
            $table->json('invoice_json')->nullable()->comment('Additional invoice data');
            $table->unsignedBigInteger('company_id')->index();
            $table->string('document_id')->nullable()->index();
            $table->timestamps();
        });

        Schema::create('files_voucher', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('voucher_id')->constrained('vouchers')->cascadeOnDelete();
            $table->string('path');
            $table->string('original_name');
            $table->enum('type_file', ['vouchers', 'invoice_file'])->default('vouchers');
            $table->enum('status_file', ['PENDING', 'APPROVED', 'REJECTED', 'DELETED'])->default('PENDING');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('files_voucher');
        Schema::dropIfExists('vouchers');
    }
};
