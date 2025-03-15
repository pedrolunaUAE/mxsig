/**
 * Crea un gráfico de barras horizontales que muestra la estructura por edad y sexo.
 * @param {number[]} hombres - Array de números que representa la cantidad de hombres en cada grupo de edad.
 * @param {number[]} mujeres - Array de números que representa la cantidad de mujeres en cada grupo de edad.
 * @param {string} elementId - El ID del elemento HTML donde se renderizará el gráfico.
 */
function createEstrucChart(hombres, mujeres, elementId) {

    // Definir los grupos de edad
    var edades = ["0-4", "5-9", "10-14", "15-19", "20-24", "25-29", "30-34", "35-39", "40-44", "45-49", "50-54", "55-59", "60-64", "65-69", "70-74", "75-79", "80-84", "85+"];

    // Invertir los valores de los hombres para mostrarlos a la izquierda del gráfico
    var hombres_neg = hombres.map(x => -x);

    // Calcular el valor máximo absoluto
    var maxVal = Math.max(Math.abs(Math.max(...hombres)), Math.max(...mujeres));

    // Generar los valores de tickvals y ticktext dinámicamente
    var tickStep = Math.ceil(maxVal / 4 / 10000) * 10000; // Redondear el paso a los 10000 más cercanos
    var tickvals = [];
    for (var i = -maxVal; i <= maxVal; i += tickStep) {
        tickvals.push(i);
    }
    var ticktext = tickvals.map(v => formatNumber(v));


    // Función para formatear números con separadores de miles
    function formatNumber(num) {
        return Math.abs(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }


    // Definir la traza para los hombres
    var trace1 = {
        x: hombres_neg,
        y: edades,
        name: 'Hombres',
        orientation: 'h', // Orientación horizontal
        type: 'bar', // Tipo de gráfico: barras
        //text: hombres.map(String), // Convertir los valores en texto
        //textposition: 'outside', // Posición del texto: fuera de las barras
        hovertemplate: 'Edad: %{y}<br>Hombres: %{customdata}', // Información al pasar el cursor
        customdata: hombres.map(formatNumber), // Datos personalizados para mostrar valores formateados
        marker: {
            color: '#3493C2' // Color de las barras para hombres
        },
    };

    // Definir la traza para las mujeres
    var trace2 = {
        x: mujeres,
        y: edades,
        name: 'Mujeres',
        orientation: 'h', // Orientación horizontal
        type: 'bar', // Tipo de gráfico: barras
        //text: mujeres.map(String), // Convertir los valores en texto
        //textposition: 'outside', // Posición del texto: fuera de las barras
        hovertemplate: 'Edad: %{y}<br>Mujeres: %{customdata}', // Información al pasar el cursor
        customdata: mujeres.map(formatNumber), // Datos personalizados para mostrar valores formateados
        hoverlabel: { // Estilos del marco del hover
            //bgcolor: 'rgba(167,140,190,0)', // Fondo transparente
            bordercolor: 'white', // Color del borde blanco
            font: {
                color: 'white' // Color del texto blanco
            }
        },
        marker: {
            color: '#A78CC2' // Color de las barras para mujeres
        }
    };

    // Combinar las trazas en un solo array de datos
    var data = [trace1, trace2];

    // Definir el diseño del gráfico
    var layout = {
        title: {
            text: 'Estructura por edad y sexo', // Título del gráfico
            font: {
                family: 'Arial, sans-serif', // Fuente del título
                size: 13, // Tamaño de la fuente del título
                color: '#000000', // Color de la fuente del título
                fontWeight: 'bold' // Negrita para el título
            }
        },
        barmode: 'overlay', // Modo de las barras: superpuestas
        xaxis: {
            tickvals: tickvals, // Valores de las etiquetas del eje X generados dinámicamente
            ticktext: ticktext, // Textos de las etiquetas del eje X generados dinámicamente
            title: {
                font: {
                    family: 'Arial, sans-serif', // Fuente del título del eje X
                    size: 10 // Tamaño de la fuente del título del eje X
                }
            },
            tickfont: {
                family: 'Arial, sans-serif', // Fuente de las etiquetas del eje X
                size: 8 // Tamaño de la fuente de las etiquetas del eje X
            }
        },
        yaxis: {
            title: {
                text: 'Edad', // Título del eje Y
                font: {
                    family: 'Arial, sans-serif', // Fuente del título del eje Y
                    size: 12 // Tamaño de la fuente del título del eje Y
                }
            },
            tickfont: {
                family: 'Arial, sans-serif', // Fuente de las etiquetas del eje Y
                size: 10 // Tamaño de la fuente de las etiquetas del eje Y
            }
        },
        bargap: 0.1, // Espacio entre las barras
        legend: {
            orientation: 'h', // Orientación de la leyenda: horizontal
            x: 0.5, // Posición horizontal: centrado
            y: -0.2, // Posición vertical: debajo del área del gráfico
            xanchor: 'center', // Alineación horizontal
            yanchor: 'bottom', // Alineación vertical
            font: {
                family: 'Arial, sans-serif', // Fuente de la leyenda
                size: 10 // Tamaño de la fuente de la leyenda
            }
        }
    };

    // Configuración adicional del gráfico
    var config = {
        displayModeBar: false // Deshabilitar la barra de modos predeterminada
    };

    // Crear el gráfico con Plotly
    Plotly.newPlot(elementId, data, layout, config);
}
