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
        Schema::create('supply_items', function (Blueprint $table) {
            $table->string('id', 50)->primary();
            $table->string('event_id', 50);
            $table->foreign('event_id')->references('id')->on('events')->cascadeOnDelete();
            $table->string('nombre', 255);
            $table->string('categoria', 50);
            $table->string('unidad', 50);
            $table->integer('cantidad_requerida');
            $table->integer('cantidad_cubierta')->default(0);
            $table->decimal('precio_unitario_estimado', 12, 2);
            $table->timestampTz('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('supply_items');
    }
};
