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
        Schema::create('velos', function (Blueprint $table) {
            $table->id();
            $table->integer('taille');
            $table->enum('etat', ['libre', 'utilise', 'transportPending', 'renduPending'])->default('libre');
            $table->foreignId('station_id')->constrained('stations')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('velos');
    }
};
