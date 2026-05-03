<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Prestamo;
use Illuminate\Http\Request;

class PrestamoController extends Controller
{
    public function index() {
        return response()->json(Prestamo::orderBy('id', 'desc')->get());
    }

    public function store(Request $request) {
        $datosValidados = $request->validate([
            'isbn' => 'required|exists:libros,isbn',
            'id_alumno' => 'required|exists:alumnos,id',
            'id_curso' => 'required|exists:cursos,id',
            'fecha_entrega' => 'required|date',
            'fecha_devolucion' => 'nullable|date|after_or_equal:fecha_entrega',
            'estado' => 'required|in:entregado,por_devolver',
        ]);

        $prestamo = Prestamo::create($datosValidados);
        return response()->json($prestamo, 201);
    }

    public function show(string $id) {
        return response()->json(Prestamo::findOrFail($id));
    }

    public function update(Request $request, string $id) {
        $prestamo = Prestamo::findOrFail($id);
        
        $datosValidados = $request->validate([
            'fecha_devolucion' => 'nullable|date|after_or_equal:fecha_entrega',
            'estado' => 'sometimes|required|in:entregado,por_devolver',
        ]);

        $prestamo->update($datosValidados);
        return response()->json($prestamo);
    }

    public function destroy(string $id) {
        $prestamo = Prestamo::findOrFail($id);
        $prestamo->delete();
        return response()->json(['mensaje' => 'Préstamo eliminado']);
    }
}