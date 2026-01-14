<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Contactos principales
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->string('identification_type');        // CC, NIT, DIE, CE, PP
            $table->string('identification_number')->unique();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('phone2')->nullable();
            $table->string('fax')->nullable();
            $table->string('cellphone')->nullable();
            $table->boolean('is_customer')->default(false);
            $table->boolean('is_supplier')->default(false);
            $table->string('contact_category')->nullable(); // VARIOS, ALMACEN, TALLER, etc.
            $table->integer('credit_term')->nullable();     // días de crédito
            $table->decimal('credit_limit', 15, 2)->nullable();
            $table->decimal('ecommerce_discount', 5, 2)->nullable();
            $table->foreignId('price_list_id')->nullable()->constrained();
            $table->foreignId('seller_id')->nullable()->constrained('users');
            $table->text('observations')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['is_customer', 'is_supplier']);
            $table->index('contact_category');
            $table->index('name');
        });

        // Direcciones del contacto
        Schema::create('contact_addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contact_id')->constrained()->cascadeOnDelete();
            $table->foreignId('country_id')->constrained();
            $table->foreignId('department_id')->nullable()->constrained();
            $table->foreignId('city_id')->nullable()->constrained();
            $table->string('address');
            $table->string('postal_code')->nullable();
            $table->boolean('is_primary')->default(false);
            $table->timestamps();
        });

        // Personas asociadas al contacto
        Schema::create('contact_persons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contact_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('cellphone')->nullable();
            $table->boolean('receives_notifications')->default(true);
            $table->timestamps();
        });

        // Documentos adjuntos
        Schema::create('contact_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contact_id')->constrained()->cascadeOnDelete();
            $table->string('document_type');              // RUT, CEDULA, CONTRATO, etc.
            $table->string('disk')->default('public');    // 'public' o 's3' para migración futura
            $table->string('file_path');
            $table->string('original_name');
            $table->string('mime_type')->nullable();
            $table->unsignedBigInteger('size')->nullable();
            $table->timestamps();
        });

        // Observaciones con trazabilidad
        Schema::create('contact_observations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contact_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained();
            $table->text('content');
            $table->timestamps();
        });

        // Contactos temporales (prospectos)
        Schema::create('temporary_contacts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('phone');
            $table->string('email')->nullable();
            $table->string('status')->default('incomplete');
            $table->foreignId('converted_to')->nullable()->constrained('contacts');
            $table->timestamps();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('temporary_contacts');
        Schema::dropIfExists('contact_observations');
        Schema::dropIfExists('contact_documents');
        Schema::dropIfExists('contact_persons');
        Schema::dropIfExists('contact_addresses');
        Schema::dropIfExists('contacts');
    }
};
