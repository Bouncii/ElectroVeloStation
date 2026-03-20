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
        $validated = $request->validate([
            'pickup_station_id' => 'required|exists:stations,id',
            'return_station_id' => 'required|exists:stations,id',
            'start_date' => 'required|date|after_or_equal:now',
            'end_date' => 'required|date|after:start_date',
            'attributions'=> 'required|array|min:1',
            'attributions.*.id' => 'nullable|exists:people,id',
            'attributions.*.nom' => 'required|string|max:255',
            'attributions.*.prenom' => 'required|string|max:255',
            'attributions.*.age' => 'required|integer|min:1|max:120',
            'attributions.*.taille' => 'required|integer|min:100|max:250',
            //'attributions.*.email' => 'required|email|max:255',
        ]);
        try {
            DB::transaction(function () use ($validated) {
                if (Auth::user() === null) {
                    $userId = null; //à changer quand on trouve une solution pour les utilisateurs non connectés
                }else {
                $userId = Auth::id();
                }
                $reservation = Reservation::create([
                    'user_id' => $userId,
                    'pickup_station_id' => $validated['pickup_station_id'],
                    'return_station_id' => $validated['return_station_id'],
                    'start_date' => $validated['start_date'],
                    'end_date' => $validated['end_date'],
                    'status' => 'pending',
                ]);

                foreach ($validated['attributions'] as $personData) {
                    $personId = null;
                    if (isset($personData['id'])) {
                        $existingPerson = Person::where('id', $personData['id'])
                                                ->where('user_id', $userId)
                                                ->first();
                        if ($existingPerson) {
                            $personId = $existingPerson->id;
                        }
                    }
                    if (!$personId) {
                        $newPerson = Person::create([
                            'user_id' => $userId,
                            'first_name' => $personData['prenom'],
                            'last_name' => $personData['nom'],
                            'age' => $personData['age'],
                            'required_bike_size' => $personData['taille'],
                        ]);
                        $personId = $newPerson->id;
                    }
                    Attribution::create([
                        'reservation_id' => $reservation->id,
                        'person_id' => $personId,
                        'bike_id' => null,
                    ]);
                }

            });
            return redirect()->route('home')->with('success', 'Réservation créée avec succès !');

        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Une erreur est survenue lors de la réservation : ' . $e->getMessage()]);
        }
    }
}