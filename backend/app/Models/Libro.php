<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Libro extends Model {
    // Le avisamos de que la clave primaria es el ISBN, que es un string y no es autoincremental
    protected $primaryKey = 'isbn';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['isbn', 'titulo', 'autor', 'numero_ejemplares', 'id_materia', 'id_curso'];
}
