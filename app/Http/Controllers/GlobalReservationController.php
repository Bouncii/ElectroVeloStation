<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Inertia\Inertia;

class GlobalReservationController extends Controller
{
    public function index(){
        $relations = [
            'user',
            'pickupStation',
            'returnStation',
            'attributions.bike',
            'attributions.person'
        ];

        return Inertia::render('home', [
            'pendingReservations' => Reservation::pending()
                ->with($relations)
                ->withCount('attributions')
                ->latest()
                ->get(),

            'allReservations' => Reservation::query()
                ->with($relations)
                ->withCount('attributions')
                ->latest()
                ->get(),
        ]);
    }

}