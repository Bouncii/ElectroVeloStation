<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Station;
use Inertia\Inertia;

class StationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('stationsdash', [
            'stations' => Station::all()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request-> validate([
            'name' => 'required|string|max:255'
        ]);
        Station::create($validated);
        return redirect()->back()->with('success', 'Station créée !');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Station $station) // Dans cette fonction normalement on reçoit que l'id mais si on met un objet station en parametre laravel va le chercher tt seul
    {
        $validated = $request -> validate([
            'name' => 'required|string|max:255'
        ]);
        $station -> update($validated);
        return redirect()->back()->with('success', 'Station modifiée !');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Station $station)
    {
        $station -> delete();
        return redirect()->back()->with('success', 'Station supprimée !');
    }
}
