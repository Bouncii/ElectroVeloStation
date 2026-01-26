<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return inertia('home');
});

Route::get('/', function () {
    return inertia('reservation');
});
