<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Station;
use App\Models\Person;
use App\Models\Attribution;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Bike;

class UserReservationController extends Controller
{
    /**
     * Affiche le formulaire de réservation
     */
    public function create()
    {
        $allStations = Station::all();
        $schedules = Schedule::all(); 
        $peopleDb = [];
        
        if (Auth::check()) {
            $peopleDb = Person::where('user_id', Auth::id())->get();
        }

        return Inertia::render('reservation', [
            'allStations' => $allStations,
            'schedules' => $schedules,
            'peopleDb' => $peopleDb,
        ]);
    }

    /**
     * Traite la soumission d'une reservation
     */
    public function store(Request $request)
    {

        $isGuest = Auth::guest();
        $validated = $request->validate([
            'station_id' => 'required|exists:stations,id',
            'start_date' => 'required|date|after_or_equal:now',
            'end_date' => 'required|date|after:start_date',
            'email' => 'required|email|max:255',
            'persons'=> 'required|array|min:1',
            'persons.*.id' => 'nullable|exists:people,id',
            'persons.*.nom' => 'required|string|max:255',
            'persons.*.prenom' => 'required|string|max:255',
            'persons.*.age' => 'required|integer|min:1|max:120',
            'persons.*.taille' => 'required|integer|min:100|max:250',
        ]);
        try {
            DB::transaction(function () use ($validated) {
                $userId = Auth::id();
                $reservation = Reservation::create([
                    'user_id' => $userId,
                    'station_id' => $validated['station_id'],
                    'start_date' => $validated['start_date'],
                    'end_date' => $validated['end_date'],
                    'email' => $validated['email'],
                    'status' => 'pending',
                ]);

                $assignedBikeIds = []; 
                $allBikesAssigned = true;

                foreach ($validated['persons'] as $personData) {
                    $person = null;
                    if (isset($personData['id'])) {
                        $existingPerson = Person::where('id', $personData['id'])
                                                ->where('user_id', $userId)
                                                ->first();
                        if ($existingPerson) {
                            $person = $existingPerson;
                        }
                    }
                    if (!$person) {
                        $newPerson = Person::create([
                            'user_id' => $userId,
                            'first_name' => $personData['prenom'],
                            'last_name' => $personData['nom'],
                            'age' => $personData['age'],
                            'required_bike_size' => $personData['taille'],
                        ]);
                        $person = $newPerson;
                    }

                    
                    $bike = Bike::where('size', $person->required_bike_size)
                        ->whereNotIn('id', $assignedBikeIds) 
                        ->availableAtStationOn(
                            $validated['station_id'], 
                            $validated['start_date'], 
                            $validated['end_date'],
                            $reservation->id
                        )
                        ->first();

                    if ($bike) {
                        $assignedBikeIds[] = $bike->id;
                        $bikeId = $bike->id;
                    } else {
                        $allBikesAssigned = false;
                        $bikeId = null;
                    }

                    Attribution::create([
                        'reservation_id' => $reservation->id,
                        'person_id' => $person->id,
                        'bike_id' => $bikeId,
                    ]);
                }

                if ($allBikesAssigned) {
                    $reservation->update(['status' => 'confirmed']);
                }


            });
            return redirect()->route('home')->with('success', 'Réservation créée avec succès !');

        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Une erreur est survenue lors de la réservation : ' . $e->getMessage()]);
        }
    }
}