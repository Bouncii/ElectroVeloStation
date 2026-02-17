<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attribution extends Model
{
    use HasFactory;
    protected $fillable = ['reservation_id', 'person_id', 'bike_id'];

    public function reservation() { return $this->belongsTo(Reservation::class); }
    public function person() { return $this->belongsTo(Person::class); }
    public function bike() { return $this->belongsTo(Bike::class); }
}
