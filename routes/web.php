<?php
use App\Http\Controllers\StationManagementController;
use App\Http\Controllers\GlobalReservationController;
use Illuminate\Support\Facades\Route;

Route::get('/home', function () {
    return inertia('home');
});

Route::get('/dashboard', [GlobalReservationController::class,"index"]);

Route::get('/dashboard/stations', [StationManagementController::class,"index"]);

Route::get('/dashboard/stations/{station}', [StationManagementController::class, 'show']);
