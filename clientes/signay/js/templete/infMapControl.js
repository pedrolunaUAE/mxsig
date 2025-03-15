/**
 * Función para actualizar el contenido de las pestañas con la información proporcionada.
 * @param {Object} properties - Las propiedades con la información a mostrar.
 */
function updateInfMap(properties) {
    const infMap = document.getElementById('infMap');
    if (infMap) {
        infMap.classList.remove('d-none');

        // Declaración de cabecera del pane de información
        const cabecerainfo = `
            <div class="card">
                <div class="card-header bg-dark text-white">
                    <h8 class="card-title"> ${properties.tipo}:${properties.cvegeo} - ${properties.nomgeo}</h8>
                </div>
            </div>
        `;
        $('#cabecera-info').html(cabecerainfo);

        // Llamar a las funciones para mostrar la información en las pestañas correspondientes
        showSocioDemografica(properties);
        showEconomicInfo(properties);
        showIndicatorInfo(properties);
    }
}
