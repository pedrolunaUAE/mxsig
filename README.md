<img src=https://gaia.inegi.org.mx/MxSIG/mxsig.png alt="drawing" width="400"/> <img src=https://gaia.inegi.org.mx/MxSIG/docker2.png alt="drawing" width="100" align="right"/> 

# Tabla de contenidos 
-------------------------

-  [¿Que es MxSIG?](#que-es-mxsig)
-  [Requerimientos](#requerimientos)
-  [Instalación](#instalación)
-  [Consideraciones](#consideraciones)
-  [Modulos de software libre que utiliza](#modulos-de-software-libre-que-utiliza)
-  [Servicios estandarizados que provee](#servicios-estandarizados-que-provee)
-  [Funcionalidades](#funcionalidades)
-  [Ventajas](#ventajas)
-  [Licencias](#licencias)

![](https://gaia.inegi.org.mx/MxSIG/mxsig_solo.png)¿Que es MxSIG?
----------------

Plataforma de código abierto para la web desarrollada para implementar soluciones geomáticas que facilitan el uso, integración, interpretación, publicación y análisis de la información geográfica y estadística.
Está desarrollada utilizando módulos robustos de software de código libre.

Requerimientos 
--------------
Usando como base una tecnología que segrega los procesos (Docker), MxSIG se puede configurar de diferentes formas, y plataformas, de modo que pueden ejecutarse de manera independiente a través de contenedores que ofrecen modelos de implementación basado en Imágenes.

Se requiere instalar, cumplir las siguientes requerimientos será suficiente.

|   **Hardware**       |  **Recomendado**  [^1] |
| :------------- | :---------- |
| Memoria RAM    | 4 GB        |
| Memoria SWAP   | 2 GB        |
| Disco duro     | 30 GB       |
| Procesador     | Quad core   |

[^1]: Estos son requerimientos básicos para la instalación de MxSIG, si en lo particular el usuario requiere más recursos son a su propia consideración.


Instalación 
-----------

MxSIG se puede configurar de diferentes formas y en diferentes plataformas.

1.- La primera opción es ejecutar el script  **mxsig-started.sh** el cual ya tiene las rutas de instalación preestablecidas.

> Nota.- Si se va a utilizar esta forma de instalación es importante mencionar que el script usa una utilería llamada _unzip_ que en la mayoría de distribuciones Linux suele estar preinstalada, en caso contrario basta con instalarlo usando el gestor de paquetes correspondiente a tu distribución. 
Para Windows se puede instalar la versión de línea de comandos de unzip o usar una herramienta gráfica que soporte archivos **ZIP**, como **WinRAR**, **7-Zip**, o **PeaZip**

2.- La segunda opción permite modificar las rutas y establecer el lugar donde se instalaran los paquetes del proyecto mediante el uso de variables de ambiente [.env](#variables-de-ambiente) también personalizar el volumen donde se crearán y con el comando **docker compose up -d --build**

[Descargar docker](https://docs.docker.com/engine/install/)

**Variables de ambiente**
-----------

MxSIG necesita la configuración de variables de ambiente para que este funcione correctamente en un archivo **.env**, y dependiendo de su sistema y ambiente es la configuración de cada una a continuación se hace referencia a cada una y un ejemplo.-

|   **Variable**       |  **Descripcion** |
| :------------- | :---------- |
| DIR_MXSIG_DATA    | Ubicación de cliente de MxSIG para contenedor de apache, cliente ubicado en la url de git [mdm-client](https://git.inegi.org.mx/mxsig/mxsig_client)   |
| DIR_MXSIG_INDICES_SOLR   | Ruta de archivos de configuración para contenedor de tomcat del war de mdmSearchEngine        |
| DIR_MXSIG_DATA_MAP_LOGS  | Ruta donde se guardaran los logs relacionados con el contenedor de mapserver  |
| DIR_MXSIG_DATA_MAPS  |  Ruta de maps para el contenedor de mapserver |

Ejemplo archivo **.env**

_Windows_
```
DIR_MXSIG_DATA=C:\mxsig_data\mxsig-client
DIR_MXSIG_DATA_MAP_LOGS=C:\mxsig_data\logs\maps
DIR_MXSIG_DATA_MAPS=C:\mxsig_data\mxsig-servicios\mapserver\map
DIR_MXSIG_INDICES_SOLR=C:\mxsig_data\mxsig-servicios\tomcat\solr-config
```
_Linux_
```
DIR_MXSIG_DATA=/usr/local/mxsig_data/mxsig-client
DIR_MXSIG_DATA_MAP_LOGS=/usr/local/mxsig_data/logs/maps
DIR_MXSIG_DATA_MAPS=/usr/local/mxsig_data/mxsig-servicios/mapserver/map
DIR_MXSIG_INDICES_SOLR=/usr/local/mxsig_data/mxsig-servicios/tomcat/solr-config
```

Acceder al cliente de MxSIG 
-----------

Una vez que el proceso ha finalizado de manera correcta para poder acceder al cliente de **MxSIG** esto es posible por medio de un navegador web entrando por la ip o dominio del servidor o de manera local

- http://localhost/mdm-client
- http://<server-ip>/mdm-client

**Puertos del MxSIG**

|   **Contenedor**       |  **Puerto** |
| :------------- | :---------- |
| mxsig/mxsig-apache | 81 |
| mxsig/mxsig-haproxy | 80 |
| mxsig/mxsig-tomcat | 8080 |
| mxsig/mxsig-mapserver7 | 8081 |
| mxsig/mxsig-db | 5432 |

> Nota.- De ser necesario cambiar como se exponen los puertos, esta modificacón debe ser el archivo **docker-compose.yml** y en este solo en donde se expone el contenedor por ejemplo.- 
contenedor de tomcat
- ports:
    - "**8084**:80"

Consideraciones 
-----------
**Importante**

Si se vienen de versiones anteriores de MxSIG para poder usar esta nueva versión se debe de tener en consideración lo siguiente.-

- Al querer usar información de versiones anteriores de MxSIG, no será posible un cambio transparente, por las versiones diferentes de volumenes y contenedores de **MxSIG-DB** por lo que si se quiere traer información es necesario realizar un back-up de la base de datos y restaurarla en el nuevo volumen del contenedor

- De igual forma es necesario para el **mdm-client** sustituirlo ya sea en la carpeta clientes o en la correspondiente elegida por el usuario ajustada en el archivo .env

- Al igual que el mdm-cliente, se debe realizar lo propio con los mapas ya sea en la carpeta mapserver o la elegida en el archivo .env

- Subir el archivo **mdmservices.war** con los cambios necesarios ya sea por medio del cliente de tomcat o con la creación de un archivo Dockerfile para construir el nuevo contenedor de tomcat

Modulos de software libre que utiliza
-------------------------------------
Librerías de soporte MxSIG

- PostgreSQL
- PostGIS
- MapServer
- OpenLayers
- jQuery

Lenguaje de desarrollo

- HTML5 (JavaScript y CSS)
- Java

Servicios estandarizados que provee 
-----------------
- Web Map Service (WMS)
- Web Map Tile Service (WMTS)
- Representational State Transfer (REST)

Funcionalidades 
---------------
- Buscador
- Medir área
- Medir distancia
- Digitalizar
- Análisis
- Importar/Exportar kml
- Cruces de información
- Leyenda
- Identificar
- Área de control de escala y desplazamiento
- Acercar
- Alejar
- Mapa completo
- Mapa de referencia
- Acceso y control de las capas de información
- Capas de información
- Acceso a capas activas
- Línea de tiempo
- Mapa base
- Descarga de vista
- Imprimir

Ventajas 
--------
- Software de código abierto
- Obtención de domicilio geográfico
- Facilidad para el desarrollo de visualizadores de información estadística y geográfica
- Accesibilidad
- Experiencia
- Escalabilidad
- Interoperabilidad

Licencias 
---------

MxSIG Derechos Reservados INEGI

MxSIG es un software gratuito, el Usuarios es libre de distribuirlo o / y modificarlo según los términos de “GNU Lesser

General Public License”, licencia publicada por “Free Software Foundation.

MxSIG es distribuido con el interés de fomentar el uso y aprovechamiento de la información geográfica y estadística,

pero SIN GARANTÍA ALGUNA; ni siquiera la garantía implícita de COMERCIALIZACIÓN o IDONEIDAD PARA UN

PROPÓSITO PARTICULAR. Vea la Licencia “GNU Lesser General Public License” para más detalles.