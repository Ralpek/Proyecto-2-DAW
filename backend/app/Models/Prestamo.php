<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prestamo extends Model {
    protected $fillable = ['isbn', 'id_alumno', 'id_curso', 'fecha_entrega', 'fecha_devolucion', 'estado'];
}