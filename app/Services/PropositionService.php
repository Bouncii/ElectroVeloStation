<?php

namespace App\Services;

use App\Models\Reservation;
use App\Models\Proposition;
use Illuminate\Support\Facades\DB;

class PropositionService
{

    //Crée une proposition et réserve les vélos dans la table pivot.
    public function createProposition(Reservation $reservation, array $foundBikes)
    {
        return DB::transaction(function () use ($reservation, $foundBikes) {
            //Création de la proposition
            $proposition = Proposition::create([
                'reservation_id' => $reservation->id,
                'status'         => 'pending',
                'expires_at'     => now()->addHours(24),
            ]);

            //Etape de liaison entre les velos et l'attribution
            foreach ($foundBikes as $attributionId => $bikeId) {
                $proposition->bikes()->attach($bikeId);
            }
            return $proposition;
        });
    }

    //Transforme une proposition accepté en réservation confirmée.
    public function acceptProposition(Proposition $proposition)
    {
        return DB::transaction(function () use ($proposition) {
            $reservation = $proposition->reservation;
            $proposedBikes = $proposition->bikes;

            foreach ($reservation->attributions()->whereNull('bike_id')->get() as $attribution) {
                $bike = $proposedBikes->firstWhere('size', $attribution->person->required_bike_size);
                $attribution->update(['bike_id' => $bike->id]);
                $keys = $proposedBikes->keys();
                $i = 0;
                $found = false;
                //On supprime le vélo attribué de la liste des propositions
                while ($i < count($keys) && $found == false) {
                    $currentKey = $keys[$i];
                    if ($proposedBikes->get($currentKey)->id === $bike->id) {
                        $proposedBikes->forget($currentKey);
                        $found = true;
                    }
                    $i++;
                }
            }
            $reservation->update(['status' => 'confirmed']);
            $proposition->update(['status' => 'accepted']);

            return $reservation;
        });
    }

    //Traie le refus de la proposition de la part du client
    public function rejectProposition(Proposition $proposition)
    {
        $proposition->update(['status' => 'rejected']);
        return $proposition;
    }
}