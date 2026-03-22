<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Reservation extends Model
{
    use HasFactory;
    protected $fillable = ['start_date', 'end_date', 'email','user_id', 'station_id', 'status'];
    protected $appends = ['is_checkable'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function station() {
        return $this->belongsTo(Station::class, 'station_id');
    }

    public function attributions() {
        return $this->hasMany(Attribution::class);
    }

    public function scopePending($query){
        return $query->where('status', 'pending');
    }

    public function getIsCheckableAttribute(){
        $targetDate = new Carbon($this->start_date);
        return now()->diffInMinutes($targetDate, false) <= 30;
    }
}
