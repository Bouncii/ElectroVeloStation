<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable; // Obligatoire pour l'auth
use Illuminate\Notifications\Notifiable;

class Utilisateur extends Authenticatable
{
    use Notifiable;

    protected $table = 'utilisateurs';

    protected $fillable = [
        'nom', 'prenom', 'mail', 'mdp', 'acces',
    ];

    protected $hidden = [
        'mdp' // Cache le mot de passe dans les résultats
    ];

    public function getAuthPassword()
    {
        return $this->mdp;
    }
}