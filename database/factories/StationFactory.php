<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Station>
 */
class StationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array{
        return [
            'name' => $this->faker->streetName() . ' Station',
            'latitude' => $this->faker->latitude(42.0, 51.0), 
            'longitude' => $this->faker->longitude(-4.0, 8.0),
        ];
    }
}
