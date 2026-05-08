# Sistema de Gestión Académica y Biblioteca

Un sistema web completo para la gestión de un centro educativo, que permite administrar alumnos, cursos, materias y un sistema integrado de préstamo de libros.

## Características Principales

* **Sistema de Autenticación:** Login seguro con bloqueo de rutas para usuarios no autenticados.
* **Gestión de Alumnos:** Formularios para añadir, visualizar y administrar alumnos en el sistema.
* **Gestión Académica:** Control de Materias y Cursos.
* **Módulo de Biblioteca:** Panel para visualizar libros disponibles y gestionar préstamos.
* **Notificaciones en Tiempo Real:** Alertas visuales al añadir o eliminar registros.
* **Importación/Exportación de Datos:** Capacidad para cargar y descargar datos mediante archivos JSON, incluyendo un sistema para evitar duplicados en la base de datos.
* **Contenedorización:** Configuración completa con Docker para un despliegue rápido y estandarizado.

## Tecnologías Utilizadas

* **Frontend:** HTML, CSS, Bootstrap.
* **Backend:** Controladores estructurados (MVC) y conexión a Base de Datos (con sistema de migraciones).
* **Infraestructura:** Docker y Docker Compose.
* **Carga de Datos:** Formato JSON.

## Estructura del Proyecto

El repositorio está dividido principalmente en dos áreas funcionales:
* `/front` - Contiene la estructura de la interfaz de usuario, vistas y archivos estáticos (Bootstrap).
* `/back` - Contiene la lógica de negocio, controladores y comunicación con la base de datos.

## ⚙️ Requisitos Previos

Para ejecutar este proyecto en tu entorno local, necesitarás tener instalado:
* [Docker](https://www.docker.com/) y Docker Compose.
* Git.


## Autores
Daniel Muñoz
Pablo Marin
Rafael Pérez