# Usar la imagen base de PHP con Apache
FROM php:8.1-apache

# Instalar extensiones necesarias de PHP
RUN docker-php-ext-install pdo pdo_pgsql pgsql

# Copiar el contenido de la carpeta del proyecto a la carpeta de Apache en el contenedor
COPY . /var/www/html/

# Dar permisos adecuados a la carpeta de Apache
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Exponer el puerto 80 para acceder a la aplicación
EXPOSE 80
