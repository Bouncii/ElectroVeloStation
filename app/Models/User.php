<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory;
    use Notifiable;

    protected $fillable = ['first_name', 'last_name', 'email', 'password', 'role'];

    protected $hidden = ['password', 'remember_token'];

    public function people() {
        return $this->hasMany(Person::class);
    }

    public function reservations() {
        return $this->hasMany(Reservation::class);
    }
}
