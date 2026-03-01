<?php

namespace App\Observers;

use App\Models\Station;
use App\Models\Schedule;

class StationObserver
{
    /**
     * Handle the Station "created" event.
     */
    public function created(Station $station): void{
        for ($i=0; $i < 7; $i++) { 
            Schedule::create([
                'station_id'  => $station->id,
                'day_of_week' => $i,
                'open_time'   => '08:00:00',
                'close_time'  => '18:00:00',
            ]);
        }
    }
}
