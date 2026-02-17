<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bike extends Model
{
    use HasFactory;

    protected $fillable = ['size', 'state', 'station_id'];

    public function station() {
        return $this->belongsTo(Station::class);
    }
}
