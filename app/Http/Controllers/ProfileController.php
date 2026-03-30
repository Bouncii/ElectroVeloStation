<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Station;
use Inertia\Inertia;

class ProfileController extends Controller{
    public function index()
    {
        return Inertia::render('profile', [
            //UserController::with(['schedules' => function ($query) {
              //  $query->orderBy('day_of_week', 'asc');
            //}])->latest()->get()
        ]);
    }
}