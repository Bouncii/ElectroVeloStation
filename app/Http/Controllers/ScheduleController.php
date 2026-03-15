<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Schedule;
use Inertia\Inertia;


class ScheduleController extends Controller {
    
    public function index()
    {
        return Inertia::render('gestionSchedule', [
            'schedules' => Schedule::all()
        ]);
    }
}