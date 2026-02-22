<?php
use App\Http\Controllers\StationManagementController;
use App\Http\Controllers\GlobalReservationController;
use App\Http\Controllers\StationController;
use Illuminate\Support\Facades\Route;

// -------- ROUTES PUBLIQUES -------
Route::get('/', function () {
    return inertia('home');
});

Route::get('/reservation', function () {
    return inertia('reservation');
});

// ----- ROUTES PROTÉGÉES -----
Route::middleware(['auth', 'role:admin,employee'])->group(function () {

    Route::get('/dashboard', [GlobalReservationController::class, "index"]);

    Route::resource('/dashboard/stations', StationController::class); // laravel associe les routes aux méthodes tt seul car il comprends que c'est un crud 

});

// ----- ROUTE DE DEBUG -----
Route::get('/testConnexion', function () {
    return inertia('testConnexion');
})->middleware('auth');