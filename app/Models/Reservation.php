<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;
    protected $fillable = ['start_date', 'end_date', 'user_id', 'pickup_station_id', 'return_station_id', 'status'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function pickupStation() {
        return $this->belongsTo(Station::class, 'pickup_station_id');
    }

    public function returnStation() {
        return $this->belongsTo(Station::class, 'return_station_id');
    }

    public function attributions() {
        return $this->hasMany(Attribution::class);
    }

    public function scopePending($query){
        return $query->where('status', 'pending');
    }
}
