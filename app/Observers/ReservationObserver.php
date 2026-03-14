<?php

namespace App\Observers;

use App\Models\Reservation;
use App\Models\Bike;
use App\Models\Attribution;

class ReservationObserver
{
    /**
     * Handle the Reservation "created" event.
     */
    public function created(Reservation $reservation): void
    {
        //
    }

    /**
     * Handle the Reservation "updated" event.
     */
    public function updated(Reservation $reservation): void
    {
        if ($reservation->wasChanged('status') && $reservation->status === 'cancelled') {
            $this->healFutureReservations($reservation);
        }
    }

    /**
     * Handle the Reservation "deleted" event.
     */
    public function deleted(Reservation $reservation): void
    {
        $this->healFutureReservations($reservation);
    }

    // Méthode qui permet de répercuter des changements sur des réservations funutures qui utilisaient des vélos de cette reservation
    protected function healFutureReservations(Reservation $cancelledRes): void
    {
        $bikeIds = $cancelledRes->attributions()->whereNotNull('bike_id')->pluck('bike_id');

        foreach ($bikeIds as $bikeId) {
            $futureAttributions = Attribution::where('bike_id', $bikeId)
                ->whereHas('reservation', function ($query) use ($cancelledRes) {
                    $query->where('start_date', ">", $cancelledRes->start_date)
                          ->where('status', '!=', 'cancelled');
                })
                ->orderBy('id', 'asc') 
                ->get();

            foreach ($futureAttributions as $futureAttr) {
                $futureRes = $futureAttr->reservation;
                $person = $futureAttr->person;
                $isStillAvailable = Bike::where('id', $bikeId)
                    ->availableAtStationOn($futureRes->pickup_station_id, $futureRes->start_date, $futureRes->end_date, $futureRes->id)
                    ->exists();
                if (!$isStillAvailable) {
                    $replacementBike = Bike::where('size', $person->bike_size) 
                        ->availableAtStationOn($futureRes->pickup_station_id, $futureRes->start_date, $futureRes->end_date, $futureRes->id)
                        ->first();

                    if ($replacementBike) {
                        $futureAttr->update(['bike_id' => $replacementBike->id]);
                    } else {
                        $futureAttr->update(['bike_id' => null]);
                        $futureRes->update(['status' => 'pending']);
                    
                        // APPEL D'ENVOI DE MAIL POUR PREVENIR L'UTILISATEUR (PLUS TARD) 
                        
                    }
                }
            }
        }
    }
}
