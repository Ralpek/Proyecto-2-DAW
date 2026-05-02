<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AlumnoController;

// Esta única línea crea automáticamente las rutas para el index, store, show, update y destroy
Route::apiResource('alumnos', AlumnoController::class);