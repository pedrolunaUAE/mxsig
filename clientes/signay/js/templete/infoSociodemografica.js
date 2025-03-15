let selectCard = 'poblacion';

/**
 * Muestra la información básica en el pane.
 * @param {Object} properties - Las propiedades con la información a mostrar.
 */
function showSocioDemografica(properties) {

    const cardinfo = `
        <select id="infoSelectorSociodemografica" class="form-select mb-3">
            <option value="poblacion">Población</option>
            <option value="vivienda">Viviendas</option>
            <option value="educacion">Educación</option>
            <option value="coneval">Coneval</option>
        </select>
        <div class="card">
            <div id="social-cardbody" class="card-body"></div>
        </div>
    `;
    $('#social-info').html(cardinfo);

    document.getElementById('infoSelectorSociodemografica').value = selectCard;

    document.getElementById('infoSelectorSociodemografica').addEventListener('change', (event) => ChangeInfoSocio(event, properties));

    ChangeInfoSocio({ target: { value: selectCard } }, properties);
}

/**
 * Función para manejar el cambio del combo box y mostrar la información sociodemográfica correspondiente.
 * @param {Event} event - El evento de cambio.
 * @param {Object} properties - Las propiedades con la información a mostrar.
 */
function ChangeInfoSocio(event, properties) {
    const selectedValue = event.target.value;
    if (selectedValue === 'poblacion') {
        selectCard = 'poblacion';
        showPoblacion(properties);
    } else if (selectedValue === 'vivienda') {
        selectCard = 'vivienda';
        showViviendas(properties);
    } else if (selectedValue === 'educacion') {
        selectCard = 'educacion';
        showEducacion(properties);
    }else if (selectedValue === 'coneval') {
        selectCard = 'coneval';
        showConeval(properties);
    }
}

/**
 * Muestra el contenido básico.
 * @param {Object} properties - Las propiedades con la información a mostrar.
 */
