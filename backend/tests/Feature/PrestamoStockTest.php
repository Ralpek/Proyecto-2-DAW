<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Libro;
use App\Models\Alumno;
use App\Models\Curso;
use App\Models\Materia;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

class PrestamoStockTest extends TestCase
{
    use RefreshDatabase; // Resetea la BD en cada prueba

    private function prepararDatos($stockLibro)
    {
        // 1. Simulamos un usuario logueado para que el guardián nos deje pasar
        Sanctum::actingAs(User::factory()->create());

        // 2. Creamos los datos necesarios en la BD temporal
        $materia = Materia::create(['nombre' => 'Test', 'departamento' => 'Test']);
        $curso = Curso::create(['curso' => 'A', 'nivel' => '1 ESO']);
        $alumno = Alumno::create(['nombre' => 'Juan', 'apellidos' => 'Perez', 'tramo' => 'I', 'bilingue' => 'S']);
        
        $libro = Libro::create([
            'isbn' => '123-456', 
            'titulo' => 'Libro Test', 
            'autor' => 'Autor Test', 
            'numero_ejemplares' => $stockLibro, 
            'id_materia' => $materia->id, 
            'id_curso' => $curso->id
        ]);

        return ['alumno' => $alumno, 'curso' => $curso, 'libro' => $libro];
    }

    public function test_cp03_prestamo_con_stock_reduce_ejemplares()
    {
        $datos = $this->prepararDatos(5); // Libro con 5 ejemplares

        // Hacemos la petición POST a nuestra API
        $response = $this->postJson('/api/prestamos', [
            'isbn' => $datos['libro']->isbn,
            'id_alumno' => $datos['alumno']->id,
            'id_curso' => $datos['curso']->id,
            'fecha_entrega' => '2026-01-10',
            'estado' => 'por_devolver'
        ]);

        // Verificamos que se creó correctamente (HTTP 201)
        $response->assertStatus(201);

        // Verificamos en la BD que el libro ahora tiene 4 ejemplares (5 - 1)
        $this->assertDatabaseHas('libros', [
            'isbn' => '123-456',
            'numero_ejemplares' => 4
        ]);
    }

    public function test_cp04_prestamo_rechazado_sin_stock()
    {
        $datos = $this->prepararDatos(0); // Libro con 0 ejemplares

        // Intentamos hacer el préstamo
        $response = $this->postJson('/api/prestamos', [
            'isbn' => $datos['libro']->isbn,
            'id_alumno' => $datos['alumno']->id,
            'id_curso' => $datos['curso']->id,
            'fecha_entrega' => '2026-01-10',
            'estado' => 'por_devolver'
        ]);

        // Verificamos que nos da el error 400 que programamos
        $response->assertStatus(400);
        $response->assertJson(['mensaje' => 'No hay ejemplares disponibles para este libro.']);
    }
}