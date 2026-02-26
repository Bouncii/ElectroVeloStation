<?php
use App\Http\Controllers\StationManagementController;
use App\Http\Controllers\GlobalReservationController;
use App\Http\Controllers\StationController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PersonController;

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
    Route::resource('/dashboard/users', UserController::class);
    Route::resource('/dashboard/persons', PersonController::class)->only(['update', 'store', 'destroy']);

});

// ----- ROUTE DE DEBUG -----
Route::get('/testConnexion', function () {
    return inertia('testConnexion');
})->middleware('auth');