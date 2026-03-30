<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Proposition extends Model
{
    use HasFactory;

    protected $fillable = [
        'reservation_id',
        'status',
        'expires_at',
    ];
    protected $casts = [
        'expires_at' => 'datetime',
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    public function bikes()
    {
        return $this->belongsToMany(Bike::class);
    }
}