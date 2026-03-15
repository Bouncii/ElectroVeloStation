<?php 

namespace App\Http\Controllers;

use App\Models\Bike;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BikeController extends Controller {

     public function index()
    {
        return Inertia::render('gestionBikes', [
            'bikes' => Bike::all()
        ]);
    }
}
