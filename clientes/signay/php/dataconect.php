<?php
// dataconect.php

function getDbConnection() {
    // Parámetros de conexión a la base de datos
    $host = 'mxsig-db';       // Nombre del host (en este caso, el nombre del contenedor)
    $dbname = 'signay';       // Nombre de la base de datos
    $port = '5432';           // Puerto de PostgreSQL
    $user = 'postgres';       // Usuario de la base de datos
    $password = 'P0stgr3s';   // Contraseña del usuario

    // Cadena de conexión (DSN)
    $dsn = "pgsql:host=$host;dbname=$dbname;port=$port";

    try {
        // Crear una nueva instancia de PDO para la conexión
        $conn = new PDO($dsn, $user, $password);

        // Configurar PDO para que lance excepciones en caso de errores
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Devolver la conexión
        return $conn;
    } catch (PDOException $e) {
        // En caso de error, lanzar una excepción con el mensaje de error
        throw new Exception("Error de conexión a la base de datos: " . $e->getMessage());
    }
}
?>