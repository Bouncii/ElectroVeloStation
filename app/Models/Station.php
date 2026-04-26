<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Station extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'latitude',
        'longitude',
    ];

    public function bikes() {
        return $this->hasMany(Bike::class);
    }

    public function schedules() { 
        return $this->hasMany(Schedule::class);
    }


    public function reservations() {
        return $this->hasMany(Reservation::class, 'station_id');
    }

    public function departures() {
        return $this->hasMany(Reservation::class, 'station_id')
                    ->whereDate('start_date', now()->toDateString());
    }

    public function arrivals() {
        return $this->hasMany(Reservation::class, 'station_id')
                    ->whereDate('end_date', now()->toDateString());
    }

     //Fonction qui renvoie le nombre de départs entre deux dates
    public function countDeparturesBetween($startDate, $endDate) {
        return $this->reservations()
                    ->whereBetween('start_date', [$startDate, $endDate])
                    ->count();
    }

    //Fonction qui renvoie le nombre d'arrivées entre deux dates
    public function countArrivalsBetween($startDate, $endDate) {
        return $this->reservations()
                    ->whereBetween('end_date', [$startDate, $endDate])
                    ->count();
    }
}