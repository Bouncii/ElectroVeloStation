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
    public function run(): void
    {
        $stations = Station::factory(10)->create();
        
        $stations->each(function ($station) {
            Bike::factory(5)->create([
                'station_id' => $station->id
            ]);
        });

        $users = User::factory(20)->create();
        
        $users->each(function ($user) {
            Person::factory(rand(0, 3))->create([
                'user_id' => $user->id
            ]);
        });

        Person::factory(10)->create(['user_id' => null]);

        foreach(range(1, 20) as $i) {
            $isAnonymous = ($i > 15);
            $user = $isAnonymous ? null : $users->random();
            
            $reservation = Reservation::factory()->create([
                'user_id' => $user ? $user->id : null,
                'station_id' => $stations->random()->id,
                'email' => $user ? $user->email : fake()->safeEmail(),
            ]);

            $possiblePerson = $reservation->user_id 
                ? Person::where('user_id', $reservation->user_id)->first() 
                : Person::whereNull('user_id')->inRandomOrder()->first();

            if ($possiblePerson) {
                Attribution::factory()->create([
                    'reservation_id' => $reservation->id,
                    'person_id'=> $possiblePerson->id,
                    'bike_id' => rand(1, 10) > 2 ? Bike::inRandomOrder()->first()->id : null,
                ]);
            }
        }
    }
}