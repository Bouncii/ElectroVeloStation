<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Station;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Person;
use App\Models\Reservation;
use App\Models\Attribution;


class ProfileController extends Controller{
    public function index()
    {
        $reservations = [];
        $people = [];
        $attributions = [];
        
        if (Auth::check()) {
            $people = Person::where('user_id', Auth::id())->get();
            $reservations = Reservation::where('user_id', Auth::id())->get();
            $attributions = Attribution::whereIn('reservation_id', $reservations->pluck('id'))->get();
            }


        return Inertia::render('profile', [
            'reservations' => $reservations,
            'people' => $people,
            'attributions' => $attributions,
        ]); 
    }


    public function update(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'first_name'         => 'required|string|max:255',
            'last_name'          => 'required|string|max:255',
            'email'                => 'required|email|max:255|unique:users,email,' . $user->id,
        ]);

        $user->update($request->only(['first_name', 'last_name', 'email']));

        return redirect()->back()->with('success', 'Personne mise à jour avec succès.');
    }



    public function updatePerson(Request $request, Person $person)
    {
        // ✅ Vérification que la personne appartient bien à l'utilisateur connecté
        if ($person->user_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'first_name'         => 'required|string|max:255',
            'last_name'          => 'required|string|max:255',
            'age'                => 'required|integer|min:0|max:120',
            'required_bike_size' => 'nullable|integer',
        ]);

        $person->update($request->only(['first_name', 'last_name', 'age', 'required_bike_size']));

        return redirect()->back()->with('success', 'Personne mise à jour avec succès.');
    }
}