@echo off
setlocal enabledelayedexpansion

:: Directorio donde se encuentra este script
set "current_dir=%~dp0"

:: Variables para las carpetas
set "variable1=%current_dir%tomcat"
set "variable2=%current_dir%mapserver"

:: Crear las carpetas dentro del directorio actual
echo Creación de carpetas de tomcat y mapserver
mkdir "%variable1%"
mkdir "%variable2%"
mkdir "%variable2%\logs"
mkdir "%current_dir%clientes"

echo Se han creado las carpetas y descargado los archivos en: %current_dir%

:: Descargar archivos
echo Descarga de recursos para mxsig

:: Descargar archivos para mapserver
echo Archivos para mapserver
if not exist "%variable2%\solr-config" (
    :: Descargar archivo zip con curl
    curl -k -L -o "%variable2%\map.zip" "https://gaia.inegi.org.mx/MxSIG/resources/mxsig/mapserver/map.zip"
    :: Extraer archivo zip usando expand
    powershell -Command "Expand-Archive -Path '%variable2%\map.zip' -DestinationPath '%variable2%'"
    del "%variable2%\map.zip"
) else (
    echo La carpeta de map ya existe
)

:: Descargar archivos para tomcat
echo Archivos para tomcat
if not exist "%variable1%\solr-config" (
    :: Descargar archivo zip con curl
    curl -k -L -o "%variable1%\solr-config.zip" "https://gaia.inegi.org.mx/MxSIG/resources/mxsig/tomcat/solr-config.zip"
    :: Extraer archivo zip usando expand
    powershell -Command "Expand-Archive -Path '%variable1%\solr-config.zip' -DestinationPath '%variable1%'"
    del "%variable1%\solr-config.zip"
) else (
    echo La carpeta de configuración solr-config ya existe
)

:: Descargar mdmservices.war
echo Descargar mdmservices.war
if not exist "%variable1%\mdmservices.war" (
    :: Descargar archivo .war con curl
    curl -k -L -o "%variable1%\mdmservices.war" "https://gaia.inegi.org.mx/MxSIG/resources/mxsig/tomcat/mdmservices.war"
) else (
    echo El archivo de mdmservices.war ya existe
)

:: Archivos shapes
echo Descargar archivos shapes
if not exist "%current_dir%\db\shapes.zip" (
    :: Descargar archivo .war con curl
    curl -k -L -o "%current_dir%\db\shapes.zip" "https://gaia.inegi.org.mx/MxSIG/resources/mxsig/shapes/shapes.zip"
) else (
    echo Los archivos shapes ya existen
)

:: Clonar proyecto de GitLab
echo Clonar proyecto de Gitlab
if not exist "%current_dir%clientes\mdm-client" (
    git clone "https://git.inegi.org.mx/mxsig/mxsig_client.git" "%current_dir%clientes\mdm-client"
) else (
    echo El proyecto de GitLab ya ha sido clonado previamente.
)

:: Crear archivo .env
echo Creación de archivo .env
set "env_file=%current_dir%.env"
(
    echo DIR_MXSIG_INDICES_SOLR=./tomcat/solr-config
    echo DIR_MXSIG_DATA_MAPS=./mapserver/map
    echo DIR_MXSIG_DATA_MAP_LOGS=./mapserver/logs
    echo DIR_MXSIG_DATA=./clientes
) > "%env_file%"

:: Pull de imágenes de Docker
echo Pull de imagenes de docker
docker pull mxsig/mxsig-apache
docker pull mxsig/mxsig-haproxy
docker pull mxsig/mxsig-tomcat
docker pull mxsig/mxsig-mapserver7
docker pull mxsig/mxsig-db

:: Ejecutar proyecto de MxSIG
echo Ejecutar proyecto de MxSIG
docker-compose up -d --build