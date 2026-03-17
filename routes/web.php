<?php
use App\Http\Controllers\StationManagementController;
use App\Http\Controllers\StationReservationController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GlobalReservationController;
use App\Http\Controllers\StationController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PersonController;
use App\Http\Controllers\ScheduleController;

// -------- ROUTES PUBLIQUES -------
Route::get('/', function () {
    return inertia('home');
});

Route::get('/reservation', function () {
    return inertia('reservation');
});

Route::get('/reservation', [ScheduleController::class, 'index']);
Route::get('/reservation', [StationReservationController::class, 'show']);

Route::get('/reservation', [PersonnControler::class, 'index'])->middleware('auth');

// ----- ROUTES PROTEGEES -----
Route::middleware(['auth', 'role:admin,employee'])
    ->prefix('panel')
    ->group(function () {

        Route::get('/', [GlobalReservationController::class, "index"]);
        Route::resource('/stations', StationController::class); // laravel associe les routes aux méthodes tt seul car il comprends que c'est un crud 
        Route::resource('/users', UserController::class);
        Route::resource('/persons', PersonController::class)->only(['update', 'store', 'destroy', 'show']);
        Route::resource('/schedules', ScheduleController::class)->only(['update']);
        Route::resource('/reservations', ReservationController::class);

        Route::get('/dashboard', [DashboardController::class, "index"]);
        Route::get('/dashboard/{station}', [DashboardController::class, "show"]);
    }
);

// ----- ROUTE DE DEBUG -----
Route::get('/testConnexion', function () {
    return inertia('testConnexion');
})->middleware('auth');