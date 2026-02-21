<?php
namespace App\Http\Controllers;

use App\Models\Station;
use App\Models\Reservation;
use Inertia\Inertia;

class StationManagementController extends Controller
{
    public function index()
    {
        return Inertia::render('stationsdash', [
            'stations' => Station::withCount(['bikes', 'departures', 'arrivals'])->get()
        ]);
    }

    public function show(Station $station)
    {
        $bikes = $station->bikes()->get();
        $allStates = ['available', 'in_use', 'transport_pending', 'return_pending', 'maintenance'];
        $bikeStats = [];

        foreach ($bikes as $bike) {
            if (!array_key_exists($bike->size, $bikeStats)) {
                $bikeStats[$bike->size] = array_fill_keys($allStates, 0);
            }
            $bikeStats[$bike->size][$bike->state]++;
        }

        $loadRelations = [
            'user',
            'attributions.person',
            'attributions.bike'
        ];

        $departingReservations = Reservation::where('pickup_station_id', $station->id)
            ->where('status', 'confirmed')
            ->with($loadRelations)
            ->orderBy('start_date', 'asc')
            ->get();

        $arrivingReservations = Reservation::where('return_station_id', $station->id)
            ->where('status', 'confirmed')
            ->with($loadRelations)
            ->orderBy('end_date', 'asc')
            ->get();

        $pendingReservations = Reservation::where('pickup_station_id', $station->id)
            ->where('status', 'pending')
            ->with($loadRelations)
            ->orderBy('start_date', 'asc')
            ->get();

        return Inertia::render('home', [
            'station' => $station,
            'bikeStats' => $bikeStats,
            'departingReservations' => $departingReservations,
            'arrivingReservations' => $arrivingReservations,
            'pendingReservations' => $pendingReservations,
        ]);
    }
}
;
