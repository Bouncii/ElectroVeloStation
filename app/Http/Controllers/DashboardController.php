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

    // Fonction qui trouve les vélos avec le moins d'impact sur les réservations futures.
    private function getBikesWithLeastImpact(Station $station, $size, $count)
    {
        $bikes = Bike::where('station_id', $station->id)
            ->where('size', $size)
            ->where('state', 'available')
            ->with(['attributions.reservation' => function ($query) {
                $query->where('start_date', '>=', now())
                      ->where('status', '!=', 'cancelled');
            }])
            ->get();

        if ($bikes->count() < $count) {
            $res = collect();
        }else{
            $res =  $bikes->sortByDesc(function ($bike) {
                $futureReservations = $bike->attributions->pluck('reservation')->filter();
                if ($futureReservations->isEmpty()) {
                    $value =  Carbon::now()->addYears(100)->timestamp;
                }else{
                    $value =  Carbon::parse($futureReservations->min('start_date'))->timestamp;
                }
                return $value;
                
            })->values()->take($count);
        }
        return $res;
    }

    private function clearFutureAttributions($bikes)
    {
        foreach ($bikes as $bike) {
            $futureAttributions = $bike->attributions()->whereHas('reservation', function($q) {
                $q->where('start_date', '>=', now())
                  ->whereIn('status', ['confirmed', 'pending']);
            })->get();

            foreach ($futureAttributions as $attr) {
                $attr->update(['bike_id' => null]);
                $attr->reservation->update(['status' => 'pending']); 
                // Envoyer mail ici
            }
        }
    }

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

        $bikesToMaintain = $this->getBikesWithLeastImpact($station, $validated['size'], $validated['count']);
        if ($bikesToMaintain->isEmpty()) {
            return back()->withErrors(['error' => 'Pas assez de vélos disponibles.']);
        }

        DB::transaction(function () use ($bikesToMaintain) {
            $this->clearFutureAttributions($bikesToMaintain);
            foreach ($bikesToMaintain as $bike) {
                $bike->update(['state' => 'maintenance']);
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

    // Fonction qui ajoute un vélo dans une station
    public function addBike(Request $request, Station $station)
    {
        $validated = $request->validate([
            'size' => 'required',
            'count' => 'required|integer|min:1|max:100'
        ]);

        DB::transaction(function () use ($validated, $station) {
            for ($i=0; $i < $validated['count']; $i++) { 
                Bike::create(
                    [
                        'size' => $validated['size'],
                        'state' => 'available',
                        'station_id' => $station->id
                    ]
                );
            }
        });

        return back()->with('success', $validated['count'] . ' vélos créés');
    }

    // Fonction qui supprime un vélo dans une station
    public function removeBike(Request $request, Station $station)
    {
        $validated = $request->validate([
            'size' => 'required',
            'count' => 'required|integer|min:1'
        ]);
        $bikesToDelete = $this->getBikesWithLeastImpact($station, $validated['size'], $validated['count']);
        if ($bikesToDelete->isEmpty()) {
            return back()->withErrors(['error' => 'Pas assez de vélos disponibles pour la suppression.']);
        }
        DB::transaction(function () use ($bikesToDelete) {
            $this->clearFutureAttributions($bikesToDelete); 
            foreach ($bikesToDelete as $bike) {
                $bike->delete();
            }
        });
        return back()->with('success', $validated['count'] . ' vélos supprimés de la flotte.');
    }


    // Fonction qui lance une operation d'equilibrage, elle va scanner les besoins de la station actuelle, chercher des vélos inutilisés dans d'autres stations, et les rapatrier
    public function rebalanceBikes(Station $station)
    {
        $pendingReservations = Reservation::where('station_id', $station->id)
            ->where('status', 'pending')
            ->with('attributions.person')
            ->get();

        $neededSizes = [];
        foreach ($pendingReservations as $reservation) {
            foreach ($reservation->attributions->whereNull('bike_id') as $attr) {
                $size = $attr->person->required_bike_size;
                if (!array_key_exists($size,$neededSizes)) {
                    $neededSizes[$size] = 0;
                }
                $neededSizes[$size]++;
            }
        }

        if (empty($neededSizes)) {
            return back()->with('success', 'Aucun réapprovisionnement nécessaire, toutes les réservations sont gérées.');
        }

        $transferredCount = 0;
        DB::transaction(function () use ($station, $neededSizes, &$transferredCount) {
            foreach ($neededSizes as $size => $count) {
                $availableBikes = Bike::where('size', $size)
                    ->where('state', 'available')
                    ->where('station_id', '!=', $station->id)
                    ->whereDoesntHave('attributions.reservation', function ($query) {
                        $query->where('start_date', '>=', now())
                              ->where('status', '!=', 'cancelled');
                    })
                    ->take($count)
                    ->get();

                foreach ($availableBikes as $bike) {
                    $bike->update(['station_id' => $station->id]);
                    $transferredCount++;
                }
            }
        });

        return back()->with('success', "Réapprovisionnement terminé : $transferredCount vélos rapatriés.");
    }
};
