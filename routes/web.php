<?php

use Illuminate\Support\Facades\Route;

Route::get('/home', function () {
    return inertia('home');
});

Route::get('/reservation', function () {
    return inertia('reservation');
});
