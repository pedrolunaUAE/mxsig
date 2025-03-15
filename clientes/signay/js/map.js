/**
 * Definiciones y Configuraciones Iniciales
 */

let legendControl; // Variable global para almacenar la instancia de la leyenda
let entidadLayer; // Variable global para almacenar la capa de Entidad
let municipioLayer; // Variable global para almacenar la capa de Municipios
let selectedMunicipioLayer; // Variable global para almacenar la capa del municipio seleccionado
//let currentLayer = null;


/**
 * Función para reiniciar la vista y limpiar selecciones.
 */
function resetView() {
    // Reiniciar el zoom y la vista
    map.setView([21.87, -104.85], 8);

    // Limpiar cualquier marcador existente
    if (currentMarker) {
        map.removeLayer(currentMarker);
        currentMarker = null;
    }

    // Limpiar cualquier selección en las capas
    if (selectedMunicipioLayer) {
        municipioLayer.resetStyle(selectedMunicipioLayer);
        selectedMunicipioLayer = null;
    }

    // Utilizar la capa de la entidad ya cargada
    if (entidadLayer) {
        map.addLayer(entidadLayer);
        entidadLayer.eachLayer(function(layer) {
            const properties = layer.feature.properties;
            updateInfMap(properties);
        });
    }
}




// Inicializa el mapa centrado en Nayarit con control de zoom desactivado y con límites de zoom
const map = L.map('map', {
    zoomControl: false, // Desactiva el control de zoom por defecto
    minZoom: 8,         // Nivel mínimo de zoom - permitido
    maxZoom: 16         // Nivel máximo de zoom +  permitido
}).setView([21.87, -104.85], 8); // Coordenadas centrale del estado de Nayarit, Mexico

// Añade una capa de mapa base de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Añade un control de zoom personalizado en la posición superior derecha
L.control.zoom({
    position: 'topright'
}).addTo(map);


/**
 * Funciones para Cargar y Manejar Capas
 */

/**
 * Carga una capa desde una URL y la añade al mapa.
 * @param {object} layer - La capa a añadir.
 * @param {string} url - La URL desde donde cargar los datos de la capa.
 * @param {boolean} addToMap - Si se debe añadir la capa al mapa.
 * @param {boolean} alFrente - Si se debe traer la capa al frente del mapa.
 */

function loadLayer(layer, url, addToMap, alFrente) {
    document.getElementById('loadingIndicator').style.display = 'inline';

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            layer.addData(data);
            layer.eachLayer(function(featureLayer) {
                const properties = featureLayer.feature.properties;
                if (properties.tipo === 'Entidad') {
                    entidadLayer = layer; // Almacenar referencia de la capa de la entidad
                    updateInfMap(properties);
                    console.log(entidadLayer);
                }    
                if (properties.tipo === 'Municipio') municipioLayer = layer;

                featureLayer.on('click', () => {
                    selectMunicipioLayer(featureLayer);
                    updateInfMap(properties);
                });
            });
            if (addToMap) {
                map.addLayer(layer);
                if (alFrente) layer.bringToFront();
            }
            document.getElementById('loadingIndicator').style.display = 'none';
        })
        .catch(error => {
            console.error('Error al cargar la capa:', error);
            alert(`Ocurrió un error al cargar los datos de la capa: ${error.message}`);
            document.getElementById('loadingIndicator').style.display = 'none';
        });

}

/**
 * Recorre el árbol de capas y ejecuta una función de callback en cada nodo hoja que contiene una capa.
 * @param {object} node - Nodo del árbol de capas.
 * @param {function} callback - Función a ejecutar en cada nodo hoja.
 */
function traverseTree(node, callback) {
    if (node.children && Array.isArray(node.children)) {
        node.children.forEach(child => traverseTree(child, callback));
    } else if (node.layer) {
        callback(node);
    }
}

/**
 * Carga las capas en el orden definido por su prioridad.
 * @param {object} layersTree - Árbol de capas.
 */

function cargarCapasEnOrden(layersTree) {
    const layers = [];
    traverseTree(layersTree, node => {
        if (node.layer && node.url) layers.push(node);
    });
    layers.sort((a, b) => a.priority - b.priority);

    let index = 0;
    function loadNextLayer() {
        if (index < layers.length) {
            const layerConfig = layers[index];
            loadLayer(layerConfig.layer, layerConfig.url, layerConfig.addToMap, layerConfig.alFrente);
            index++;
            setTimeout(loadNextLayer, 50); // Cargar la siguiente capa después de un pequeño retraso
        } else {
            document.getElementById('loadingIndicator').style.display = 'none';
        }
    }
    document.getElementById('loadingIndicator').style.display = 'inline';
    loadNextLayer();
}


