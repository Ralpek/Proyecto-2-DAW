<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Curso;
use Illuminate\Http\Request;

class CursoController extends Controller
{
    public function index()
    {
        return response()->json(Curso::orderBy('id', 'desc')->get());
    }

    public function store(Request $request)
    {
        $datosValidados = $request->validate([
            'curso' => 'required|string|max:20',
            'nivel' => 'required|string|max:20',
        ]);

        $curso = Curso::create($datosValidados);
        return response()->json($curso, 201);
    }

    public function show(string $id)
    {
        return response()->json(Curso::findOrFail($id));
    }

    public function update(Request $request, string $id)
    {
        $curso = Curso::findOrFail($id);

        $datosValidados = $request->validate([
            'curso' => 'sometimes|required|string|max:20',
            'nivel' => 'sometimes|required|string|max:20',
        ]);

        $curso->update($datosValidados);
        return response()->json($curso);
    }

    public function destroy(string $id)
    {
        $curso = Curso::findOrFail($id);
        $curso->delete();
        
        return response()->json(['mensaje' => 'Curso eliminado correctamente']);
    }
}