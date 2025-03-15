/**
 * Función para realizar la búsqueda de un término y mostrar los resultados.
 * Obtiene el término de búsqueda del campo de entrada, filtra los datos JSON y
 * llama a la función mostrarResultados para mostrar los resultados en la interfaz.
 * 
 * @returns {boolean} - Retorna false para prevenir el envío del formulario.
 */
function buscar() {
    // Obtener el término de búsqueda del campo de entrada y convertirlo a minúsculas
    const termino = document.getElementById('buscarTermino').value.toLowerCase();
    
    // Realizar una solicitud fetch para obtener el archivo JSON de datos
    fetch('datos/busqueda.json')
        .then(response => response.json()) // Convertir la respuesta a formato JSON
        .then(data => {
            // Filtrar los datos para encontrar coincidencias con el término de búsqueda
            const resultados = data.filter(item => item.nomgeo.toLowerCase().includes(termino));
            // Llamar a la función mostrarResultados para mostrar los resultados en la interfaz
            mostrarResultados(resultados);
        });
    
    // Prevenir el envío del formulario
    return false;
}

// Variable global para almacenar el marcador actual
let currentMarker = null;

/**
 * Función para mostrar los resultados de la búsqueda en una lista y centrar el mapa en el resultado seleccionado.
 * 
 * @param {Array} resultados - Lista de resultados de la búsqueda.
 */
function mostrarResultados(resultados) {
    // Obtener el elemento div donde se mostrarán los resultados
    const resultadosDiv = document.getElementById('resultados');
    // Limpiar el contenido previo del elemento div
    resultadosDiv.innerHTML = '';

    // Verificar si hay resultados para mostrar
    if (resultados.length > 0) {
        // Crear un elemento de lista no ordenada para contener los resultados
        const lista = document.createElement('ul');
        lista.className = 'list-group';

        // Iterar sobre cada resultado y crear un elemento de lista
        resultados.forEach(item => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.textContent = `${item.nomgeo}`;
            listItem.style.cursor = 'pointer';

            // Función a ejecutar al hacer clic en un resultado de la lista
            listItem.onclick = () => {
                // Ocultar el modal de resultados
                $('#resultadosModal').modal('hide');

                // Verificar que las coordenadas y el nivel de zoom son válidos antes de usar map.setView
                if (item.coordinates && item.coordinates.length === 2 && item.zoom) {
                    // Convertir coordenadas a números (por si acaso están en formato de cadena)
                    const lat = parseFloat(item.coordinates[1]);
                    const lon = parseFloat(item.coordinates[0]);
                    const zoom = parseInt(item.zoom, 10);

                    // Verificar que las coordenadas y el zoom son válidos
                    if (!isNaN(lat) && !isNaN(lon) && !isNaN(zoom)) {
                        // Centrar el mapa en las coordenadas especificadas y establecer el nivel de zoom
                        map.setView([lat, lon], zoom);

                        // Eliminar el marcador anterior si existe
                        if (currentMarker) {
                            map.removeLayer(currentMarker);
                        }

                        // Crear un ícono de texto para el marcador
                        const textIcon = L.divIcon({
                            className: 'text-label', // Clase CSS opcional para estilizar
                            html: `<div style="
                                font-size: 12px; 
                                font-weight: bold; 
                                color: white; 
                                text-align: center;
                                text-shadow: 2px 2px 2px rgba(0,0,0,1); 
                                ">${item.nomgeo}</div>`,
                            iconSize: null, // Permitir que el div ajuste su tamaño automáticamente según el contenido
                            iconAnchor: [50, 20] // Ajustar el anclaje para centrar el ícono
                        });

                        // Crear y almacenar el nuevo marcador en el mapa
                        currentMarker = L.marker([lat, lon], { icon: textIcon }).addTo(map);

                        // Buscar y actualizar la capa del municipio seleccionado
                        const municipioLayer = findMunicipioLayer(item.clavegeo);
                        if (municipioLayer) {
                            selectMunicipioLayer(municipioLayer);
                            updateInfMap(municipioLayer.feature.properties);
                        }
                    } else {
                        // Mostrar un error si las coordenadas o el nivel de zoom no son válidos
                        console.error('Coordenadas o nivel de zoom no válidos:', lat, lon, zoom);
                    }
                } else {
                    // Mostrar un error si faltan datos de coordenadas o nivel de zoom
                    console.error('Datos de coordenadas o nivel de zoom faltantes o incorrectos:', item.coordinates, item.zoom);
                }
            };

            // Añadir el elemento de lista a la lista
            lista.appendChild(listItem);
        });

        // Añadir la lista de resultados al div de resultados
        resultadosDiv.appendChild(lista);
    } else {
        // Mostrar un mensaje si no se encontraron resultados
        resultadosDiv.textContent = 'No se encontraron resultados';
    }

    // Mostrar el modal con los resultados
    $('#resultadosModal').modal('show');
}
