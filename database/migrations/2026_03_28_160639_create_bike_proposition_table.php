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
        Schema::create('bike_proposition', function (Blueprint $table) {
            $table->foreignId('bike_id')->constrained()->onDelete('cascade');
            $table->foreignId('proposition_id')->constrained()->onDelete('cascade');
            $table->primary(['bike_id', 'proposition_id']); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bike_proposition');
    }
};
