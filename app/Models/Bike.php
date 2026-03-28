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
    public function scopeAvailableAtStationOn(Builder $query, $stationId, $startDate, $endDate, $ignoreId = null)
    {
        return $query
            ->whereDoesntHave('attributions.reservation', function ($q) use ($startDate, $endDate, $ignoreId) {
                $q->where('start_date', '<', $endDate)
                    ->where('end_date', '>', $startDate)
                    ->where('status', '!=', 'cancelled');

                if ($ignoreId) {
                    $q->where('id', '!=', $ignoreId);
                }
            })
            ->where(function ($query) use ($stationId, $startDate, $ignoreId) {

                $query->where(function ($q) use ($stationId, $startDate, $ignoreId) {
                    $q->whereDoesntHave('attributions.reservation', function ($res) use ($startDate, $ignoreId) {
                        $res->where('end_date', '<=', $startDate)
                            ->where('status', '!=', 'cancelled');

                        if ($ignoreId) {
                            $res->where('id', '!=', $ignoreId);
                        }
                    })->where('station_id', $stationId);
                })

                    ->orWhereHas('attributions.reservation', function ($q) use ($stationId, $startDate, $ignoreId) {
                        $q->where('end_date', '<=', $startDate)
                            ->where('return_station_id', $stationId)
                            ->where('status', '!=', 'cancelled');

                        if ($ignoreId) {
                            $q->where('id', '!=', $ignoreId);
                        }
                        $sql = "reservations.end_date = (
                        SELECT MAX(r.end_date) 
                        FROM reservations r
                        JOIN attributions a ON r.id = a.reservation_id
                        WHERE a.bike_id = bikes.id 
                        AND r.end_date <= '$startDate'
                        AND r.status != 'cancelled'";

                        if ($ignoreId) {
                            $sql .= " AND r.id != $ignoreId";
                        }
                        $sql .= ")";
                        $q->whereRaw($sql);
                    });
            });
    }
}
