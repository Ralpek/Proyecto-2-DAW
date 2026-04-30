# Usamos la versión LTS actual de Node
FROM node:20

# Establecemos el directorio de trabajo
WORKDIR /app

# Instalamos el CLI de Angular de forma global
RUN npm install -g @angular/cli

# Exponemos el puerto de Angular
EXPOSE 4201

# Instalamos las dependencias locales y luego arrancamos la aplicación
CMD ["sh", "-c", "npm install && ng serve --host 0.0.0.0 --port 4201"]