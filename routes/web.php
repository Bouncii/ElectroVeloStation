<?php
use App\Http\Controllers\StationManagementController;
use App\Http\Controllers\GlobalReservationController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return inertia('home');
});

Route::get('/reservation', function () {
    return inertia('reservation');
});


// Route::get('/dashboard', function () {
//     return inertia('dashboard');
// });

// Route::get('/stationsdash', function () {
//     return inertia('stationsdash');
// });

Route::get('/dashboard', [GlobalReservationController::class,"index"]);

Route::get('/dashboard/stations', [StationManagementController::class,"index"]);

Route::get('/dashboard/stations/{station}', [StationManagementController::class, 'show']);

Route::get('/testConnexion', function () {return inertia('testConnexion');});