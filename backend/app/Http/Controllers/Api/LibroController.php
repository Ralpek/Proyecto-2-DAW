<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Libro;
use Illuminate\Http\Request;

class LibroController extends Controller
{
    public function index() {
        return response()->json(Libro::all());
    }

    public function store(Request $request) {
        $datosValidados = $request->validate([
            'isbn' => 'required|string|unique:libros,isbn', // El ISBN debe ser único
            'titulo' => 'required|string|max:255',
            'autor' => 'required|string|max:255',
            'numero_ejemplares' => 'required|integer|min:0',
            'id_materia' => 'required|exists:materias,id', // Validamos que la materia exista
            'id_curso' => 'required|exists:cursos,id',     // Validamos que el curso exista
        ]);

        $libro = Libro::create($datosValidados);
        return response()->json($libro, 201);
    }

    public function show(string $isbn) {
        return response()->json(Libro::findOrFail($isbn));
    }

    public function update(Request $request, string $isbn) {
        $libro = Libro::findOrFail($isbn);
        
        $datosValidados = $request->validate([
            'titulo' => 'sometimes|required|string|max:255',
            'autor' => 'sometimes|required|string|max:255',
            'numero_ejemplares' => 'sometimes|required|integer|min:0',
            'id_materia' => 'sometimes|required|exists:materias,id',
            'id_curso' => 'sometimes|required|exists:cursos,id',
        ]);

        $libro->update($datosValidados);
        return response()->json($libro);
    }

    public function destroy(string $isbn) {
        $libro = Libro::findOrFail($isbn);
        $libro->delete();
        return response()->json(['mensaje' => 'Libro eliminado']);
    }
}