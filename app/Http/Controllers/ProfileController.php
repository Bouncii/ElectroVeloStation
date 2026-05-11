<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Station;
use App\Models\Bike;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Person;
use App\Models\Reservation;
use App\Models\Proposition;
use App\Models\Schedule;
use App\Services\ReservationService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;


class ProfileController extends Controller{

    protected $reservationService;
    public function __construct(ReservationService $reservationService)
    {
        $this->reservationService = $reservationService;
    }


    /* Affiche les données de l'utilisateur */
    public function index()
    {
        $user = Auth::user()->load([
            'people',
            'reservations.attributions.bike',
            'reservations.propositions'
        ]);

        $sizes = Bike::distinct()->orderBy('size', 'asc')->pluck('size');
    
        return Inertia::render('profile', [
            'user' => $user,
            'stations' => Station::all(), 
            'schedules' => Schedule::all(),
            'bikeSizes' => $sizes,
        ]);
    }

    /* Modifie les données de l'utilisateur avec ce qu'il a rentré */
    public function update(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'first_name'=>'required|string|max:255',
            'last_name'=> 'required|string|max:255',
            'email'=> 'required|email|max:255|unique:users,email,'.$user->id,
        ]);

        $user->update($validated);

        return redirect()->back()->with('success', 'Vos informations ont été mises à jour.');
    }


    /* Affiche une personne de confiance */
    public function storePerson(Request $request)
    {
        $validated = $request->validate([
            'first_name'=> 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'age'=>'required|integer|min:0|max:120',
            'required_bike_size' => 'required|int',
        ]);
        Auth::user()->people()->create($validated);
        return redirect()->back()->with('success', 'Personne ajoutée avec succès.');
    }


    /*Modifie les informations d'une personne de confiance avec les changements effectués*/
    public function updatePerson(Request $request, Person $person)
    {

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'age' => 'required|integer|min:0|max:120',
            'required_bike_size' => 'required|integer',
        ]);
        $person->update($validated);
        return redirect()->back()->with('success', 'Personne mise à jour avec succès.');
    }


    /* Supprime une personne de confiance */
    public function destroyPerson(Person $person)
    {
        $person->delete();
        return redirect()->back()->with('success', 'Personne supprimée.');
    }

    /* Fonction lorsqu'une personne accepte une proposition faite */
    public function acceptProposition(Proposition $proposition)
    {
        DB::transaction(function () use ($proposition) {
            $reservation = $proposition->reservation;
            $bikes = $proposition->bikes;
            $attributions = $reservation->attributions()->with('person')->whereNull('bike_id')->get();

            /* Attribue un vélo à chaque personne */
            foreach ($bikes as $bike) {
                $attribution = $attributions->first(function ($attr) use ($bike) {
                    return $attr->bike_id === null && $attr->person->required_bike_size === $bike->size;
                });

                if ($attribution) {
                    $attribution->update(['bike_id' => $bike->id]);
                    $attribution->bike_id = $bike->id; 
                }
            }

            /* On modifie la reservation pour qu'elle soit terminée et on prend la proposition */
            $reservation->update(['status' => 'confirmed']);
            $proposition->update(['status' => 'accepted']);

            $reservation->propositions()
                ->where('status', 'pending')
                ->where('id', '!=', $proposition->id)
                ->update(['status' => 'declined']);
        });
        return redirect()->back()->with('success', 'Proposition acceptée !');
    }

    /* Fonction lorsqu'on rejette une proposition*/
    public function rejectProposition(Proposition $proposition)
    {
        $proposition->update(['status' => 'declined']);
        return redirect()->back()->with('success', 'Proposition refusée.');
    }

    /* Fonction pour supprimer une réservation */
    public function cancelReservation(Reservation $reservation)
    {

        $reservation->update(['status' => 'cancelled']);
        return redirect()->back()->with('success', 'Réservation annulée et vélos libérés.');
    }

    /* Calcule les distances GPS entre deux stations*/
    public function distanceGPS(float $lat1, float $lon1, float $lat2, float $lon2): float
{
    $earthRadius = 6371;
    $dLat = deg2rad($lat2 - $lat1);
    $dLon = deg2rad($lon2 - $lon1);
    $a = sin($dLat / 2) ** 2 + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dLon / 2) ** 2;

    return $earthRadius * 2 * atan2(sqrt($a), sqrt(1 - $a));
}


/* Trouve la station la plus proche d'une autre */
public function findClosestStationWithBikes(Reservation $reservation): ?Station
{
    $origin = $reservation->station;

    $requiredSizes = $reservation->attributions
        ->pluck('person.required_bike_size')
        ->filter()
        ->values();

    $best = Station::where('id', '!=', $origin->id)
        ->get()
        ->filter(function (Station $station) use ($reservation, $requiredSizes) {
            $assignedIds = [];

            foreach ($requiredSizes as $size) {
                $bike = Bike::where('size', $size)
                    ->whereNotIn('id', $assignedIds)
                    ->availableAtStationOn(
                        $station->id,
                        $reservation->start_date,
                        $reservation->end_date,
                        $reservation->id
                    )
                    ->first();

                if (!$bike) {
                    return false;
                }

                $assignedIds[] = $bike->id;
            }

            return true;
        })
        ->sortBy(fn(Station $s) => $this->distanceGPS(
            $origin->latitude, $origin->longitude,
            $s->latitude, $s->longitude
        ))
        ->first();

    return $best ?: null;
}
    /* Transfère une reservation d'une station à une autre */
    public function transferReservation(Reservation $reservation){
    $targetStation = $this->findClosestStationWithBikes($reservation);

    if (!$targetStation) {
        return redirect()->back()->withErrors([
            'transfer' => 'Aucune station disponible trouvée pour ce transfert.'
        ]);
    }

    $propositionService = app(\App\Services\PropositionService::class);

    DB::transaction(function () use ($reservation, $targetStation, $propositionService) {
        $reservation->update(['status' => 'cancelled']);

        $newReservation = $reservation->replicate();
        $newReservation->station_id = $targetStation->id;
        $newReservation->status = 'pending';
        $newReservation->created_at = now();
        $newReservation->save();

        foreach ($reservation->attributions as $attr) {
            $newAttr = $attr->replicate();
            $newAttr->reservation_id = $newReservation->id;
            $newAttr->bike_id = null;
            $newAttr->save();
        }

        $isResolved = $this->reservationService->attemptResolution($newReservation);

        if ($isResolved) {
            $proposition = $newReservation->propositions()->where('status', 'pending')->first();

            if ($proposition) {
                $propositionService->acceptProposition($proposition);
            }
        }
    });

    return redirect()->back()->with('success', 'Transfert réussi !'); 
    }

/* fonction qui indique la station la plus proche et prépare à un possible transfert */
public function suggestTransfer(Reservation $reservation)
{
    $targetStation = $this->findClosestStationWithBikes($reservation);

    $data = $targetStation
        ? [
            'available' => true,
            'station' => ['id' => $targetStation->id, 'name' => $targetStation->name],
            'distance_km' => round($this->distanceGPS(
                $reservation->station->latitude, $reservation->station->longitude,
                $targetStation->latitude, $targetStation->longitude
            ), 2),
        ]
        : ['available' => false];

    return response()->json($data);
}

    /* Modifie le mot de passe de l'utilisateur */ 
    public function updatePassword(Request $request)
    {
        $request->validate([
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($request->password),
        ]);

        return back();
    }
}
