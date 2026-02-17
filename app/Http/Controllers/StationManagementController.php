<?php
namespace App\Http\Controllers;

use App\Models\Station;
use App\Models\Bike;
use App\Models\Reservation;
use Inertia\Inertia;

class StationManagementController extends Controller{
    public function index(){
        return Inertia::render('home', [
            'stations' => Station::withCount(['bikes', 'departures','arrivals'])->get()
        ]);
    }

    public function show(Station $station){
        return inertia::render('employee/dashboard',[
        'station' => $station,
        'bikes' => $station->bikes()->get(),

        'reservations' => Reservation::where('pickup_station_id', $station->id)
            ->orWhere('return_station_id', $station->id)
            ->with('user')
            ->get()

        ]);
    }
};
