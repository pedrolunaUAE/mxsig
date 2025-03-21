#!/bin/bash

# Directorio donde se encuentra este script
current_dir=$(dirname "$(realpath "$0")")

variable1="$current_dir/tomcat"
variable2="$current_dir/mapserver"
# Crear las carpetas dentro del directorio actual
echo "Creación de carpetas de tomcat y mapserver"

mkdir -p "$current_dir/tomcat"
mkdir -p "$current_dir/mapserver"
mkdir -p "$current_dir/mapserver/logs"
mkdir -p "$current_dir/clientes"
mkdir -p "$current_dir/db"

echo "Se van a crear las carpetas y descargar los archivos en: $current_dir"

echo "Descarga de recursos para mxsig"

# Descargar archivos de mxsig
echo "Archivos para mapserver"
if [ ! -d "$current_dir/tomcat/solr-config" ]; then
    curl -k -L -o "$current_dir/mapserver/map.zip" "https://gaia.inegi.org.mx/MxSIG/resources/mxsig/mapserver/map.zip"
    unzip -d "$current_dir/mapserver/" "$current_dir/mapserver/map.zip"
    rm "$current_dir/mapserver/map.zip"
else
    echo "La carpeta de map ya existe"
fi

echo "Archivos para tomcat"
if [ ! -d "$current_dir/tomcat/solr-config" ]; then
    curl -k -L -o "$current_dir/tomcat/solr-config.zip" "https://gaia.inegi.org.mx/MxSIG/resources/mxsig/tomcat/solr-config.zip"
    unzip -d "$current_dir/tomcat/" "$current_dir/tomcat/solr-config.zip"
    rm "$current_dir/tomcat/solr-config.zip"
else
    echo "La carpeta de configuración solr-config ya existe"
fi

echo "Descargar mdmservices.war"
if [ ! -f "$current_dir/tomcat/mdmservices.war" ]; then
    curl -k -L -o "$current_dir/tomcat/mdmservices.war" "https://gaia.inegi.org.mx/MxSIG/resources/mxsig/tomcat/mdmservices.war"
else
    echo "El archivo de mdmservices.war ya existe"
fi

echo "Archivos shapes"
if [ ! -f "$current_dir/db/shapes.zip" ]; then
    curl -k -L -o "$current_dir/db/shapes.zip" "https://gaia.inegi.org.mx/MxSIG/resources/mxsig/shapes/shapes.zip"
    unzip -d "$current_dir/db/" "$current_dir/db/shapes.zip"
    rm "$current_dir/db/shapes.zip"
else
    echo "Los archivos shapes ya existen"
fi

# Descargar proyecto de GitLab
echo "Clonar proyecto de Gitlab"
if [ ! -d "$current_dir/clientes/" ]; then
    git clone "https://github.com/pedrolunaUAE/mxsig-clientes" "$current_dir/clientes/"
else
    echo "El proyecto de GitLab ya ha sido clonado previamente."
fi

# Creación de archivo .env
echo "Creación de archivo .env"
env_file="$current_dir/.env"
echo "DIR_MXSIG_INDICES_SOLR=./tomcat/solr-config" > "$env_file"
echo "DIR_MXSIG_DATA_MAPS=./mapserver/map" >> "$env_file"
echo "DIR_MXSIG_DATA_MAP_LOGS=./mapserver/logs" >> "$env_file"
echo "DIR_MXSIG_DATA=./clientes" >> "$env_file"

echo "Pull de imagenes de docker"
docker pull mxsig/mxsig-apache
docker pull mxsig/mxsig-haproxy
docker pull mxsig/mxsig-tomcat
docker pull mxsig/mxsig-mapserver7
docker pull mxsig/mxsig-db

echo "Ejecutar proyecto de MxSIG"
docker-compose up -d --build