// Llamar a la función para cargar las capas en el orden deseado
cargarCapasEnOrden(layersTree);

/**
 * Gestiona la prioridad de las capas activas, trayéndolas al frente en el orden correcto.
 * @param {array} layers - Capas activas.
 */
function manageLayerPriority(layers) {
    const sortedLayers = layers.sort((a, b) => a.priority - b.priority);
    sortedLayers.forEach(layerConfig => {
        if (map.hasLayer(layerConfig.layer)) layerConfig.layer.bringToFront();
    });
}

/**
 * Eventos de Mapa y Control de Capas
 */

// Evento que se dispara cuando se agrega una capa al mapa
map.on('layeradd', function() {
    const activeLayers = [];
    traverseTree(layersTree, node => {
        if (map.hasLayer(node.layer)) activeLayers.push(node);
    });
    manageLayerPriority(activeLayers);
    updateLegend(activeLayers); // Actualiza la leyenda con las capas activas
});

// Evento que se dispara cuando se elimina una capa del mapa
map.on('layerremove', function() {
    const activeLayers = [];
    traverseTree(layersTree, node => {
        if (map.hasLayer(node.layer)) activeLayers.push(node);
    });
    manageLayerPriority(activeLayers);
    updateLegend(activeLayers); // Actualiza la leyenda con las capas activas
});

// Inicializar el control de capas en forma de árbol
const layersControl = L.control.layers.tree(null, layersTree, {
    collapsed: true, // Para que inicie colapsado
    namedToggle: true,
    selectorBack: false,
    closedSymbol: '&#8862; &#x1f5c0;', // Símbolo de cerrado
    openedSymbol: '&#8863; &#x1f5c1;', // Símbolo de abierto
    position: 'topleft', // Mueve el control al lado izquierdo superior
    collapseAllExpanded: false, // No expande todas las ramas al inicio
    expandAllCollapsed: true // Colapsa todas las ramas al inicio
}).addTo(map);

// Expandir solo la primera rama al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const firstBranch = document.querySelector('.leaflet-control-layers-list > li:first-child .leaflet-control-layers-toggle');
    if (firstBranch && !firstBranch.classList.contains('leaflet-control-layers-expanded')) {
        firstBranch.click(); // Expande la primera rama
    }
});

/**
 * Funciones de Leyenda y Actualización de Estilos
 */

/**
 * Crear las leyendas del mapa
 */
legendControl = L.control({ position: 'bottomright' });

legendControl.onAdd = function() {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = `
        <div class="legend-item" style="margin-bottom: 5px;">
            <button class="collapse-button" onclick="toggleLegendSection('pobMunLegend')">
                <h6><b>Simbología</b></h6>
            </button>
        </div>
        <div id="pobMunLegend" class="legend-section" style="display: none;"></div>
    `;
    return div;
};
legendControl.addTo(map); // Añade el nuevo control de leyenda al mapa

/**
 * Actualiza la leyenda del mapa en función de las capas activas y los estilos dinámicos.
 * @param {array} activeLayers - Capas activas en el mapa.
 * @param {boolean} addLeyenda - Indica si se debe incluir la configuración de la leyenda de población.
 */
function updateLegend(activeLayers, addLeyenda = false,tipodato) {
    let legendHTML = '';

    if (addLeyenda) {
        const LegendArray = getLegendConfig(tipodato); // Cargamos el arreglo retonado
        legendHTML += `<h6>${LegendArray.title}</h6>`; // Agregar el título de la leyenda

        LegendArray.style.forEach(item => {
            if (item.label) { // Saltar el primer objeto si es sólo el título
                legendHTML += `
                <div class="legend-item" style="margin-bottom: 5px;">
                    <i style="background: ${item.color}; opacity: 0.6; border: 1px solid black;"></i> ${item.label}
                </div>`;
            }
        });
    }
    
    // Definicion de capas activas en el mapa 
    legendHTML += `
        <h6>Límites Geoestadísticos</h6>
    `;
    activeLayers.forEach(layer => {
        const style = getLayerStyles(layer.layer);
        if (style) {
            legendHTML += `
            <div class="legend-item" style="margin-bottom: 5px;">
                <i style="border: 1px solid ${style.color};"></i> 
                ${layer.label || 'Categoría'}
            </div>`;
        }
    });

    document.getElementById('pobMunLegend').innerHTML = legendHTML;
}

