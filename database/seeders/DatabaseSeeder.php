<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Station;
use App\Models\Bike;
use App\Models\Person;
use App\Models\Reservation;
use App\Models\Attribution;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $stations = Station::factory(5)->create();

        $bikes = Bike::factory(30)->create([
            'station_id' => fn() => $stations->random()->id,
            'state' => 'available'
        ]);

        User::factory()->create([
            'first_name' => 'Admin',
            'last_name' => 'System',
            'email' => 'admin@test.com',
            'role' => 'admin',
        ]);

        $client = User::factory()->create([
            'first_name' => 'Jean',
            'last_name' => 'Dupont',
            'email' => 'client@test.com',
            'role' => 'client',
        ]);

        $family = Person::factory(3)->create([
            'user_id' => $client->id,
            'last_name' => 'Dupont'
        ]);

        Reservation::factory(5)->create([
            'user_id' => $client->id,
            'pickup_station_id' => fn() => $stations->random()->id,
            'return_station_id' => fn() => $stations->random()->id,
            'status' => 'pending',
        ])->each(function ($reservation) use ($family, $bikes) {
            
            $selectedPeople = $family->random(rand(1, 2));

            foreach ($selectedPeople as $person) {
                Attribution::create([
                    'reservation_id' => $reservation->id,
                    'person_id' => $person->id,
                    'bike_id' => $bikes->random()->id, 
                ]);
            }
        });

        Reservation::factory(10)->create([
            'pickup_station_id' => fn() => $stations->random()->id,
            'return_station_id' => fn() => $stations->random()->id,
        ]);
    }
}