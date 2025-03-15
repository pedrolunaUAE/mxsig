/**
 * Crea un gráfico de barras horizontales con múltiples variables.
 * @param {Object[]} variables - Un array de objetos que representan cada variable a graficar.
 * Cada objeto debe tener {name: 'Nombre de la variable', data: [valores], color: 'Color de las barras'}.
 * @param {string[]} etiquetasY - Array de etiquetas para el eje Y (e.g. edades).
 * @param {string} elementId - El ID del elemento HTML donde se renderizará el gráfico.
 */
function createHorizontalBarChart(variables, etiquetasY, elementId) {

    // Función para formatear números con separadores de miles y dos decimales
    function formatNumber(num) {
        return parseFloat(num).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Crear trazas para cada variable
    var data = variables.map(variable => {
        return {
            x: variable.data.map(num => parseFloat(num)), // Convertir a número
            y: etiquetasY,
            name: variable.name,
            orientation: 'h', // Orientación horizontal
            type: 'bar', // Tipo de gráfico: barras
            text: variable.data.map(formatNumber), // Formatear números con separadores de miles
            textposition: 'auto',
            hovertemplate: '%{y}: %{text}', // Información al pasar el cursor
            marker: {
                color: variable.color // Color personalizado de las barras
            },
            hoverinfo: 'x+text'
        };
    });

    // Calcular el valor máximo para los ticks dinámicos
    var maxVal = Math.max(...variables.flatMap(v => v.data.map(Math.abs)));
    var tickStep = Math.ceil(maxVal / 4 / 10000) * 10000; // Ajustar paso de ticks
    var tickvals = [];
    for (var i = -maxVal; i <= maxVal; i += tickStep) {
        tickvals.push(i);
    }
    var ticktext = tickvals.map(v => formatNumber(v));

    // Definir el diseño del gráfico
    var layout = {
        title: {
            text: 'Gráfico de barras horizontal con múltiples variables',
            font: {
                family: 'Arial, sans-serif',
                size: 13,
                color: '#000000',
                fontWeight: 'bold'
            }
        },
        barmode: 'overlay', // Modo de las barras: superpuestas
        xaxis: {
            tickvals: tickvals, // Valores de las etiquetas del eje X generados dinámicamente
            ticktext: ticktext, // Textos de las etiquetas del eje X generados dinámicamente
            title: {
                text: 'Valores',
                font: {
                    family: 'Arial, sans-serif',
                    size: 10
                }
            },
            tickfont: {
                family: 'Arial, sans-serif',
                size: 8
            }
        },
        yaxis: {
            title: {
                text: 'Etiquetas (Y)',
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
        bargap: 0.1, // Espacio entre las barras
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