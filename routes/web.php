<?php
use App\Http\Controllers\UserReservationController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GlobalReservationController;
use App\Http\Controllers\StationController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PersonController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\ProfileController;

// -------- ROUTES PUBLIQUES -------
Route::get('/', function () {
    return inertia('home');
})->name('home');


Route::get('/reservation', [UserReservationController::class, 'create']);
Route::post('/reservation', [UserReservationController::class, 'store']);

// ---------- ROUTES SI CONNECTE -------------
Route::middleware(['auth','role:admin,employee,client'])
    ->prefix('profile')
    ->group(function () {
        Route::get('/', [ProfileController::class, "index"]);
        Route::post('/', [ProfileController::class, 'store']);
    });


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

