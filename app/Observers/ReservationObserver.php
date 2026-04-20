<?php

namespace App\Observers;

use App\Models\Reservation;
use App\Services\ReservationService;

class ReservationObserver
{
    protected $reservationService;

    public function __construct(ReservationService $reservationService)
    {
        $this->reservationService = $reservationService;
    }

    /**
     * Handle the Reservation "updated" event.
     */
    public function updated(Reservation $reservation): void
    {
        if ($reservation->wasChanged('status') && $reservation->status === 'cancelled') {
            $reservation->attributions()->update(['bike_id' => null]);
            $this->reservationService->checkPendingsForResolutions($reservation->station_id);
        }
    }

    /**
     * Handle the Reservation "deleted" event.
     */
    public function deleted(Reservation $reservation): void
    {
        $this->reservationService->checkPendingsForResolutions($reservation->station_id);
    }
}
