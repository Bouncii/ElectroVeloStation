<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Station;
use App\Observers\StationObserver;
use App\Models\Reservation;
use App\Observers\ReservationObserver;
use App\Models\Bike;
use App\Observers\BikeObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Station::observe(StationObserver::class);
        Reservation::observe(ReservationObserver::class);
        Bike::observe(BikeObserver::class);
    }
}