function showPoblacion(properties) {
    const percentageWomen = (properties.pobm / properties.pobtot * 100).toFixed(1);
    const percentageMen = (properties.pobh / properties.pobtot * 100).toFixed(1);
    const basicInfo = `
        <div class="d-flex justify-content-between align-items-center">
            <button class="btn btn-primary" onclick='showIndicatorsTable(${JSON.stringify(properties)})'>
                <i class="fa fa-table"></i>
            </button>
        </div>
        <table class="table flex-table">
            <!-- Tabla con la información básica -->
            <thead>
                <tr>
                    <th colspan="4" class="text-center">Información sociodemográfica</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colspan="2" class="text-center" style='background-color:#215D7B;'>
                        <div class="flex-container">
                            <img src="img/icon/poblacion.svg" style="width: 30px; height: 30px;" alt="Ícono de población">
                        </div>
                    </td> 
                    <td colspan="2" class="text-center" style='background-color:#81388D;'>
                        <div class="flex-container">
                            <img src="img/icon/densidad.svg" style="width: 30px; height: 30px;" alt="Ícono de población">
                        </div>
                    </td> 
                </tr>
                <tr>
                   <td colspan="2">
                        <div class="flex-column-container">    
                            <span class="data-title">Población Total</span>
                            <span class="data-number" style='color:#215D7B'>${formatNumber(properties.pobtot)}
                                <button class="icon-button" onclick="updateLayerStyle('pobmuntot')">
                                    <i class="fas fa-map-marker-alt" style='font-size:14px;color:black'></i>
                                </button>
                            </span>
                            <span class="data-context">habitantes</span>
                        </div>
                    </td>
                    <td colspan="2">
                        <div class="flex-column-container">
                            <span class="data-title">Densidad de Población</span>
                            <span class="data-number" style='color:#81388D'>${formatNumber(properties.den_pob_km2)}
                                <button class="icon-button" onclick="updateLayerStyle('despobmun')">
                                    <i class="fas fa-map-marker-alt" style='font-size:14px;color:black'></i>
                                </button>
                            </span>
                            <span class="data-context">Habitantes por </span>
                            <span class="data-context">Kilómetro cuadrado</span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" class="text-center" style='background-color:#A78CC2;'>
                        <div class="flex-container">
                            <i class='fa fa-female' style='font-size:20px;color:#fff'></i>
                        </div>
                    </td>
                    <td colspan="2" class="text-center" style='background-color:#3493C2;'>
                        <div class="flex-container">
                            <i class='fas fa-male' style='font-size:20px;color:#fff'></i>
                        </div>
                    </td> 
                </tr>
                <tr>
                   <td colspan="2">
                        <div class="flex-column-container">    
                            <span class="data-title">Mujeres</span>
                            <span class="data-number" style='color:#215D7B'>${percentageWomen}%</span>
                            <span class="data-context">(${formatNumber(properties.pobm)})</span>
                        </div>
                    </td>
                    <td colspan="2">
                        <div class="flex-column-container">    
                            <span class="data-title">Hombres</span>
                            <span class="data-number" style='color:#215D7B'>${percentageMen}%</span>
                            <span class="data-context">(${formatNumber(properties.pobh)})</span>
                        </div>
                    </td>
                </tr>
                <tr>
                   <td class="text-center" style='background-color:#0071CE;'>
                        <div class="flex-container">
                            <span class="data-title" style='color:#fff'>Edad Medina</span>
                        </div>
                    </td> 
                    <td>
                        <div class="flex-column-container">    
                            <span class="data-number" style='color:#0071CE'>${properties.edadmed}
                            <button class="icon-button" onclick="updateLayerStyle('munEdadMed')">
                                    <i class="fas fa-map-marker-alt" style='font-size:14px;color:black'></i>
                            </button>
                            </span>
                        </div>
                    </td>
                    <td class="text-center" style='background-color:#615857;'>
                        <div class="flex-container">
                            <span class="data-title" style='color:#fff'>Jóvenes adultos</span>
                        </div>
                    </td> 
                    <td>
                        <div class="flex-column-container">    
                            <span class="data-number" style='color:#615857'>${properties.ajovenes}%</span>
                        </div>
                    </td>
                </tr>
                <tr>
                   <td class="text-center" style='background-color:#F6A017;'>
                        <div class="flex-container">
                            <span class="data-title" style='color:#fff'>Niños</span>
                        </div>
                    </td> 
                    <td>
                        <div class="flex-column-container">    
                            <span class="data-number" style='color:#F6A017'>${properties.ninos}%</span>
                        </div>
                    </td>
                    <td class="text-center" style='background-color:#009D9C;'>
                        <div class="flex-container">
                            <span class="data-title" style='color:#fff'>Adultos</span>
                        </div>
                    </td> 
                    <td>
                        <div class="flex-column-container">    
                            <span class="data-number" style='color:#215D7B'>${properties.adultos}%</span>
                        </div>
                    </td>
                </tr>
                <tr>
                   <td class="text-center" style='background-color:#897C7A;'>
                        <div class="flex-container">
                            <span class="data-title" style='color:#fff'>Jóvenes</span>
                        </div>
                    </td> 
                    <td>
                        <div class="flex-column-container">    
                            <span class="data-number" style='color:#897C7A'>${properties.jovenes}%</span>
                        </div>
                    </td>
                    <td class="text-center" style='background-color:#F296AE;'>
                        <div class="flex-container">
                            <span class="data-title" style='color:#fff'>Adultos Mayores</span>
                        </div>
                    </td> 
                    <td>
                        <div class="flex-column-container">    
                            <span class="data-number" style='color:#F296AE'>${properties.amayores}%</span>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <div id="chart" style="width: 100%; height: 400px;"></div> <!-- Contenedor para la gráfica -->
    `;
    document.getElementById('social-cardbody').innerHTML = basicInfo;

    // Datos de estructura poblacional
    const hombres = [properties.pobh0_4, properties.pobh5_9, properties.pobh10_14, properties.pobh15_19, properties.pobh20_24, properties.pobh25_29,
                     properties.pobh30_34, properties.pobh35_39, properties.pobh40_44, properties.pobh45_49, properties.pobh50_54, properties.pobh55_59,
                     properties.pobh60_64, properties.pobh65_69, properties.pobh70_74, properties.pobh75_79, properties.pobh80_84, properties.pobh85ym];

    const mujeres = [properties.pobm0_4, properties.pobm5_9, properties.pobm10_14, properties.pobm15_19, properties.pobm20_24, properties.pobm25_29,
                     properties.pobm30_34, properties.pobm35_39, properties.pobm40_44, properties.pobm45_49, properties.pobm50_54, properties.pobm55_59,
                     properties.pobm60_64, properties.pobm65_69, properties.pobm70_74, properties.pobm75_79, properties.pobm80_84, properties.pobm85ym];

    // Validar y corregir los datos
    const validateData = (data) => data.map(value => value === undefined || value === null ? 0 : value);

    const hombresValidados = validateData(hombres);
    const mujeresValidados = validateData(mujeres);

    // Llamar a la función para crear la gráfica de estructura poblacional
    createEstrucChart(hombresValidados, mujeresValidados, 'chart');
}

