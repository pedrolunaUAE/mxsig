/**
 * Muestra la información económica en el panel.
 * @param {Object} properties - Las propiedades con la información a mostrar.
 */
function showEconomicInfo(properties) {
    const cardinfo = `
        <div class="card">
            <div id="economic-cardbody" class="card-body">
                <h6 class="card-title">${properties.tipo}: ${properties.cvegeo} - ${properties.nomgeo}</h6>
            </div>
        </div> 
    `;
    // Añade el contenido de la tarjeta al contenedor
    $('#econom-info').html(cardinfo);

    // Llama a la función para obtener los datos económicos
    fetchEconomicData(properties);
}

/**
 * Realiza una consulta a la API para obtener la información económica y muestra los datos.
 * @param {Object} properties - Las propiedades con la información a mostrar.
 */
function fetchEconomicData(properties) {
    // Definir el valor de layer antes de usarlo
    const layer = `sigee.denue_18 where cve_ent='18'`;

    // Crear la URL para la consulta API
    const apiUrl = `php/api.php?layer=${layer}`;

    // Llamada a la API para obtener la información
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta de la API');
            }
            return response.json();
        })
        .then(data => {
            displayEconomicInfo(data);
        })
        .catch(error => {
            console.error('Error al consultar la API:', error);
        });
}

/**
 * Muestra la información económica obtenida en el panel.
 * @param {Object} data - Los datos económicos devueltos por la API.
 */
function displayEconomicInfo(data) {
    // Genera el contenido con la información económica
    const economicInfoContent = `
        <p>Información económica obtenida: ${JSON.stringify(data)}</p>
    `;

    // Muestra el contenido en el panel
    document.getElementById('economic-cardbody').innerHTML += economicInfoContent;
}
