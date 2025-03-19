define(function() {
    var data = {
        themes:{
			T1:{
				label:'INEGI',
                		layers:[''],
                		desc:'Centros de informaci&oacute;n INEGI',
                		img:'mexico.jpg'
                    }
        	},
            baseLayers: {
                B1: {
                    type: 'Wms',
                    label: 'Topogr&aacute;fico sin sombreado- INEGI',
                    img: 'mapa_sin_sombreado.jpg',
                    url: ['http://gaiamapas1.inegi.org.mx/mdmCache/service/wms?', 'http://gaiamapas3.inegi.org.mx/mdmCache/service/wms?', 'http://gaiamapas2.inegi.org.mx/mdmCache/service/wms?'],
                    layer: 'MapaBaseTopograficov61_sinsombreado',
                    rights: 'Derechos Reservados &copy; INEGI',
                    tiled: true,
                    legendlayer: ['c100','c101'],
                    desc: 'REPRESENTACION DE RECURSOS NATURALES Y CULTURALES DEL TERRITORIO NACIONAL A ESCALA 1: 250 000, BASADO EN IMAGENES DE SATELITE DEL  2002 Y TRABAJO DE CAMPO REALIZADO EN 2003',
                    clasification: 'VECTORIAL'
                },
                B2: {
                    type: 'Wms',
                    label: 'Topográfico con sombreado- INEGI',
                    img: 'mapa_con_sombreado.jpg',
                    url: ['http://gaiamapas1.inegi.org.mx/mdmCache/service/wms?', 'http://gaiamapas3.inegi.org.mx/mdmCache/service/wms?', 'http://gaiamapas2.inegi.org.mx/mdmCache/service/wms?'],
                    layer: 'MapaBaseTopograficov61_consombreado',
                    rights: 'Derechos Reservados &copy; INEGI',
                    tiled: true,
                    legendlayer: [],
                    desc: 'REPRESENTACION DE RECURSOS NATURALES Y CULTURALES DEL TERRITORIO NACIONAL A ESCALA 1: 250 000, BASADO EN IMAGENES DE SATELITE DEL  2002 Y TRABAJO DE CAMPO REALIZADO EN 2003',
                    clasification: 'VECTORIAL'
                },
                B3: {
                    type: 'Wms',
                    label: 'Hipsogr&aacute;fico - INEGI',
                    img: 'baseHipsografico.jpg',
                    url: ['http://gaiamapas1.inegi.org.mx/mdmCache/service/wms?', 'http://gaiamapas3.inegi.org.mx/mdmCache/service/wms?', 'http://gaiamapas2.inegi.org.mx/mdmCache/service/wms?'],
                    layer: 'MapaBaseHipsografico',
                    rights: '&copy; INEGI 2013',
                    tiled: true,
                    legendlayer: ['img_altimetria.png'],
                    desc: 'IMAGEN DE RELIEVE QUE MUESTRA UNA COMBINACION DE ELEVACION A TRAVES DE COLORES HIPSOGRAFICOS, GENERADA POR PROCESAMIENTO DEL CONTINUO DE ELEVACIONES MEXICANOS DE 3.0 DE 15 METROS.',
                    clasification: 'VECTORIAL'
                },
                B4: {
                    type: 'Bing',
                    label: 'Bing maps',
                    img: 'Bing.jpg',
                    key: 'At-Y-dJe-yHOoSMPmSuTJD5rRE_oltqeTmSYpMrLLYv-ni4moE-Fe1y8OWiNwZVT',
                    layer: 'Aerial',
                    rights: '&copy; Bing Maps',
                    clasification: 'VECTORIAL'
                },
                B5: {
                    type: 'Osm',
                    label: 'Open Street Map',
                    img: 'Osm.jpg',
                    rights: '&copy; OpenStreetMap contributors',
                    clasification: 'VECTORIAL'
                },
                B6: {
                    type: 'Esri',
                    label: 'Esri Map Raster',
                    img: 'Google.jpg',
                    url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}',
                    rights: '&copy; ESRI',
                    clasification: 'VECTORIAL'
                },
                B7: {
                    type: 'Esri',
                    label: 'Esri Map Vectorial',
                    img: 'Esri.jpg',
                    url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/${z}/${y}/${x}',
                    rights: '&copy; ESRI',
                    clasification: 'VECTORIAL'
                },
                B8:{
                    type:'Esri',
                    label:'Google Sat&eacute;lite',
                    img:'Google.jpg',
                    //url:'http://mt0.google.com/vt/lyrs=s&w=256&h=256&hl=en&style=40,18&x=${x}&y=${y}&z=${z}',
                    url:'https://mt0.google.com/vt/lyrs=s&w=256&h=256&hl=en&style=40,18&x=${x}&y=${y}&z=${z}', 
                    //url:'http://khm0.googleapis.com/kh?v=803&hl=es-419&w=256&h=256&x=${x}&y=${y}&z=${z}',
                    //url:'http://khm0.googleapis.com/kh?v=812&hl=es-419&w=256&h=256&x=${x}&y=${y}&z=${z}',
                    rights:'&copy; Google', 
                    clasification:'RASTER'
                },
            },
		layers:{
            groups:{			
			G1:{
                    label:'INEGI',
					thematicLink:'https://www.inegi.org.mx/contenidos/productos/prod_serv/contenidos/espanol/bvinegi/productos/geografia/marcogeo/794551067314_s.zip',
                    coord:'POLYGON((-11949796 2648934, -11372468 2335074))',                    
                    metadato:'..//descargas/Capas Base.zip',
                    btnGroup : true,
                    layers:{
                        centidad:{
                            label:'Límite Estatal',
                            synonymous:['estado','estatales'],
                            scale:1,
                            position:50,
                            active:false,
                            texts:{
                                scale:1,
                                active:false
                            },
                            metadato:'..//descargas/BUENA_VISTA_PDUCP_16012_DOCS.rar',
                            descarga:'..//descargas/BUENA_VISTA_PDUCP_16012_SHAPE.rar',
                        },
                        cmunicipal:{
                            label:'Límite Municipales',
                            synonymous:['municipios','municipal'],
                            scale:4,
                            position:51,
                            active:false,
                            texts:{
                                scale:1,
                                active:false
                            },
                            //metadato:'..//descargas/BUENA_VISTA_PDUCP_16012_DOCS.rar',
                            //descarga:'..//descargas/BUENA_VISTA_PDUCP_16012_SHAPE.rar',
                        },
                        clocalidad:{
                            label:'Límite de Localidades Amanzanadas',
                            coord:'POLYGON((-11684066 2456866, -11666036 2447080))',
                            synonymous:['localidad','localidades'],
                            scale:1,
                            position:52,
                            active:false,
                            texts:{
                                scale:1,
                                active:false
                            },
                            //metadato:'..//descargas/BUENA_VISTA_PDUCP_16012_DOCS.rar',
                            //descarga:'..//descargas/BUENA_VISTA_PDUCP_16012_SHAPE.rar',
                        },
                        casehum:{
                            label:'Límite de Asentamientos Humanos',
                            coord:'POLYGON((-11684066 2456866, -11666036 2447080))',
                            synonymous:['Asentamientos','Colonias'],
                            scale:1,
                            position:53,
                            active:false,
                            texts:{
                                scale:1,
                                active:false
                            },
                            //metadato:'..//descargas/BUENA_VISTA_PDUCP_16012_DOCS.rar',
                            //descarga:'..//descargas/BUENA_VISTA_PDUCP_16012_SHAPE.rar',
                        },
                        cservicios:{
                            label:'Servicios puntuales',
                            synonymous:['localidad','localidades'],
                            scale:1,
                            position:54,
                            active:false,
                            //metadato:'..//descargas/BUENA_VISTA_PDUCP_16012_DOCS.rar',
                            //descarga:'..//descargas/BUENA_VISTA_PDUCP_16012_SHAPE.rar',
                        }
                        //Añadir localidades
                    }
                },
			G2:{
                    label:'SEGURIDAD PÚBLICA ESTATAL',
					thematicLink:'http://www.beta.inegi.org.mx/app/centrosinformacion/',
                    coord:'POLYGON((-11684066 2456866, -11666036 2447080))',
                    layers:{
                        cfaltas:{
                            label:'Faltas Administrativas',
                            synonymous:['Faltas','Administrativas'],
                            scale:1,
                            position:100,
                            active:false,
                            texts:{
                                scale:1,
                                active:false
                            },
                        },
                        cfamilia:{
                            label:'Contra la Familia',
                            synonymous:['Familia','familia'],
                            scale:1,
                            position:101,
                            active:false,
                            texts:{
                                scale:1,
                                active:false
                            },
                        },
                        crobos:{
                            label:'Contra el Patrimonio',
                            synonymous:['Patrimonio','patrimonio'],
                            scale:1,
                            position:102,
                            active:false,
                            texts:{
                                scale:1,
                                active:false
                            },
                        },
                        cosi:{
                            label:'Otros Servicios e Incidencias',
                            synonymous:['Otros','Incidencias'],
                            scale:1,
                            position:103,
                            active:false,
                            texts:{
                                scale:1,
                                active:false
                            },
                        }
					}
                }
            }            
        }
    };
	if(typeof(treeConfig)!='undefined'){
        data = $.extend(data, treeConfig);
    }
    return data;
});