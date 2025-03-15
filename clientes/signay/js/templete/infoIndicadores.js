/**
 * Muestra la información de indicadores en el pane.
 * @param {Object} properties - Las propiedades con la información a mostrar.
 */
function showIndicatorInfo(properties) {
    const cardinfo = `
        <select id="infoSelectorIndicadores" class="form-select mb-3">
            <option value="basic">Información Básica</option>
            <option value="gnero">Información por Género</option>
            <option value="estpob">Estructura poblacional</option>
        </select>
        <div class="card">
            <div id="indica-cardbody" class="card-body"></div>
        </div>
    `;
    $('#indica-info').html(cardinfo);

    document.getElementById('infoSelectorIndicadores').addEventListener('change', (event) => handleIndicatorChange(event, properties));

    // Mostrar la información de indicadores por defecto
    handleIndicatorChange({ target: { value: 'basic' } }, properties);
}

/**
 * Función para manejar el cambio del combo box y mostrar la información de indicadores correspondiente.
 * @param {Event} event - El evento de cambio.
 * @param {Object} properties - Las propiedades con la información a mostrar.
 */
function handleIndicatorChange(event, properties) {
    const selectedValue = event.target.value;
    if (selectedValue === 'basic') {
        showIndicatorContent(properties);
    }
}

/**
 * Muestra el contenido básico de indicadores.
 * @param {Object} properties - Las propiedades con la información a mostrar.
 */
function showIndicatorContent(properties) {
    const indicaInfo = `
        <h4>Información Sociodemográfica</h4>
        <p><strong>Hombres:</strong> ${formatNumber(properties.pobh)}</p>
        <p><strong>Mujeres:</strong> ${formatNumber(properties.pobm)}</p>
    `;
    document.getElementById('indica-cardbody').innerHTML = indicaInfo;
}
