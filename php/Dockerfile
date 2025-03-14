# Usar la imagen base de PHP con Apache
FROM php:8.3-apache

# Instalar dependencias del sistema y extensiones de PHP
RUN apt-get update && apt-get install -y libpq-dev libzip-dev zip && docker-php-ext-install pdo pdo_pgsql zip

# Habilitar el módulo rewrite de Apache (para URLs amigables)
RUN a2enmod rewrite

# Copiar un archivo de configuración personalizado de PHP (opcional)
COPY php.ini /usr/local/etc/php/conf.d/custom.ini

# Establecer el directorio de trabajo
WORKDIR /var/www/html

# Exponer el puerto 80 (Apache)
EXPOSE 80