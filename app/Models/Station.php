<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Station extends Model
{
    protected $fillable = ['name'];

    public function bikes() {
        return $this->hasMany(Bike::class);
    }

    public function schedules() {
        return $this->hasMany(Schedule::class);
    }
}
