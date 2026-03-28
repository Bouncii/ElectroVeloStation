<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Bike extends Model
{
    use HasFactory;

    protected $fillable = ['size', 'state', 'station_id'];

    public function attributions(): HasMany
    {
        return $this->hasMany(Attribution::class);
    }
    public function station()
    {
        return $this->belongsTo(Station::class);
    }

    public function propositions()
    {
        return $this->belongsToMany(Proposition::class);
    }

    // renvoi les vélos dispos pendant une période et à une station donnée.
    public function scopeAvailableAtStationOn($query, $stationId, $startDate, $endDate, $ignoreReservationId = null)
    {
        return $query->where('station_id', $stationId)
            ->where('state', '!=', 'maintenance')
            
            ->whereDoesntHave('attributions.reservation', function ($q) use ($startDate, $endDate, $ignoreReservationId) {
                $q->where('start_date', '<', $endDate)
                  ->where('end_date', '>', $startDate) 
                  ->whereIn('status', ['confirmed', 'in_progress', 'pending']);
                if ($ignoreReservationId) {
                    $q->where('id', '!=', $ignoreReservationId);
                }
            })
            
            ->whereDoesntHave('propositions', function ($q) use ($startDate, $endDate, $ignoreReservationId) {
                $q->whereIn('status', ['pending', 'accepted'])
                  ->whereHas('reservation', function ($resQuery) use ($startDate, $endDate, $ignoreReservationId) {
                      $resQuery->where('start_date', '<', $endDate)
                               ->where('end_date', '>', $startDate); 
                      if ($ignoreReservationId) {
                          $resQuery->where('id', '!=', $ignoreReservationId);
                      }
                  });
            });
    }
}
