// Declaracion inicia de apagado del panel infMap

const infMap = document.getElementById('infMap');
const mapContainer = document.getElementById('map-container');

infMap.classList.remove('d-none');
mapContainer.classList.add('col-lg-8');
infMap.classList.add('col-lg-4');
infMap.classList.add('show');
map.invalidateSize();


// Función para mostrar el panel de información
function mostrarPanelInfo(properties) {
    const infMap = document.getElementById('infMap');
    const mapContainer = document.getElementById('map-container');
    if (infMap.classList.contains('d-none')) {
        infMap.classList.add('show');
        infMap.classList.remove('d-none');
        mapContainer.classList.remove('col-lg-12');
        mapContainer.classList.add('col-lg-8');
        infMap.classList.add('col-lg-4');
    }  else {
        infMap.classList.add('d-none');
        mapContainer.classList.remove('col-lg-8');
        infMap.classList.remove('col-lg-4');
        mapContainer.classList.add('col-lg-12');
    }
    map.invalidateSize();
}

// Event listener para manejar el clic en el botón en el popup
document.addEventListener('click', function(event) {
    if (event.target && event.target.id === 'btnInfMap' || event.target.closest('#btnInfMap')) {
        event.preventDefault();
        mostrarPanelInfo();
    }
});

$(document).ready(function () {
    $('#myTab a').on('click', function (e) {
        e.preventDefault();
        $(this).tab('show');
    });

    // Función para cambiar de pestaña
    function changeTab(tabId) {
        $('#myTab a[href="' + tabId + '"]').tab('show');
    }

});