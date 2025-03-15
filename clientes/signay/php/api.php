<?php
// Establecer el tipo de contenido de la respuesta como JSON
header('Content-Type: application/json');

// Incluir el archivo de conexión a la base de datos
require_once './dataconect.php';

try {
    // Conectar a la base de datos usando la función definida en dataconect.php
    $conn = getDbConnection();

    // Obtener el nombre de la capa y el tipo de consulta desde la URL
    $layer = isset($_GET['layer']) ? $_GET['layer'] : ''; // Nombre de la tabla o capa
    $tipo  = isset($_GET['tipo'])  ? $_GET['tipo'] : '';  // Tipo de consulta: 'map' u otro

    // Validar que el nombre de la capa no esté vacío
    if (empty($layer)) {
        throw new Exception("El parámetro 'layer' es requerido.");
    }

    // Sanitizar el nombre de la capa para evitar inyección SQL
    // Permitir letras, números, guiones bajos y puntos
    $layer = preg_replace('/[^a-zA-Z0-9_.]/', '', $layer);

    // Definir la consulta SQL basada en el valor de $tipo
    if ($tipo === 'map') {
        // Si el tipo es 'map', incluir la geometría en formato GeoJSON
        $query = "SELECT *, ST_AsGeoJSON(ST_Transform(geom, 4326)) AS geojson FROM $layer";
    } else {
        // Si el tipo no es 'map', seleccionar todos los campos sin la geometría
        $query = "SELECT * FROM $layer";
    }

    // Ejecutar la consulta SQL usando PDO
    $stmt = $conn->query($query);

    // Verificar si la consulta fue exitosa
    if (!$stmt) {
        throw new Exception("Error en la consulta: " . implode(" - ", $conn->errorInfo()));
    }

    // Procesar los resultados de la consulta
    $features = []; // Array para almacenar las features (geometrías y propiedades)
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // Validar que el campo 'geojson' no esté vacío o sea nulo
        if (!empty($row['geojson'])) {
            // Decodificar el GeoJSON
            $geojson = json_decode($row['geojson'], true);

            // Verificar que el GeoJSON sea válido
            if (json_last_error() === JSON_ERROR_NONE && isset($geojson['type'])) {
                // Crear un array de propiedades excluyendo 'gid', 'geojson' y 'geom'
                $properties = [];
                foreach ($row as $key => $value) {
                    if ($key !== 'gid' && $key !== 'geojson' && $key !== 'geom') {
                        $properties[$key] = $value;
                    }
                }

                // Agregar la feature al array de features
                $features[] = [
                    'type' => 'Feature', // Tipo de objeto GeoJSON
                    'geometry' => $geojson, // Geometría en formato GeoJSON
                    'properties' => $properties // Propiedades asociadas a la geometría
                ];
            } else {
                throw new Exception("El GeoJSON no es válido para la fila con gid: " . $row['gid']);
            }
        } else {
            throw new Exception("El campo 'geojson' está vacío o es nulo para la fila con gid: " . $row['gid']);
        }
    }

    // Devolver los datos en formato GeoJSON
    echo json_encode([
        'type' => 'FeatureCollection', // Tipo de colección GeoJSON
        'features' => $features // Array de features
    ]);

} catch (Exception $e) {
    // Manejar errores y devolver un mensaje de error en formato JSON
    echo json_encode(['error' => $e->getMessage()]);
} finally {
    // Cerrar la conexión a la base de datos
    if (isset($conn)) {
        $conn = null;
    }
}
?>