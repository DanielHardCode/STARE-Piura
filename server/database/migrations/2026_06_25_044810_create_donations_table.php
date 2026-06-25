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
        Schema::create('donations', function (Blueprint $table) {
            $table->string('id', 50)->primary();
            $table->string('donor_id', 50);
            $table->foreign('donor_id')->references('id')->on('donors')->restrictOnDelete();
            $table->string('donor_nombre', 255);
            $table->string('tipo', 50);
            $table->string('medio_pago', 50)->nullable();
            $table->decimal('monto', 12, 2)->nullable();
            $table->json('items')->nullable();
            $table->text('descripcion')->nullable();
            $table->string('fondo_destino', 50)->nullable();
            $table->string('event_id', 50)->nullable()->constrained('events')->nullOnDelete();
            $table->text('comprobante_url')->nullable();
            $table->date('fecha');
            $table->timestampTz('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donations');
    }
};
