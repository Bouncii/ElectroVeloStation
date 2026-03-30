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

    // Fonction qui calcule la distance en km entre deux stations
    public function distanceTo(Station $otherStation, $precision = 1){
        if (!$this->latitude || !$this->longitude || !$otherStation->latitude || !$otherStation->longitude) {
            return 0;
        }
        $terreRadius = 6371;
        $lat1 = deg2rad($this->latitude);
        $lon1 = deg2rad($this->longitude);
        $lat2 = deg2rad($otherStation->latitude);
        $lon2 = deg2rad($otherStation->longitude);
        $latDelta = $lat2 - $lat1;
        $lonDelta = $lon2 - $lon1;
        $a = sin($latDelta / 2) * sin($latDelta / 2) +
             cos($lat1) * cos($lat2) *
             sin($lonDelta / 2) * sin($lonDelta / 2);
             
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        $distance = $terreRadius * $c;
        return round($distance, $precision);
    }

}