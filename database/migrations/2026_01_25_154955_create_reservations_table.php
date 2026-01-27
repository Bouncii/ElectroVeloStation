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
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->dateTime('debut');
            $table->dateTime('fin');
            $table->enum('status', ['en_attente', 'confirmee', 'annulee', 'terminee'])->default('en_attente');
            
            $table->foreignId('id_utilisateur')->constrained('utilisateurs');
            $table->foreignId('station_depart')->constrained('stations');
            $table->foreignId('station_arivee')->constrained('stations');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
