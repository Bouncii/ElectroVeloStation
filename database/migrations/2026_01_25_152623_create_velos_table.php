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
            
            $table->enum('etat', [
                'utilise', 
                'libre', 
                'transportPending', 
                'renduPending'
            ])->default('libre');

            $table->foreignId('id_station')->constrained('stations');
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
