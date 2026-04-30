# Usamos la versión LTS actual de Node
FROM node:20

# Establecemos el directorio de trabajo
WORKDIR /app

# Instalamos el CLI de Angular de forma global
RUN npm install -g @angular/cli

# Exponemos el puerto de Angular
EXPOSE 4201

# Comando por defecto para arrancar la aplicación de Angular en el puerto 4201
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4201"]