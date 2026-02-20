<?php

namespace Database\Factories;
use App\Models\Attribution;
use App\Models\Reservation;
use App\Models\Person;
use App\Models\Bike;
use Illuminate\Database\Eloquent\Factories\Factory;

class AttributionFactory extends Factory
{
    protected $model = Attribution::class;

    public function definition(): array
    {
        return [
            'reservation_id' => Reservation::factory(),
            'person_id' => Person::factory(),
            'bike_id'=> Bike::factory()
        ];
    }
}