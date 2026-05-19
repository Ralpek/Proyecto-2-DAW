<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Prestamo;
use App\Models\Libro; // ¡Importante! Importamos el modelo Libro
use Illuminate\Http\Request;

class PrestamoController extends Controller
{
    public function index()
    {
        return response()->json(Prestamo::orderBy('id', 'desc')->get());
    }

    public function store(Request $request)
    {
        $datosValidados = $request->validate([
            'isbn' => 'required|string',
            'id_alumno' => 'required|integer',
            'id_curso' => 'required|integer',
            'fecha_entrega' => 'required|date',
            'fecha_devolucion' => 'nullable|date',
            'estado' => 'required|in:entregado,por_devolver',
        ]);

        // CP-03 y CP-04: CONTROL DE STOCK
        $libro = Libro::where('isbn', $datosValidados['isbn'])->first();

        // Si no existe el libro o tiene 0 ejemplares, bloqueamos la operación (CP-04)
        if (!$libro || $libro->numero_ejemplares <= 0) {
            return response()->json([
                'mensaje' => 'No hay ejemplares disponibles para este libro.'
            ], 400); // 400 Bad Request
        }

        // Si hay stock, creamos el préstamo
        $prestamo = Prestamo::create($datosValidados);

        // Y restamos un ejemplar de la base de datos (CP-03)
        $libro->numero_ejemplares -= 1;
        $libro->save();

        return response()->json($prestamo, 201);
    }

    public function show(string $id)
    {
        return response()->json(Prestamo::findOrFail($id));
    }

    public function update(Request $request, string $id)
    {
        $prestamo = Prestamo::findOrFail($id);

        $datosValidados = $request->validate([
            'isbn' => 'sometimes|required|string',
            'id_alumno' => 'sometimes|required|integer',
            'id_curso' => 'sometimes|required|integer',
            'fecha_entrega' => 'sometimes|required|date',
            'fecha_devolucion' => 'nullable|date',
            'estado' => 'sometimes|required|in:entregado,por_devolver',
        ]);

        // LOGICA EXTRA: Si el estado cambia a 'entregado', devolvemos el libro a la biblioteca
        if (isset($datosValidados['estado']) && $datosValidados['estado'] === 'entregado' && $prestamo->estado === 'por_devolver') {
            $libro = Libro::where('isbn', $prestamo->isbn)->first();
            if ($libro) {
                $libro->numero_ejemplares += 1;
                $libro->save();
            }
        }

        $prestamo->update($datosValidados);
        return response()->json($prestamo);
    }

    public function destroy(string $id)
    {
        $prestamo = Prestamo::findOrFail($id);

        // LOGICA EXTRA: Si borramos un préstamo que no había sido devuelto, restauramos el stock
        if ($prestamo->estado === 'por_devolver') {
            $libro = Libro::where('isbn', $prestamo->isbn)->first();
            if ($libro) {
                $libro->numero_ejemplares += 1;
                $libro->save();
            }
        }

        $prestamo->delete();
        
        return response()->json(['mensaje' => 'Préstamo eliminado correctamente']);
    }
}