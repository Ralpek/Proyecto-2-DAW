<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alumno extends Model
{
    // Campos que permitimos rellenar masivamente
    protected $fillable = [
        'nombre',
        'apellidos',
        'tramo',
        'bilingue'
    ];
}