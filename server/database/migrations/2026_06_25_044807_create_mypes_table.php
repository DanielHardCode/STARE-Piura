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
        Schema::create('mypes', function (Blueprint $table) {
            $table->string('id', 50)->primary();
            $table->string('razon_social', 255);
            $table->string('ruc', 20)->unique();
            $table->string('rubro', 50);
            $table->string('contacto', 255);
            $table->string('telefono', 50);
            $table->string('email', 255)->nullable();
            $table->string('distrito', 100);
            $table->boolean('activo')->default(true);
            $table->decimal('historial_aportes', 12, 2)->default(0.00);
            $table->timestampsTz();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mypes');
    }
};
