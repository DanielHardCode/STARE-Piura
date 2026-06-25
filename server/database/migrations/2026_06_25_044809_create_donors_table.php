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
        Schema::create('donors', function (Blueprint $table) {
            $table->string('id', 50)->primary();
            $table->string('nombres', 255);
            $table->string('tipo', 50);
            $table->string('documento', 20);
            $table->string('telefono', 50)->nullable();
            $table->string('email', 255)->nullable();
            $table->string('distrito', 100)->nullable();
            $table->string('mype_id', 50)->nullable()->constrained('mypes')->nullOnDelete();
            $table->timestampTz('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donors');
    }
};
