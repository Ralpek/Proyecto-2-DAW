# Usamos PHP 8.2 en su versión CLI para desarrollo
FROM php:8.2-cli

# Instalamos dependencias del sistema y extensiones de PHP necesarias
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    && docker-php-ext-install pdo_mysql zip

# Instalamos Composer de forma global
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Establecemos el directorio de trabajo
WORKDIR /var/www/html

# Por defecto, levantamos el servidor de desarrollo de Laravel en el puerto 8000
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]