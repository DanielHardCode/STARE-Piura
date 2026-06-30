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
        Schema::create('organizations', function (Blueprint $table) {
            $table->string('id', 50)->primary();
            $table->string('nombre', 255);
            $table->string('tipo', 50);
            $table->text('direccion');
            $table->string('distrito', 100);
            $table->string('telefono', 50)->nullable();
            $table->string('encargado', 255);
            $table->string('email', 255)->nullable();
            $table->integer('beneficiarios_estimados');
            $table->json('necesidades')->default('[]');
            $table->boolean('activo')->default(true);
            $table->timestampsTz();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('organizations');
    }
};
