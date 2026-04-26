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


Route::get('/reservation', [UserReservationController::class, 'index']);
Route::post('/reservation', [UserReservationController::class, 'store']);

Route::get('/confirmation', function () {return inertia('confirmationReservation');});

// ---------- ROUTES SI CONNECTE -------------
Route::middleware(['auth','role:admin,employee,client'])
    ->prefix('profile')
    ->group(function () {
    
        Route::get('/', [ProfileController::class, "index"]);
        Route::patch('/update', [ProfileController::class, "update"]);

        // --- GESTION DES PERSONNES ---
        Route::post('/persons', [ProfileController::class, 'storePerson']);
        Route::patch('/persons/{person}', [ProfileController::class, 'updatePerson']);
        Route::delete('/persons/{person}', [ProfileController::class, 'destroyPerson']);

        Route::patch('/propositions/{proposition}/accept', [ProfileController::class, 'acceptProposition']);
        Route::patch('/propositions/{proposition}/reject', [ProfileController::class, 'rejectProposition']);

        Route::patch('/reservations/{reservation}/cancel', [ProfileController::class, 'cancelReservation']);
        Route::post('/reservations/{reservation}/transfer', [ProfileController::class, 'transferReservation']);  
    });


// ----- ROUTES PROTEGEES -----
Route::middleware(['auth', 'role:admin,employee'])
    ->prefix('panel')
    ->group(function () {

        Route::get('/', [GlobalReservationController::class, "index"]);
        Route::resource('/stations', StationController::class); // laravel associe les routes aux méthodes tt seul car il comprends que c'est un crud grace à ressource
        Route::resource('/users', UserController::class);
        Route::resource('/persons', PersonController::class)->only(['update', 'store', 'destroy', 'show']);
        Route::resource('/schedules', ScheduleController::class)->only(['update']);
        Route::resource('/reservations', ReservationController::class);


        Route::prefix('dashboard')->group(function () {
            
            Route::get('/', [DashboardController::class, "index"]);
            
            Route::prefix('{station}')->group(function () {

                Route::get('/', [DashboardController::class, "show"]);
                
                Route::post('/bikes/maintenance', [DashboardController::class, 'putInMaintenance']);
                Route::post('/bikes/available', [DashboardController::class, 'makeAvailable']);
                Route::post('/bikes/add', [DashboardController::class, 'addBike']);
                Route::post('/bikes/remove', [DashboardController::class, 'removeBike']);

                Route::post('/rebalance', [DashboardController::class, 'rebalanceBikes']);

                Route::patch('/reservations/{reservation}/checkin', [DashboardController::class, 'checkIn']);
                Route::patch('/reservations/{reservation}/checkout', [DashboardController::class, 'checkOut']);
            });
        });
    }
);

