<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alumno;
use Illuminate\Http\Request;

class AlumnoController extends Controller
{
    // 1. Obtener todos los alumnos
    public function index()
    {
        // Devolvemos todos los alumnos ordenados por ID de forma descendente (los más nuevos primero)
        $alumnos = Alumno::orderBy('id', 'desc')->get();
        return response()->json($alumnos);
    }

    // 2. Guardar un nuevo alumno
    public function store(Request $request)
    {
        // Validamos que Angular nos envíe la información correcta
        $datosValidados = $request->validate([
            'nombre' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'tramo' => 'required|in:I,II,Ninguno',
            'bilingue' => 'required|in:S,N',
        ]);

        // Creamos el alumno en la base de datos MySQL
        $alumno = Alumno::create($datosValidados);

        // Devolvemos el alumno recién creado a Angular con un código 201 (Creado)
        return response()->json($alumno, 201);
    }

    // 3. Mostrar un alumno en concreto (por ID)
    public function show(string $id)
    {
        $alumno = Alumno::findOrFail($id);
        return response()->json($alumno);
    }

    // 4. Actualizar un alumno
    public function update(Request $request, string $id)
    {
        $alumno = Alumno::findOrFail($id);

        $datosValidados = $request->validate([
            'nombre' => 'sometimes|required|string|max:255',
            'apellidos' => 'sometimes|required|string|max:255',
            'tramo' => 'sometimes|required|in:I,II,Ninguno',
            'bilingue' => 'sometimes|required|in:S,N',
        ]);

        $alumno->update($datosValidados);
        return response()->json($alumno);
    }

    // 5. Eliminar un alumno
    public function destroy(string $id)
    {
        $alumno = Alumno::findOrFail($id);
        $alumno->delete();
        
        return response()->json(['mensaje' => 'Alumno eliminado correctamente']);
    }
}