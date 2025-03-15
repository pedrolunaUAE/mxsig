/**
 * Formatea un número con separadores de miles.
 * @param {number} number - El número a formatear.
 * @returns {string} - El número formateado con separadores de miles.
 */
function formatNumber(number) {
    if (isNaN(number)) {
        console.error("El valor proporcionado no es un número:", number);
        return "N/A"; // Retornar "N/A" si el valor no es un número
    }
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}