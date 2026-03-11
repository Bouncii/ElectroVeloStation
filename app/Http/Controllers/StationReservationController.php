<?php
namespace App\Http\Controllers;

use App\Models\Station;
use Inertia\Inertia;

class StationReservationController extends Controller
{
    public function index()
    {
        return Inertia::render('stationsdash', [
            'stations' => Station::withCount(['bikes'])->get()
        ]);
    }

    public function create()
    {
        $stations = Station::all();

        return Inertia::render('Reservation', [
            'stations' => $stations
        ]);
    }

    //Pour remplir le tableau des stations sur le front

    public function show(Station $station)
    {
        $toute_stations = Station::all();
        $stations = [];


        foreach($toute_stations as $s) {
            $bikes = $s->bikes()->get();
            $allStates = ['available', 'in_use', 'transport_pending', 'return_pending', 'maintenance'];
            $bikeStats = array_fill_keys($allStates, 0);


            foreach ($bikes as $bike) {
                $bikeStats[$bike->state]++;
            }

            //On a un tableau avec les états des vélos en général, ici pour vérifier que la station a au moins 
            //un vélo de libre

            if ($bikeStats['available'] > 0) 
            {
                $stations[] = $s;
            }   

            //Si la station aau moins un vélo de disponible, on le met dans le tableau
        }

        return Inertia::render('home', [
            'stations' => $stations
        ]);

    }



}