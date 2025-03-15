/**
 * Crea un gráfico de barras verticales con múltiples variables.
 * @param {Object[]} variables - Un array de objetos que representan cada variable a graficar.
 * Cada objeto debe tener {name: 'Nombre de la variable', data: [valores], color: 'Color de las barras'}.
 * @param {string[]} etiquetasX - Array de etiquetas para el eje X (e.g. edades, categorías).
 * @param {string} elementId - El ID del elemento HTML donde se renderizará el gráfico.
 * @param {string} titulo - Titulo de la grafíca.
 * @param {string} yaxis - Etiqueta de Y.
 */
function createVerticalBarChart(variables, etiquetasX, elementId, titulo, yaxis) {

    // Función para formatear números con separadores de miles y sin decimales
    function formatNumber(num) {
        return parseFloat(num).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Crear trazas para cada variable
    var data = variables.map(variable => {
        return {
            x: etiquetasX,
            y: variable.data.map(num => parseFloat(num)), // Convertir a número
            name: variable.name,
            type: 'bar', // Tipo de gráfico: barras
            text: variable.data.map(formatNumber), // Formatear números con separadores de miles sin decimales
            textposition: 'auto',
            hovertemplate: '%{x}: %{text}', // Información al pasar el cursor
            marker: {
                color: variable.color // Color personalizado de las barras
            },
            hoverinfo: 'y+text'
        };
    });

    // Calcular el valor máximo para los ticks dinámicos en el eje Y
    var maxVal = Math.max(...variables.flatMap(v => v.data.map(Math.abs)));
    var tickStep = Math.ceil(maxVal / 4 / 10000) * 10000; // Ajustar paso de ticks
    var tickvals = [];
    for (var i = 0; i <= maxVal; i += tickStep) {
        tickvals.push(i);
    }
    var ticktext = tickvals.map(v => formatNumber(v)); // Formatear sin decimales

    // Definir el diseño del gráfico
    var layout = {
        title: {
            text: titulo,
            font: {
                family: 'Arial, sans-serif',
                size: 14,
                color: '#000000',
                fontWeight: 'bold'
            }
        },
        barmode: 'group', // Modo de las barras: agrupadas
        xaxis: {
            title: {
                text: '',
                font: {
                    family: 'Arial, sans-serif',
                    size: 10
                }
            },
            tickfont: {
                family: 'Arial, sans-serif',
                size: 10
            }
        },
        yaxis: {
            tickvals: tickvals, // Valores de las etiquetas del eje Y generados dinámicamente
            ticktext: ticktext, // Textos de las etiquetas del eje Y generados dinámicamente
            title: {
                text: yaxis,
                font: {
                    family: 'Arial, sans-serif',
                    size: 12
                }
            },
            tickfont: {
                family: 'Arial, sans-serif',
                size: 10
            }
        },
        bargap: 0.2, // Espacio entre las barras
        legend: {
            orientation: 'h',
            x: 0.5,
            y: -0.2,
            xanchor: 'center',
            yanchor: 'bottom',
            font: {
                family: 'Arial, sans-serif',
                size: 10
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
