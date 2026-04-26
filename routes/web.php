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

// ---------- ROUTES SI CONNECTE -------------
Route::middleware(['auth','role:admin,employee,client'])
    ->prefix('profile')
    ->group(function () {
        Route::get('/', [ProfileController::class, "index"]);
         Route::post('/update', [ProfileController::class, "update"]);
        Route::post('/people/{id}/update', [ProfileController::class, "updatePerson"]);
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


        Route::prefix('dashboard')->group(function () {
            
            Route::get('/', [DashboardController::class, "index"])->name('index');
            
            Route::prefix('{station}')->group(function () {

                Route::get('/', [DashboardController::class, "show"])->name('show');
                
                Route::post('/bikes/maintenance', [DashboardController::class, 'putInMaintenance'])->name('bikes.maintenance');
                Route::post('/bikes/available', [DashboardController::class, 'makeAvailable'])->name('bikes.available');
                Route::post('/bikes/add', [DashboardController::class, 'addBike'])->name('bikes.add');
                Route::post('/bikes/remove', [DashboardController::class, 'removeBike'])->name('bikes.remove');

                Route::post('/rebalance', [DashboardController::class, 'rebalanceBikes'])->name('rebalance');

                Route::patch('/reservations/{reservation}/checkin', [DashboardController::class, 'checkIn'])->name('checkin');
                Route::patch('/reservations/{reservation}/checkout', [DashboardController::class, 'checkOut'])->name('checkout');
            });
        });
    }
);

