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


    public function show()
    {
        $user = Auth::user();
        $people = Person::where('user_id', $user->id)->get();

        $reservations = Reservation::where('user_id', $user->id)
            ->with(['attributions.person', 'attributions.bike'])
            ->get();

        return Inertia::render('profile', [
            'user' => $user,
            'people' => $people,
            'reservations' => $reservations,
        ]);
    }
    public function update(Request $request)
    {
        $user = Auth::user();
        $user->last_name = $request->input('last_name');
        $user->first_name = $request->input('first_name');
        $user->email = $request->input('email');
        $user->heigth = $request->input('heigth');
        $user->save();

        return redirect()->back()->with('success', 'Profil mis à jour avec succès.');
    }
}