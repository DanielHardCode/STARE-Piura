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
        Schema::create('events', function (Blueprint $table) {
            $table->string('id', 50)->primary();
            $table->string('organization_id', 50)->nullable()->constrained('organizations')->nullOnDelete();
            $table->string('organization_nombre', 255)->nullable();
            $table->string('title', 255);
            $table->text('description')->nullable();
            $table->string('distrito', 100);
            $table->string('target_audience', 255);
            $table->timestampTz('start_time');
            $table->timestampTz('end_time');
            $table->string('status', 50);
            $table->string('coordinador_id', 50)->nullable();
            $table->text('notes')->nullable();
            $table->timestampsTz();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
