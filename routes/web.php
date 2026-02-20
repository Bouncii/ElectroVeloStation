<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return inertia('home');
});

Route::get('/reservation', function () {
    return inertia('reservation');
});

Route::get('/connexion', function () {
    return inertia('connexion');
});

Route::get('/creerCompte', function () {
    return inertia('creerCompte');
});

Route::get('/dashboard', function () {
    return inertia('dashboard');
});

Route::get('/stationsdash', function () {
    return inertia('stationsdash');
});