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
        Schema::create('journees', function (Blueprint $table) {
            $table->id();
            $table->time('ouverture');
            $table->time('fermeture');
            $table->integer('jour'); 
            $table->foreignId('id_station')->constrained('stations')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('journees');
    }
};
