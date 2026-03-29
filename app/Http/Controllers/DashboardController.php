<?php
namespace App\Http\Controllers;

use App\Models\Station;
use App\Models\Reservation;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard/stationSelection', [
            'stations' => Station::withCount(['bikes', 'departures', 'arrivals'])->get()
        ]);
    }

    public function show(Station $station)
    {
        $today = Carbon::today();

        $bikes = $station->bikes()->get();
        $allStates = ['available', 'maintenance'];
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

        $departingReservations = Reservation::where('station_id', $station->id)
            ->where('status', 'confirmed')
            ->whereDate('start_date', '<=', $today)
            ->with($loadRelations)
            ->orderBy('start_date', 'asc')
            ->get();

        $arrivingReservations = Reservation::where('station_id', $station->id)
            ->where('status', 'confirmed')
            ->whereDate('end_date', '<=', $today)
            ->with($loadRelations)
            ->orderBy('end_date', 'asc')
            ->get();

        $pendingReservations = Reservation::where('station_id', $station->id)
            ->where('status', 'pending')
            ->with($loadRelations)
            ->orderBy('start_date', 'asc')
            ->get();

        return Inertia::render('dashboard/dashboard', [
            'station' => $station,
            'bikeStats' => $bikeStats,
            'departingReservations' => $departingReservations,
            'arrivingReservations' => $arrivingReservations,
            'pendingReservations' => $pendingReservations,
        ]);
    }
}
;
