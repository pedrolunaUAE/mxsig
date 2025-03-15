// tablas.js

/**
 * Formatea un número con separadores de miles.
 * @param {number} number - El número a formatear.
 * @returns {string} - El número formateado con separadores de miles.
 */
function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Muestra una tabla de indicadores en un modal.
 * @param {Object} properties - Las propiedades con la información a mostrar.
 */
function showIndicatorsTable(properties) {
    const indicatorsTable = `
        <table id="indicatorsTable" class="table table-striped table-responsive">
            <thead>
                <tr>
                    <th>Indicador</th>
                    <th>Valor</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Población Total</td>
                    <td>${formatNumber(properties.pobtot)}</td>
                </tr>
                <tr>
                    <td>Densidad de Población</td>
                    <td>${formatNumber(properties.den_pob_km2)}</td>
                </tr>
                <tr>
                    <td>Porcentaje de Mujeres</td>
                    <td>${((properties.pobm / properties.pobtot) * 100).toFixed(1)}%</td>
                </tr>
                <tr>
                    <td>Porcentaje de Hombres</td>
                    <td>${((properties.pobh / properties.pobtot) * 100).toFixed(1)}%</td>
                </tr>
                <tr>
                    <td>Escolaridad Promedio</td>
                    <td>${formatNumber(properties.edu_pesco)} años</td>
                </tr>
                <tr>
                    <td>Edad Media</td>
                    <td>${properties.edadmed}</td>
                </tr>
                <!-- Añadir más indicadores según sea necesario -->
            </tbody>
        </table>
    `;

    document.getElementById('indicatorsModalBody').innerHTML = indicatorsTable;

    // Inicializar DataTables
    $('#indicatorsTable').DataTable({
        paging: true,
        searching: true,
        ordering: true,
        responsive: true,
        dom: 'Bfrtip', // Necesario para los botones
        buttons: [
            'csv', 'excel', 'pdf', 'print'
        ]
    });

    $('#indicatorsModal').modal('show');
}
