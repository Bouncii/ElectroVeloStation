<?php
namespace App\Http\Controllers;

use App\Models\Station;
use App\Models\Reservation;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\Bike;

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
    
    // Méthode qui permet de mettre un nombre de vélos d'une certaine taille en maintenance
    public function putInMaintenance(Request $request, Station $station)
    {
        $validated = $request->validate([
            'size' => 'required',
            'count' => 'required|integer|min:1'
        ]);

        $bikes = Bike::where('station_id', $station->id)
            ->where('size', $validated['size'])
            ->where('state', 'available')
            ->with(['attributions.reservation' => function ($query) {
                // on ne prends que les résa futurs
                $query->where('start_date', '>=', now())
                      ->where('status', '!=', 'cancelled');
            }])
            ->get();

        if ($bikes->count() < $validated['count']) {
            return back()->withErrors(['error' => 'Pas assez de vélos disponibles']);
        }
        // On choisit les vélos qui auront le moin d'impact sur les réservations
        $sortedBikes = $bikes->sortByDesc(function ($bike) {
            $futureReservations = $bike->attributions->pluck('reservation')->filter();
            if ($futureReservations->isEmpty()) {
                return Carbon::now()->addYears(100)->timestamp; // si aucune résa rattaché alors on fait en sorte que le velo soit parmis les premiers à être sélectionné
            }
            $earliestReservationDate = $futureReservations->min('start_date');
            return Carbon::parse($earliestReservationDate)->timestamp;
        })->values();

        $bikesToMaintain = $sortedBikes->take($validated['count']);

        DB::transaction(function () use ($bikesToMaintain) {
            foreach ($bikesToMaintain as $bike) {
                $bike->update(['state' => 'maintenance']);
                $futureAttributions = $bike->attributions()->whereHas('reservation', function($q) {
                    $q->where('start_date', '>=', now())
                      ->whereIn('status', ['confirmed', 'pending']);
                })->get();

                foreach ($futureAttributions as $attr) {
                    $attr->update(['bike_id' => null]);
                    $attr->reservation->update(['status' => 'pending']); 
                }

                // Il faut envoyer mail 
            }
        });
        return back()->with('success', $validated['count'] . ' vélos mis en maintenance.');
    }

    // Méthode qui permet de mettre un nombre de vélos d'une certaine taille en available
    public function makeAvailable(Request $request, Station $station)
    {
        $validated = $request->validate([
            'size' => 'required',
            'count' => 'required|integer|min:1'
        ]);
        $bikes = Bike::where('station_id', $station->id)
            ->where('size', $validated['size'])
            ->where('state', 'maintenance')
            ->take($validated['count'])
            ->get();

        if ($bikes->count() < $validated['count']) {
            return back()->withErrors(['error' => 'Pas assez de vélos en maintenance pour cette taille.']);
        }

        foreach ($bikes as $bike) {
            $bike->update(['state' => 'available']);
        }
        return back()->with('success', $validated['count'] . ' vélos remis en service.');
    }
};
