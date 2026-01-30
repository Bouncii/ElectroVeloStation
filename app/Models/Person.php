<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Person extends Model
{
    protected $fillable = ['first_name', 'last_name', 'age', 'required_bike_size', 'user_id'];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
