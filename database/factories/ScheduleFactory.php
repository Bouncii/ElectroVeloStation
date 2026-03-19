<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Schedule>
 */
class ScheduleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'open_time'   => '08:00:00',
            'close_time'  => '19:00:00',
            'day_of_week' => 0,
            'station_id'  => \App\Models\Station::factory(),
        ];
    }
}
