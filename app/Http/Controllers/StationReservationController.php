<?php
namespace App\Http\Controllers;

use App\Models\Station;
use App\Models\Reservation;
use Inertia\Inertia;

class StationReservationController extends Controller
{
    public function index()
    {
        return Inertia::render('stationsdash', [
            'stations' => Station::withCount(['bikes'])->get()
        ]);
    }


    public function show(Station $station)
    {
        $bikes = $station->bikes()->get();
        $allStates = ['available', 'in_use', 'transport_pending', 'return_pending', 'maintenance'];
        $bikeStats = array_fill_keys($allStates, 0);

        foreach ($bikes as $bike) {
            $bikeStats[$bike->state]++;
        }

        //On a un tableau avec les états des vélos en général, ici pour vérifier que la station a au moins 
        //un vélo de libre

        if ($bikeStats['available'] <= 0) 
        {
            abort(404);
        }   

        //Si la station n'a pas de vélo disponible, on renvoie une erreur 

        return Inertia::render('home', [
            'station' => $station,
            'bikeStats' => $bikeStats,
        ]);





    }



}