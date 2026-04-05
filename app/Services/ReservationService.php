<?php
namespace App\Services;

use App\Models\Proposition;
use Illuminate\Support\Facades\DB;
use App\Models\Reservation;
use App\Models\Bike;
use App\Services\PropositionService;

class ReservationService
{
    protected $propositionService;

    public function __construct(PropositionService $propositionService) {
        $this->propositionService = $propositionService;
    }

    public function checkPendingsForResolutions($stationId)
    {
        $pendings = Reservation::where('status', 'pending')
            ->where('station_id',$stationId)
            ->whereDoesntHave('propositions', function ($query) {
                $query->active();
            })
            ->get();

        foreach ($pendings as $reservation) {
            $this->attemptResolution($reservation);
        }
    }

    // Fonction qui tente la résolution d'une réservation pending passé en paramètre
    public function attemptResolution(Reservation $reservation):bool
    {
        $allBikesAssigned = true;
        $uncompleteAttributions = $reservation->attributions()->whereNull('bike_id')->get();
        $assignedBikeIds = [];
        $i=0;
        while ($i < count($uncompleteAttributions) and $allBikesAssigned) {
            $attribution = $uncompleteAttributions[$i]; 
            $reservation = $attribution->reservation;
            $bike = Bike::where('size', $attribution->person->required_bike_size)
                ->whereNotIn('id', $assignedBikeIds) 
                ->availableAtStationOn(
                    $reservation->station_id, 
                    $reservation->start_date, 
                    $reservation->end_date,
                )
                ->first();

            if ($bike) {
                $assignedBikeIds[$attribution->id] = $bike->id;
            } else{
                $allBikesAssigned = false;
            }
            $i++;
        }


        if ($allBikesAssigned) {
            $this->propositionService->createProposition($reservation,$assignedBikeIds);
        }
        return $allBikesAssigned;
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