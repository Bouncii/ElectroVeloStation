<?php

namespace App\Observers;

use App\Models\Bike;
use App\Services\ReservationService;

class BikeObserver
{
    protected $reservationService;

    public function __construct(ReservationService $reservationService) {
        $this->reservationService = $reservationService;
    }

    /**
     * Handle the Bike "created" event.
     */
    public function created(Bike $bike): void
    {
        $this->reservationService->checkPendingsForResolutions($bike->station_id);
    }

    /**
     * Handle the Bike "updated" event.
     */
    public function updated(Bike $bike): void
    {
        $updateStation = $bike->isDirty('station_id');
        $statusAvailable = $bike->isDirty('status') && $bike->status === 'available';

        if ($updateStation || $statusAvailable) {
            $this->reservationService->checkPendingsForResolutions($bike->station_id);
        }
    }

    /**
     * Handle the Bike "deleted" event.
     */
    public function deleted(Bike $bike): void
    {
        //
    }

    /**
     * Handle the Bike "restored" event.
     */
    public function restored(Bike $bike): void
    {
        //
    }

    /**
     * Handle the Bike "force deleted" event.
     */
    public function forceDeleted(Bike $bike): void
    {
        //
    }
}
