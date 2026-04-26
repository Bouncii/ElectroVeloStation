<?php

namespace App\Http\Controllers;

use App\Models\Bike;
use App\Models\Person;
use App\Models\Reservation;
use App\Models\Station;
use App\Models\User;
use Illuminate\Http\Request;

use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('gestionReservations', [
            'reservations' => Reservation::with([
                'user', 
                'station',
                'attributions.person',
                'attributions.bike'
            ])
            ->latest()
            ->get()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('gestionReservations', [
            'users'=> User::all(),
            'persons'=>Person::all(),
            'stations' => Station::all(),
            'bikes'=>Bike::all()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'start_date'=> 'required|date|after:now',
            'end_date' => 'required|date|after:start_date',
            'station_id' => 'required|exists:stations,id',
            'email' => 'required|email|max:255',
            'user_id'=> 'nullable|exists:users,id',
            'attributions'=> 'required|array|min:1',
            'attributions.*.person_id' => 'required|exists:people,id',
        ]);


        DB::transaction(function () use ($validated, &$allBikesAssigned) {
            $reservation = Reservation::create([
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'station_id' => $validated['station_id'],
                'email' => $validated['email'],
                'user_id' => $validated['user_id'],
                'status' => 'confirmed',
            ]);

            $assignedBikeIds = []; 
            $allBikesAssigned = true;

            foreach ($validated['attributions'] as $attr) {
                $person = Person::findOrFail($attr['person_id']);
                
                $bike = Bike::where('size', $person->required_bike_size)
                    ->whereNotIn('id', $assignedBikeIds) 
                    ->availableAtStationOn(
                        $validated['station_id'], 
                        $validated['start_date'], 
                        $validated['end_date']
                    )
                    ->first();

                if ($bike) {
                    $assignedBikeIds[] = $bike->id;
                    $bikeId = $bike->id;
                } else {
                    $allBikesAssigned = false;
                    $bikeId = null;
                }

                $reservation->attributions()->create([
                    'person_id' => $person->id,
                    'bike_id'   => $bikeId
                ]);
            }
        });

        if ($allBikesAssigned ) {
            $message = 'Réservation confirmée avec tous les vélos !' ;
        }else{
            $message = 'Réservation enregistrée, mais certains vélos manquent (statut : En attente).';
        }

        return redirect()->route('reservations.index')->with('success', $message);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Reservation $reservation)
    {
        $validated = $request->validate([
            'start_date'=> 'required|date',
            'end_date' => 'required|date|after:start_date',
            'station_id' => 'required|exists:stations,id',
            'email' => 'required|email|max:255',
            'user_id' => 'nullable|exists:users,id',
            'attributions' => 'required|array|min:1',
            'attributions.*.person_id' => 'required|exists:people,id',
        ]);

        DB::transaction(function () use ($validated, $reservation, &$allBikesAssigned) {
            $reservation->update([
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'station_id' => $validated['station_id'],
                'email' => $validated['email'],
                'user_id' => $validated['user_id'],
                'status' => 'confirmed',
            ]);

            $reservation->attributions()->delete();

            $assignedBikeIds = []; 
            $allBikesAssigned = true;

            foreach ($validated['attributions'] as $attr) {
                $person = Person::findOrFail($attr['person_id']);
                
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

                $reservation->attributions()->create([
                    'person_id' => $person->id,
                    'bike_id'   => $bikeId
                ]);
            }

            if (!$allBikesAssigned) {
                $reservation->update(['status' => 'pending']);
            }
        });

        return redirect()->route('reservations.index')
            ->with('success', 'Réservation mise à jour avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reservation $reservation)
    {
        $reservation ->delete();

        return redirect()->route('reservations.index')
            ->with('success', 'Réservation supprimée avec succès.');
    }
}
