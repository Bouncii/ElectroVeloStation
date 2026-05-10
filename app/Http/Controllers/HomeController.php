<?php

namespace App\Http\Controllers;

use App\Models\Station;
use Inertia\Inertia;

class HomeController extends Controller
{
    /** 
     * Display a listing of the stations.
     */
    public function index()
    {
        $stations = Station::all();

        return Inertia::render('home', [
            'stations' => $stations
        ]);
    }
}