<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Person extends Model
{
    use HasFactory;
    protected $fillable = ['first_name', 'last_name', 'age', 'required_bike_size', 'user_id'];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
