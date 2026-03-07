<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Bike extends Model
{
    use HasFactory;

    protected $fillable = ['size', 'state', 'station_id'];

    public function station() {
        return $this->belongsTo(Station::class);
    }

    // renvoi les vélos dispos pendant une période et à une station donnée.
    public function scopeAvailableAtStationOn(Builder $query, $stationId, $startDate, $endDate){
        return $query
            ->whereDoesntHave('attributions.reservation', function ($query) use ($startDate, $endDate) {
                $query->where('start_date', '<', $endDate)
                  ->where('end_date', '>', $startDate)
                  ->where('status', '!=', 'cancelled');
            })
            
            ->where(function ($query) use ($stationId, $startDate) {
                
                $query->where(function ($q) use ($stationId, $startDate) {
                    
                    $q->whereDoesntHave('attributions.reservation', function ($res) use ($startDate) {
                        $res->where('end_date', '<=', $startDate)
                            ->where('status', '!=', 'cancelled');
                    })->where('station_id', $stationId);
                    
                })
                
                ->orWhereHas('attributions.reservation', function ($query) use ($stationId, $startDate) {
                    $query->where('end_date', '<=', $startDate)
                      ->where('return_station_id', $stationId)
                      ->where('status', '!=', 'cancelled')
                      
                      ->whereRaw('reservations.end_date = (
                          SELECT MAX(r2.end_date) 
                          FROM reservations r2
                          JOIN attributions a2 ON r2.id = a2.reservation_id
                          WHERE a2.bike_id = bikes.id 
                          AND r2.end_date <= ?
                          AND r2.status != "cancelled"
                      )', [$startDate]);
                });
            });
    }
}