/**
 * Obtiene los estilos de una capa.
 * @param {object} layer - La capa de la que se quiere obtener los estilos.
 * @returns {object} - Objeto con las propiedades de estilo.
 */
function getLayerStyles(layer) {
    if (layer && layer.options && layer.options.style) {
        return layer.options.style;
    }
    return null; // Devolvemos null si no se puede obtener el estilo
}

/**
 * Función para colapsar/expandir una sección de la leyenda.
 * @param {string} sectionId - El ID de la sección a colapsar/expandir.
 */
function toggleLegendSection(sectionId) {
    var section = document.getElementById(sectionId);
    section.style.display = section.style.display === "none" ? "block" : "none";
}

/**
 * Actualiza el estilo de la capa de municipios y actualiza la leyenda del mapa.
 */
let agregaLeyenda=false;

function updateLayerStyle(tipoDato) {
    
    if (municipioLayer) {
        if (agregaLeyenda){
            addLeyenda = false;
            municipioLayer.setStyle(getStyleDato()); 
        }else {
            addLeyenda = true;
            tipodato=tipoDato;
            municipioLayer.setStyle(getStyleDato(tipodato)); 
        }    

        const activeLayers = [];
        traverseTree(layersTree, node => {
            if (map.hasLayer(node.layer) && node.addToMap) {
                activeLayers.push(node);
            }
        });

        updateLegend(activeLayers, addLeyenda,tipodato); // Actualizar la leyenda con los estilos actualizados y añadir la configuración de población
    }
}

/**
 * Función para buscar un municipio en la capa de municipios por su clavegeo.
 * @param {string} clavegeo - Clave del municipio a buscar.
 * @returns {L.Layer} - Capa del municipio encontrado.
 */
function findMunicipioLayer(clavegeo) {
    let foundLayer = null;
    municipioLayer.eachLayer(layer => {
        if (layer.feature.properties.cvegeo === clavegeo) {
            foundLayer = layer;
        }
    });
    return foundLayer;
}

/* Función para seleccionar un municipio y cambiar su estilo.
* @param {L.Layer} layer - Capa del municipio a seleccionar.
*/
function selectMunicipioLayer(layer) {
   const properties = layer.feature.properties;
   
   // Si ya hay un municipio seleccionado, restablece su estilo
   if (selectedMunicipioLayer) {
       municipioLayer.resetStyle(selectedMunicipioLayer);
       if (currentMarker) {
           map.removeLayer(currentMarker);
       }
   }

   // Aplica el nuevo estilo al municipio seleccionado
   layer.setStyle({
       fillColor: 'rgb(240, 231, 167)', // Color de relleno
       fillOpacity: 0.3,             // Opacidad del relleno
       color: 'white',               // Color del borde
       weight: 2                     // Grosor del borde
   });

   // Obtener el centro del polígono del municipio seleccionado
   const bounds = layer.getBounds();
   const center = bounds.getCenter();

   // Ajustar el mapa a la extensión del polígono del municipio
   map.fitBounds(bounds);


    // Eliminar el marcador anterior si existe
    if (currentMarker) {
        map.removeLayer(currentMarker);
    }

   // Añadir el texto del nombre en la coordenada correspondiente
   const textIcon = L.divIcon({
       className: 'text-label', // Clase CSS opcional para estilizar
       html: `<div style="
           font-size: 12px; 
           font-weight: bold; 
           color: #D72A47; 
           text-align: center;
           text-shadow: white; 
           ">${properties.nomgeo}</div>`,
       iconSize: null, // Permitir que el div ajuste su tamaño automáticamente según el contenido
       iconAnchor: [50, 20] // Ajustar el anclaje para centrar el ícono
   });

   // Crear y almacenar el nuevo marcador
   currentMarker = L.marker(bounds.getCenter(), { icon: textIcon }).addTo(map);

   // Almacena la capa del municipio seleccionado
   selectedMunicipioLayer = layer;
}

