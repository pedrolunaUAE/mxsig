requirejs.config({
    paths: {
        map:'core/map/map',
        mapStyles:'core/map/styles',
        mapControls:'core/map/controls',
        mapLayers:'core/map/layer',
        mapTree:'core/map/tree',
        timer:'core/map/clock',
        features:'core/map/features',
        wps:'core/map/wps',
        marker:'core/map/marker',
        popup:'core/map/popup',
        georeference:'core/map/georeference',
        events:'core/events',
        request:'core/map/request',
        linetime:'core/map/lineTime',
        modal:'core/map/modal',
        poi:'core/map/poi',
        dataSource:'../config/dataSourceConfig',
        notification:'core/map/notification',
        cluster:'core/map/cluster',
        escuelas:'core/map/escuelas',
        help:'../help/help',
        thirdService:'core/map/thirdService',
        geolocation:'core/map/geolocation',
        routing:'core/map/routing'
    },
    shim: {
        map: {
            deps:['notification','mapStyles','mapControls','mapLayers','mapTree','marker','features','wps','georeference','events','request','linetime','poi','escuelas','modal','thirdService','geolocation','cluster','restFullApi'],
        },
        routing:{
            deps:['features']
        }
    }
});
//agregado
define(["map","ui","request"], function(map,ui,request){
        amplify.subscribe( 'mapAfterLoad', function(){
            
        });
        return {
            init:function(){
                    if(map.testBrowserCompatibility()){
                    //var evento = function(){
                        map.Tree.event.addAditionals();
                        ui.init(map);
                        amplify.publish( 'mapBeforeLoad');
                        map.init();
                    //}
                    //restFullApi('init',request,map,ui);
                    }
            }
        }
});

function cargaImagen(lat,lon){ 
    window.open("https://www.google.com/maps/@"+lat+","+lon+",3a,75y,90t/data=!3m3!1e1!3m1!2e0","Street view" , "width=800,height=600");
}
function capturaObra(lat,lon){ 
    //window.open("https://www.google.com/maps/@"+lat+","+lon+",3a,75y,90t/data=!3m3!1e1!3m1!2e0","Street view" , "width=800,height=600");
    window.open('cm.html','popup','width=800,height=600,top=120,left=100,toolbar=no,location=no,status=no,menubar=no');
   //let modalform = document.getElementById('modal-form');
   //modalform.style.display='block';
   //url = 'cm.html';
    //window.open(url,'Cargando Formulario','Titlebar=no,location=no,resizable=0,width=1024,height=430,top=140,left=240,location=0,menubar=0');
  // url = 'php/forObr.php?st=add&lat='+lat+'&lon='+lon;
   // $('#modal-form').load(url);
   /* let modalform = document.getElementById('modal-form');
   // url = 'obrapublica/prueba.php?st=add&lat='+lat+'&lon='+lon;
    url = 'prueba.php?st=add&lat='+lat+'&lon='+lon;
        window.open(url,'Directorio Nacional de Unidades Económicas','Titlebar=no,location=no,resizable=0,width=1024,height=430,top=140,left=240,location=0,menubar=0');
*/

}