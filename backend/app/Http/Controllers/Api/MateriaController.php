<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Materia;
use Illuminate\Http\Request;

class MateriaController extends Controller
{
    public function index()
    {
        return response()->json(Materia::orderBy('id', 'desc')->get());
    }

    public function store(Request $request)
    {
        $datosValidados = $request->validate([
            'nombre' => 'required|string|max:255',
            'departamento' => 'required|string|max:255',
        ]);

        $materia = Materia::create($datosValidados);
        return response()->json($materia, 201);
    }

    public function show(string $id)
    {
        return response()->json(Materia::findOrFail($id));
    }

    public function update(Request $request, string $id)
    {
        $materia = Materia::findOrFail($id);

        $datosValidados = $request->validate([
            'nombre' => 'sometimes|required|string|max:255',
            'departamento' => 'sometimes|required|string|max:255',
        ]);

        $materia->update($datosValidados);
        return response()->json($materia);
    }

    public function destroy(string $id)
    {
        $materia = Materia::findOrFail($id);
        $materia->delete();
        
        return response()->json(['mensaje' => 'Materia eliminada correctamente']);
    }
}