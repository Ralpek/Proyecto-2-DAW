<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AlumnoController;
use App\Http\Controllers\Api\MateriaController;
use App\Http\Controllers\Api\CursoController;
use App\Http\Controllers\Api\LibroController;
use App\Http\Controllers\Api\PrestamoController;
use App\Http\Controllers\Api\AuthController;


Route::apiResource('alumnos', AlumnoController::class);
Route::apiResource('materias', MateriaController::class);
Route::apiResource('cursos', CursoController::class);
Route::apiResource('libros', LibroController::class);
Route::apiResource('prestamos', PrestamoController::class);
Route::post('login', [AuthController::class, 'login']);