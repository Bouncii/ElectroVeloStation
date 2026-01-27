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
