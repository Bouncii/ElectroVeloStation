<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Schedule extends Model
{
    use HasFactory;
    protected $fillable = ['open_time', 'close_time', 'day_of_week', 'station_id'];

    public function station() {
        return $this->belongsTo(Station::class);
    }
}