function showViviendas(properties) {
    const basicInfo = `
        <table class="table flex-table">
            <!-- Tabla con la información básica -->
            <thead>
                <tr>
                    <th colspan="5" class="text-left">Información de viviendas</th>
                    <td><span class="data-context">viviendas</span></td>
                </tr>
            </thead>
            <tbody>
                <!-- Contenido de la tabla aquí -->
                <tr>
                    <td colspan="2" class="text-center" style='background-color:#215D7B;'>
                        <div class="flex-container">
                            <img src="img/icon/viviendas.svg" style="width: 30px; height: 30px;" alt="Ícono de vivienda">
                        </div>
                    </td> 
                    <td colspan="2" class="text-center" style='background-color:#81388D;'>
                        <div class="flex-container">
                            <img src="img/icon/habitada.png" style="width: 30px; height: 30px;" alt="Ícono de población">
                        </div>
                    </td>
                    <td colspan="2" class="text-center" style='background-color:#009D9C;'>
                        <div class="flex-container">
                            <img src="img/icon/deshabitada.png" style="width: 30px; height: 30px;" alt="Ícono de población">
                        </div>
                    </td>
                </tr>
                <tr>
                   <td colspan="2">
                        <div class="flex-column-container">    
                            <span class="data-title">Totales</span>
                            <span class="data-number" style='color:#215D7B'>${formatNumber(properties.viv_tot)}
                                <button class="icon-button" onclick="updateLayerStyle('vivtotales')">
                                    <i class="fas fa-map-marker-alt" style='font-size:14px;color:black'></i>
                                </button>
                            </span>
                        </div>
                    </td>
                    <td colspan="2">
                        <div class="flex-column-container">
                            <span class="data-title">Particulares habitadas</span>
                            <span class="data-number" style='color:#215D7B'>${formatNumber(properties.viv_2)}
                            </span>
                        </div>
                    </td>
                    <td colspan="2">
                        <div class="flex-column-container">
                            <span class="data-title">Particulares deshabitadas</span>
                            <span class="data-number" style='color:#81393D'>${formatNumber(properties.viv_4)}
                            </span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th colspan="6" class="data-context">Fuente: Censo de Población y Vivienda 2020</th>
                </tr>
                <thead>
                <tr>
                    <th colspan="5" class="text-left">Viviendas con servicios</th>
                    <td><span class="data-context">viviendas</span></td>
                </tr>
                </thead>
                <tr>
                    <td colspan="2" class="text-center" style='background-color:#215D7B;'>
                        <div class="flex-container">
                            <img src="img/icon/enchufe.png" style="width: 30px; height: 30px;" alt="Ícono de vivienda">
                        </div>
                    </td> 
                    <td colspan="2" class="text-center" style='background-color:#81388D;'>
                        <div class="flex-container">
                            <img src="img/icon/inodoro.png" style="width: 30px; height: 30px;" alt="Ícono de población">
                        </div>
                    </td>
                    <td colspan="2" class="text-center" style='background-color:#009D9C;'>
                        <div class="flex-container">
                            <img src="img/icon/drenaje.png" style="width: 30px; height: 30px;" alt="Ícono de población">
                        </div>
                    </td>
                </tr>
                <tr>
                   <td colspan="2">
                        <div class="flex-column-container">    
                            <span class="data-title">Energía</span>
                            <span class="data-number" style='color:#215D7B'>${formatNumber(properties.viv_15)}
                            </span>
                            </div>
                    </td>
                    <td colspan="2">
                        <div class="flex-column-container">
                            <span class="data-title">Sanitario</span>
                            <span class="data-number" style='color:#81388D'>${formatNumber(properties.viv_20)}
                            </span>
                        </div>
                    </td>
                    <td colspan="2">
                        <div class="flex-column-container">
                            <span class="data-title">Drenage</span>
                            <span class="data-number" style='color:#81393D'>${formatNumber(properties.viv_23)}
                            </span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th colspan="6" class="data-context">Fuente: Censo de Población y Vivienda 2020</th>
                </tr>
                <thead>
                <tr>
                    <th colspan="5" class="text-left">Disposición de bienes y Tic's</th>
                    <td><span class="data-context">viviendas</span></td>
                </tr>
            </thead>
                <tr>
                    <td colspan="1" class="text-center" style='background-color:#215D7B;'>
                        <div class="flex-container">
                            <img src="img/icon/refrigerador.png" style="width: 30px; height: 30px;" alt="Ícono de población">
                        </div>
                    </td>
                   <td class="text-center" style='background-color:#0071CE;'>
                        <div class="flex-container">
                            <span class="data-title" style='color:#fff'>Refrigerador</span>
                        </div>
                    </td>
                    <td>
                        <div class="flex-column-container">    
                            <span class="data-num" style='color:#000000'>${formatNumber(properties.viv_27)}
                            </span>
                        </div>
                    </td>
                    <td colspan="1" class="text-center" style='background-color:#215D7B;'>
                        <div class="flex-container">
                            <img src="img/icon/computadora.png" style="width: 30px; height: 30px;" alt="Ícono de población">
                        </div>
                    </td>
                    <td class="text-center" style='background-color:#0071CE;'>
                        <div class="flex-container">
                            <span class="data-title" style='color:#fff'>Computadora</span>
                        </div>
                    </td>
                    <td>
                        <div class="flex-column-container">    
                            <span class="data-num" style='color:#000000'>${formatNumber(properties.viv_34)}
                            </span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="1" class="text-center" style='background-color:#215D7B;'>
                        <div class="flex-container">
                            <img src="img/icon/lavadora.png" style="width: 30px; height: 30px;" alt="Ícono de población">
                        </div>
                    </td>
                    <td class="text-center" style='background-color:#0071CE;'>
                        <div class="flex-container">
                            <span class="data-title" style='color:#fff'>Lavadora</span>
                        </div>
                    </td>
                    <td>
                        <div class="flex-column-container">    
                            <span class="data-num" style='color:#000000'>${formatNumber(properties.viv_28)}
                            </span>
                        </div>
                    </td>
                    <td colspan="1" class="text-center" style='background-color:#215D7B;'>
                        <div class="flex-container">
                            <img src="img/icon/llamar.png" style="width: 30px; height: 30px;" alt="Ícono de población">
                        </div>
                    </td>
                    <td class="text-center" style='background-color:#0071CE;'>
                        <div class="flex-container">
                            <span class="data-title" style='color:#fff'>Linea Telefónica</span>
                        </div>
                    </td>
                    <td>
                        <div class="flex-column-container">    
                            <span class="data-num" style='color:#000000'>${formatNumber(properties.viv_35)}
                            </span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="1" class="text-center" style='background-color:#215D7B;'>
                        <div class="flex-container">
                            <img src="img/icon/radio.png" style="width: 30px; height: 30px;" alt="Ícono de población">
                        </div>
                    </td>
                    <td class="text-center" style='background-color:#0071CE;'>
                        <div class="flex-container">
                            <span class="data-title" style='color:#fff'>Radio</span>
                        </div>
                    </td>
                    <td>
                        <div class="flex-column-container">    
                            <span class="data-num" style='color:#000000'>${formatNumber(properties.viv_32)}
                            </span>
                        </div>
                    </td>
                    <td colspan="1" class="text-center" style='background-color:#215D7B;'>
                        <div class="flex-container">
                            <img src="img/icon/televisores.png" style="width: 30px; height: 30px;" alt="Ícono de población">
                        </div>
                    </td>
                    <td class="text-center" style='background-color:#0071CE;'>
                        <div class="flex-container">
                            <span class="data-title" style='color:#fff'>Televisor</span>
                        </div>
                    </td>
                    <td>
                        <div class="flex-column-container">    
                            <span class="data-num" style='color:#000000'>${formatNumber(properties.viv_33)}
                            </span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="1" class="text-center" style='background-color:#215D7B;'>
                        <div class="flex-container">
                            <img src="img/icon/telefono-movil.png" style="width: 30px; height: 30px;" alt="Ícono de población">
                        </div>
                    </td>
                    <td class="text-center" style='background-color:#0071CE;'>
                        <div class="flex-container">
                            <span class="data-title" style='color:#fff'>Celular</span>
                        </div>
                    </td>
                    <td>
                        <div class="flex-column-container">    
                            <span class="data-num" style='color:#000000'>${formatNumber(properties.viv_36)}
                            </span>
                        </div>
                    </td>
                    <td colspan="1" class="text-center" style='background-color:#215D7B;'>
                        <div class="flex-container">
                            <img src="img/icon/wifi.png" style="width: 30px; height: 30px;" alt="Ícono de población">
                        </div>
                    </td>
                    <td class="text-center" style='background-color:#0071CE;'>
                        <div class="flex-container">
                            <span class="data-title" style='color:#fff'>Internet</span>
                        </div>
                    </td>
                    <td>
                        <div class="flex-column-container">    
                            <span class="data-num" style='color:#000000'>${formatNumber(properties.viv_37)}
                            </span>
                        </div>
                    </td>
                </tr>
                                <tr>
                    <td colspan="1" class="text-center" style='background-color:#215D7B;'>
                        <div class="flex-container">
                            <img src="img/icon/microondas.png" style="width: 30px; height: 30px;" alt="Ícono de población">
                        </div>
                    </td>
                    <td class="text-center" style='background-color:#0071CE;'>
                        <div class="flex-container">
                            <span class="data-title" style='color:#fff'>Microondas</span>
                        </div>
                    </td>
                    <td>
                        <div class="flex-column-container">    
                            <span class="data-num" style='color:#000000'>${formatNumber(properties.viv_79)}
                            </span>
                        </div>
                    </td>
                    <td colspan="1" class="text-center" style='background-color:#215D7B;'>
                        <div class="flex-container">
                            <img src="img/icon/transmision.png" style="width: 30px; height: 30px;" alt="Ícono de población">
                        </div>
                    </td>
                    <td class="text-center" style='background-color:#0071CE;'>
                        <div class="flex-container">
                            <span class="data-title" style='color:#fff'>Tv de paga</span>
                        </div>
                    </td>
                    <td>
                        <div class="flex-column-container">    
                            <span class="data-num" style='color:#000000'>${formatNumber(properties.viv_82)}
                            </span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th colspan="6" class="data-context">Fuente: Censo de Población y Vivienda 2020</th>
                </tr>
                <thead>
                <tr>
                    <th colspan="5" class="text-left">Características de la vivienda</th>
                    <td><span class="data-context">viviendas</span></td>
                </tr>
                </thead>
            </tbody>
        </table>
        <div id="chart" style="width: 100%; height: 400px;"></div> <!-- Contenedor para la gráfica -->
    `;
    document.getElementById('social-cardbody').innerHTML = basicInfo;

    // Ejemplo de uso 
const serie1 = [properties.viv_tot, properties.viv_2, properties.viv_4];
const etiquetas = ["Totales","Particulares Habitadas","Particulares deshabitadas"];

createVerticalBarChart([
    { name: 'Viviendas', data: serie1, color: '#3493C2' },
    { name: 'Viviendas', data: serie1, color: '#343372' },
    { name: 'Viviendas', data: serie1, color: '#943872' },
], etiquetas, 'chart', 'Viviendas y Condición de Avitación','Viviendas');
    
}

