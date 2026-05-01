<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Cambiaremos el nombre de la tabla generada a 'alumnos_cursos_libros' para seguir tu documentación
        Schema::create('prestamos', function (Blueprint $table) {
            $table->id();
            $table->string('isbn');
            $table->foreign('isbn')->references('isbn')->on('libros')->onDelete('cascade');
            $table->foreignId('id_alumno')->constrained('alumnos')->onDelete('cascade');
            $table->foreignId('id_curso')->constrained('cursos')->onDelete('cascade');
            $table->date('fecha_entrega');
            $table->date('fecha_devolucion')->nullable();
            $table->enum('estado', ['entregado', 'por_devolver']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prestamos');
    }
};
