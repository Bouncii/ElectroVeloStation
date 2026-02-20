<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Reservation>
 */
class ReservationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array{
        $start = $this->faker->dateTimeBetween('now', '+2 months');
        $end = (clone $start)->modify('+' . rand(1, 720) . ' hours'); 

        return [
            'start_date' => $start,
            'end_date' => $end,
            'user_id' => \App\Models\User::factory(),
            'pickup_station_id' => \App\Models\Station::factory(),
            'return_station_id' => \App\Models\Station::factory(),
            'status' => 'pending', 
        ];
    }
}
