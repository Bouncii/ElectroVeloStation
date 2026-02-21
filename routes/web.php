<?php
use App\Http\Controllers\StationManagementController;
use App\Http\Controllers\GlobalReservationController;
use Illuminate\Support\Facades\Route;

// -------- ROUTES PUBLIQUES -------
Route::get('/', function () {
    return inertia('home');
});

Route::get('/reservation', function () {
    return inertia('reservation');
});

// ----- ROUTES PROTÉGÉES -----
// On utilise un groupe pour ne pas répéter les protections sur chaque ligne
Route::middleware(['auth', 'role:admin,employee'])->group(function () {

    Route::get('/dashboard', [GlobalReservationController::class, "index"]);
    Route::get('/stationsdash', [StationManagementController::class, "index"]);
    Route::get('/stationsdash/{station}', [StationManagementController::class, 'show']);

});

// ----- ROUTE DE DEBUG -----
Route::get('/testConnexion', function () {
    return inertia('testConnexion');
})->middleware('auth');