<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Schedule;

class ScheduleController extends Controller
{

    public function update(Request $request, Schedule $schedule){
        $validated = $request->validate([
            'open_time'  => 'required',
            'close_time' => 'required',
        ]);

        $schedule->update($validated);

        return redirect()->back()->with('success', 'Horaire mis à jour');
    }
}
