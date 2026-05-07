<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Station;
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

    public function index()
    {
        $user = Auth::user()->load([
            'people',
            'reservations.attributions.bike',
            'reservations.propositions'
        ]);
    
        return Inertia::render('profile', [
            'user' => $user,
            'stations' => Station::all(), 
            'schedules' => Schedule::all(),
        ]);
    }


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

    public function destroyPerson(Person $person)
    {
        $person->delete();
        return redirect()->back()->with('success', 'Personne supprimée.');
    }

    public function acceptProposition(Proposition $proposition)
    {
        DB::transaction(function () use ($proposition) {
            $reservation = $proposition->reservation;
        
            foreach ($proposition->bikes as $attributionId => $bikeId) {
                $reservation->attributions()
                    ->where('id', $attributionId)
                    ->update(['bike_id' => $bikeId]);
            }

            $reservation->update(['status' => 'confirmed']);
            $proposition->update(['status' => 'accepted']);

            $reservation->propositions()
                ->where('status', 'pending')
                ->where('id', '!=', $proposition->id)
                ->update(['status' => 'declined']);
        });
        return redirect()->back()->with('success', 'Proposition acceptée !');
    }

    public function rejectProposition(Proposition $proposition)
    {
        $proposition->update(['status' => 'declined']);
        return redirect()->back()->with('success', 'Proposition refusée.');
    }

    public function cancelReservation(Reservation $reservation)
    {
        $reservation->update(['status' => 'cancelled']);
        return redirect()->back()->with('success', 'Réservation annulée.');
    }

    public function transferReservation(Request $request, Reservation $reservation)
    {
        $validated = $request->validate([
            'station_id' => 'required|exists:stations,id'
        ]);
        $propositionService = app(\App\Services\PropositionService::class);
        DB::transaction(function () use ($reservation, $validated, $propositionService) {

            $reservation->update(['status' => 'cancelled']);
            $newReservation = $reservation->replicate();
            $newReservation->station_id = $validated['station_id'];
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

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password'      => ['required', 'current_password'],
            'password'              => ['required', Password::defaults(), 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($request->password),
        ]);

        return back();
    }
}