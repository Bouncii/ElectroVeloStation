<?php
namespace App\Services;

use App\Models\Reservation;
use App\Models\Bike;

class ReservationOperationService
{
    public function checkOut(Reservation $reservation)
    {
        $reservation->update(['status' => 'in_progress']);

        foreach ($reservation->attributions as $attr) {
            if ($attr->bike) {
                $attr->bike->update(['state' => 'in_use']);
            }
        }
    }

    public function checkIn(Reservation $reservation)
    {
        $reservation->update(['status' => 'completed']);

        foreach ($reservation->attributions as $attr) {
            if ($attr->bike) {
                $attr->bike->update(['state' => 'available']);
            }
        }
    }

    public function attemptResolution(Reservation $reservation):bool
    {
        $allResolved = true;

        $assignedBikeIds = $reservation->attributions()
            ->whereNotNull('bike_id')
            ->pluck('bike_id')
            ->toArray();

        foreach ($reservation->attributions as $attr) {
            if (is_null($attr->bike_id)) {
                $bike = Bike::where('size', $attr->person->bike_size)
                        ->whereNotIn('id', $assignedBikeIds)
                        ->availableAtStationOn(
                            $reservation->pickup_station_id, 
                            $reservation->start_date, 
                            $reservation->end_date,
                            $reservation->id
                        )->first();
                if ($bike) {
                    $attr->update(['bike_id' => $bike->id]);
                    $assignedBikeIds[] = $bike->id;
                }else {
                    $allResolved = false;
                }
            }
        }
        if ($allResolved) {
            $reservation->update(['status' => 'confirmed']);
        }
        return $allResolved;
    }

    public function cancelUnresolved(): void
    {
        $deadline = now()->addHours(24);

        $expiredReservations = Reservation::where('status', 'pending')
            ->where('start_date', '<=', $deadline)
            ->get();

        foreach ($expiredReservations as $reservation) {
            $reservation->update(['status' => 'cancelled']);
        }

        // APPEL D'ENVOI DE MAIL POUR PREVENIR L'UTILISATEUR (PLUS TARD) 
    }
}