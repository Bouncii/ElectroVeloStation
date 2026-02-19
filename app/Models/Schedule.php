<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    protected $fillable = ['open_time', 'close_time', 'day_of_week', 'station_id'];

    public function station() {
        return $this->belongsTo(Station::class);
    }
}