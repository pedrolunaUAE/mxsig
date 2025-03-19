define(function(){
   var mapConfig = {
	    defaultLayers:[], //Al definirse capas por default, inhibe cualquier capa activa por archivo tree o por paso de variable URL
        layers:[
            {
                    type:'Wms',
                    label:'Vectorial',		             
		    url:'/cgi-bin/mapserv?map=/opt/map/mdm60/vector.map&',
            	    alternativeUrl:'/cgi-bin/mapserv?map=/opt/map/mdm60/mdm61vectormxsig.map&',
                    tiled:false,
                    format:'png'
            },
            {
                    type:'Wms',
                    label:'Analisis',
                    url:'/cgi-bin/mapserv?map=/opt/map/mdm60/crucedatos.map&',
                    tiled:false,
                    format:'png',
                    layer:'d5000'
            },
	    {
                    type:'Wms',
                    label:'Text',		             
                    url:'/cgi-bin/mapserv?map=/opt/map/mdm60/texto.map&',
                    tiled:false,
                    format:'png'
            },
            {
                    type:'Wms',
                    label:'Economico',
                    url:'/cgi-bin/mapserv?map=/opt/map/mdm60/tematizacion.map&',
                    tiled:false,
                    layer:'d100,d101',
                    format:'png'
             }	
        ],
        projection:"EPSG:4326",
        initialExtent:{lon:[-108.5333, 20.40],lat:[-101.5333,23.15]},
        restrictedExtent:{lon:[-125, 10.9999 ],lat:[-78,34.5985]},
        resolutions:[4891.969809375,2445.9849046875,1222.99245234375,611.496226171875,305.7481130859375,152.87405654296876,76.43702827148438,38.21851413574219,19.109257067871095,9.554628533935547,4.777314266967774,2.388657133483887,1.1943285667419434,0.5971642833709717,0.29858214168548586],//,0.14929107084274293],0.07464553542137146
        buffers:{
                limit:'1000'
        }
		
    }
    
   return mapConfig
   
});
