<?php

namespace App\Observers;

use App\Models\Proposition;
use App\Services\ReservationService;

class PropositionObserver
{
    protected $reservationService;

    public function __construct(ReservationService $reservationService)
    {
        $this->reservationService = $reservationService;
    }

    /**
     * Handle the Proposition "created" event.
     */
    public function created(Proposition $proposition): void
    {
        //
    }

    /**
     * Handle the Proposition "updated" event.
     */
    public function updated(Proposition $proposition): void
    {
        if ($proposition->wasChanged('status') && $proposition->status === 'declined') {
            $this->reservationService->checkPendingsForResolutions($proposition->reservation->station_id);
        }
    }

    /**
     * Handle the Proposition "deleted" event.
     */
    public function deleted(Proposition $proposition): void
    {
        //
    }

    /**
     * Handle the Proposition "restored" event.
     */
    public function restored(Proposition $proposition): void
    {
        //
    }

    /**
     * Handle the Proposition "force deleted" event.
     */
    public function forceDeleted(Proposition $proposition): void
    {
        //
    }
}