function showEducacion(properties) {
    const basicInfo = `
        <table class="table flex-table">
            <!-- Tabla con la información básica -->
            <thead>
                <tr>
                    <th colspan="4" class="text-center">Información Educación</th>
                </tr>
            </thead>
            <tbody>
                <!-- Contenido de la tabla aquí -->
            </tbody>
        </table>
        <div id="chart" style="width: 100%; height: 400px;"></div> <!-- Contenedor para la gráfica -->
    `;
    
    // Asignar el contenido a cada tab-pane
    document.getElementById('social-cardbody').innerHTML = basicInfo;
}

function showConeval(properties) {
    const basicInfo = `
        <table class="table flex-table">
            <!-- Tabla con la información básica -->
            <thead>
                <tr>
                    <th colspan="4" class="text-center">Información de Coneval</th>
                </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="2" class="text-center" style='background-color:#215D7B;'>
                    <div class="flex-container">
                        <img src="img/icon/viviendas.svg" style="width: 30px; height: 30px;" alt="Ícono de vivienda">
                    </div>
                </td> 
            </tr>
            <tr>
                <td colspan="2">
                    <div class="flex-column-container">    
                        <span class="data-title">Totales</span>
                        <span class="data-number" style='color:#215D7B'>${formatNumber(properties.porc_pob_urb_20)}
                            <button class="icon-button" onclick="updateLayerStyle('vivtotales')">
                                <i class="fas fa-map-marker-alt" style='font-size:14px;color:black'></i>
                            </button>
                        </span>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
        <div id="chart" style="width: 100%; height: 400px;"></div> <!-- Contenedor para la gráfica -->
    `;
    
    // Asignar el contenido a cada tab-pane
    document.getElementById('social-cardbody').innerHTML = basicInfo;
}
