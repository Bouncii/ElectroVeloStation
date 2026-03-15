<?php 

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReservationController extends Controller {
    
    public function index()
    {
        return Inertia::render('gestionReservations', [
            'reservations' => Reservation::all()
        ]);
    }

    public function store(Request $request){

        //Validation des données 
        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'user_id' => 'required|integer|min:1',
            'pickup_station' => 'required|integer|min:1',
            'return_station' => 'required|integer|min:1',
            'status' => 'required|string|max:255'
        ]);



        Reservation::create($validated);
        return redirect()->back()->with('success', 'Reservation créée !');

    }

}