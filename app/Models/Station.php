<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Station extends Model
{
    use HasFactory;
    protected $fillable = ['name'];

    public function bikes() {
        return $this->hasMany(Bike::class);
    }

    public function schedules() {
        return $this->hasMany(Schedule::class);
    }


    public function departures() {
        return $this->hasMany(Reservation::class, 'pickup_station_id');
    }

    public function arrivals() {
        return $this->hasMany(Reservation::class, 'return_station_id');
    }
    
}
