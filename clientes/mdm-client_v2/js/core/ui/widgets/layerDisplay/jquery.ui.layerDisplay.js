$.widget("custom.layerDisplay", {
  // default options
  id: '',
  timer: null,
  currentScale: 0,
  transparency: 1,
  wmsLayers: [],
  outLayers: {},
  cloud: {},
  layerCount: 0,
  lastSearch: '',
  selectedLayers: [],
  selectedServices: [],
  exludeList: {},
  statusMain: 'hidden',
  statusList: 'hidden',
  shortListTimer: 0,
  listaID:[],
  options: {
    specialLayer: null,
    timeToSearch: 400,
    layers: [],
    defaultLayers: [],
    url: '',
    map: null,
    // callbacks
    onActiveLayer: function () { },
    onResetActiveStatus: function () { },
    onDeactiveLayer: function () { },
    onThemeLayers: function (layers) { },
    onSetScale: function (scale) { },
    onChangeOpacity: function (val) { },
    getBottomMargin: function () { },
    onRefreshLists: function (data) { },
    change: null,
    random: null,
    startTheme: null

  },
  
  saveStats: function (data) {
    var obj = this;
    var dataSource = obj.options.dataSource;
    var mainObj = {
      project: dataSource.proyName,
      session: obj.options.map.idSession,
      layers: data.id,
      type: data.type
    };

    mainObj = JSON.stringify(mainObj);
    var params = mainObj;

    var dataSource = $.extend(true, {}, dataSource.saveStats);
    dataSource.data = params;

    $.ajax(dataSource).done(function (data) {
      if (data && data.response.success) {
      }
    }).error(function () {
      //obj.options.map.Notification({message:'Fall&oacute; al guardar las estadisticas de uso',time:4500});
    });
  },
  printAllLayers: function () {
    var obj = this;
    obj.printOutLayers();
    obj.printLayerSelectedList();
    obj.listLayersSelected();

    //notifica que se estan refrescando las listas
    obj.options.onRefreshLists({ layers: obj.selectedLayers, services: obj.selectedServices, outlayers: obj.countOutLayers() });
  },
  getLayers: function () {
    var obj = this;
    return obj.options.layers;
  },
  getActiveLayers: function () {
    var obj = this;
    var list = obj.selectedLayers;
    var result = [];
    for (var x in list) {
      if (list[x].active)
        result.push(list[x]);
    }
    return result;
  },


  getAllActiveLayers: function () {
    var obj = this;
    var list = obj.selectedLayers;
    var result = [];
    for (var x in list) {
      if (list[x].active) {
        result.push(list[x]);
      } else {
        var texts = list[x].texts;
        if (texts)
          if (texts.active)
            result.push(list[x]);
      }
    }
    return result;
  },
  getLayer: function (idLayer) {
    var obj = this;
    var list = obj.options.layers;
    var layer = null;
    var exlusionList = {};
    for (var x in list) {
      
      var idGroup = x;
      var labelGroup = list[x].label;
      var item = list[x].layers;
      var exists = item[idLayer];
      if (exists) {
        layer = exists;
        break;
      }
    }
    return layer;
  },
  exludeRules: function () {
    var obj = this;
    var list = obj.options.layers;
    var exlusionList = obj.exludeList;
    var specialLayersList = [];
    //get all specialLayers
    for (var x in list) {
      var item = list[x].layers;
      for (var i in item) {
        var layer = item[i];
        if (layer.specialLayer)
          specialLayersList.push(layer.idLayer);
      }
    }
    var tspecial = $.extend([], specialLayersList); //listado temporal de capas especiales 
    for (var x in list) {
      var idGroup = x;
      var labelGroup = list[x].label;
      var item = list[x].layers;
      for (var i in item) {
        var layer = item[i];
        var idLayer = i;
        var excludeItem = item[i].exclude;
        if (excludeItem || layer.specialLayer) {
          if (!excludeItem) { excludeItem = []; } else {
            excludeItem = excludeItem.split(',');
          }
          //si es una capa especial, excluye tambien a todas las demas especiales
          if (layer.specialLayer) {
            for (var s in tspecial) {
              var sl = tspecial[s]
              if (excludeItem.indexOf(sl) < 0 && sl != idLayer) {
                excludeItem.push(sl);
              }

            }
          }

          for (var e in excludeItem) {
            var eitem = excludeItem[e];
            var plist = exlusionList[idLayer];
            var elist = exlusionList[eitem];

            if (plist) {
              exlusionList[idLayer].push(eitem);
            } else {
              exlusionList[idLayer] = [eitem];
            }
            if (elist) {
              exlusionList[eitem].push(idLayer);
            } else {
              exlusionList[eitem] = [idLayer];
            }
          }
        }
      }
    }
  },
  setActiveLayers: function (layers) {
    var obj = this;
    var aLayers = obj.getActiveLayers();
    for (var x in aLayers) {
      var item = aLayers[x];
      obj.options.onDeactiveLayer(item);
    }
    //desactiva casillas y botones de texto
    $('.layerDisplay-body input:checkbox').each(function () {
      $(this).prop('checked', false);
    });
    $('.layerDisplay-body .layerDisplay-iconText_a').each(function () {
      $(this).toggleClass('layerDisplay-iconText_a layerDisplay-iconText_d');
    });
    obj.resetActiveStatus();
    obj.selectedLayers = [];
    var activeLayers = false;

    if (!(layers === undefined)) {
      var ids = layers.layers;
      var list = obj.options.layers;
      activeLayers = [];
      var layersIds = [];
      for (var x in list) {
        var idGroup = x;
        var labelGroup = list[x].label;
        var item = list[x].layers;
        for (var i in item) {
          var idLayer = i;
          if (ids.indexOf(i) >= 0) {
            var canActive = false;
            if (list[idGroup].private) { // es privado el grupo
              var _var = list[idGroup].private.urlvar;
              var val = list[idGroup].private.value;
              var cookieVal = $.cookie(_var);
              if (cookieVal) {
                canActive = true
              } else {
                obj.options.map.Notification({ message: 'La capa es privada' });
                break;
              }
            } else {
              canActive = true;
            }
            if (canActive) {
              item[i].active = true;
              item[i].idGroup = idGroup;
              item[i].idLayer = idLayer;
              $('.layerDisplay-body #' + i).prop('checked', true);
              obj.addLayerShortcut(item[i]);
              activeLayers.push(item[i]);
              layersIds.push(idLayer);
              if (!(item[i].texts === undefined)) {
                $('.layerDisplay-body button[idref="' + i + '"]').toggleClass('layerDisplay-iconText_a layerDisplay-iconText_d');
                item[i].texts.active = true;
                var tId = idLayer.replace('c', 't');

                var tLayer = $.extend({}, item[i]);
                tLayer.idGroup = idGroup;
                tLayer.idLayer = tId;

                layersIds.push(tId);
                activeLayers.push(tLayer);
              }
            }
          }
        }
      }
    }

    obj.options.onThemeLayers(activeLayers);
    for (var x in activeLayers) {
      var item = activeLayers[x];
      obj.options.onActiveLayer(item);
    }
    obj.printAllLayers();
    //guarda estadistica
    if (layersIds.length > 0)
      obj.saveStats({ id: layersIds.join(), type: 'theme' });

  },
  resetActiveStatus: function () {
    var obj = this;
    var list = obj.options.layers;
    for (var x in list) {
      var idGroup = x;
      var labelGroup = list[x].label;
      var item = list[x].layers;
      for (var i in item) {
        var idLayer = i;
        var label = item[i].label;
        var synonymous = item[i].synonymous;
        var scale = item[i].scale;
        var position = item[i].position;
        var active = item[i].active;

        item[i].active = false;
        if (!(item[i].texts === undefined)) item[i].texts.active = false;
      }
    }
    obj.options.onResetActiveStatus();
  },
  prepareLayers: function () {
    var obj = this;
    var list = obj.options.layers;
    var viewDataList = obj.layerViewData;

    for (var x in list) {
      var idGroup = x;
      var labelGroup = list[x].label;
      var item = list[x].layers;
      for (var i in item) {
        var idLayer = i;

        //ajusta layer en caso que sea una capa de solo te
        if (idLayer.substr(0, 1) == 't') {
          item[i].isText = true;
          item[i].texts = { active: item[i].active };
          item[i].active = false;
        }

        item[i].idGroup = idGroup;
        item[i].idLayer = idLayer;
        if (viewDataList.indexOf(item[i].idLayer) >= 0)
          item[i].viewData = true;


        if (item[i].active || (!(item[i].texts === undefined) && item[i].texts.active)) {
          obj.addLayerShortcut(item[i]); //agrega la capa activa a el despliegue frontal
        }
      }
    }
  },
  setZoomIcon: function (_scale) {
    var obj = this;
    obj.currentScale = _scale;
    var list = obj.options.layers;
    for (var x in list) {
      var idGroup = x;
      var labelGroup = list[x].label;
      var item = list[x].layers;
      for (var i in item) {
        var idLayer = i;
        var label = item[i].label;
        var synonymous = item[i].synonymous;
        var scale = item[i].scale;
        var position = item[i].position;
        var active = item[i].active;

        var visible = ((_scale < scale) && (scale != 0)) ? '' : 'none';

        $('#' + obj.id + '_' + idLayer + '_scale').css('display', visible);
        $('#' + obj.id + '_' + idLayer + '_scale_sel').css('display', visible);
        $('#' + obj.id + '_' + idLayer + '_scale_s').css('display', visible);
      }
    }
  },
  setTextLayer: function (group, layer, value) {
    var obj = this;
    var item = obj.options.layers[group].layers[layer];

    var group = obj.options.layers[group];
    var canActive = false;
    if (group.private) { // es privado el grupo
      var _var = group.private.urlvar;
      var val = group.private.value;
      var cookieVal = $.cookie(_var);
      if (cookieVal) {
        canActive = true
      } else {
        obj.options.map.Notification({ message: 'La capa es privada' });
      }
    } else {
      canActive = true;
    }

    if (canActive) {

      if (value === undefined) {
        item.texts.active = !item.texts.active;
      } else {
        item.texts.active = value;
      }

      var titem = $.extend({}, item);
      var tId = layer.replace('c', 't');
      titem.idLayer = tId;
      if (titem.texts.active) {
        obj.options.onActiveLayer(titem);
        obj.addLayerShortcut(item);
      } else {
        obj.options.onDeactiveLayer(titem);
      }

      

      $('.layerDisplay-btnText[idgroup="' + group + '"][idref="' + layer + '"]').each(function () {
       
        var strActive = (item.texts.active) ? 'a' : 'd';
        $(this).removeClass('layerDisplay-iconText_a')
          .removeClass('layerDisplay-iconText_d')
          .addClass('layerDisplay-iconText_' + strActive);
      });
      obj.printAllLayers();

    }
  },
  exludeLayer: function (activeId) {
    var obj = this;
    var exludeRule = null;

    var layer = '';

    if (typeof (activeId) == 'object') {
      if (activeId.exludeList) {
        exludeRule = activeId.exludeList;
      }
    } else {
      layer = activeId;
      exludeRule = obj.exludeList[layer];
    }


    if (exludeRule) {
      var preserve = obj.getLayer(layer);
      var list = exludeRule;
      for (var x in exludeRule) {
        var reject = obj.getLayer(exludeRule[x]);
        var treject = null;
        if (reject && reject.active) {
          reject.active = false;
          $('#' + reject.idLayer).prop('checked', false);
          obj.options.onDeactiveLayer(reject);

          treject = reject.texts;
        }
        if (treject) {
          if (treject.active) {
            reject.texts.active = false;
            $('.layerDisplay-btnText[idref=' + reject.idLayer + ']').addClass('layerDisplay-iconText_d').removeClass('layerDisplay-iconText_a');
            treject = $.extend(true, {}, reject);
            treject.idLayer = treject.idLayer.replace('c', 't');
            obj.options.onDeactiveLayer(treject);
          }
        }
      }
    }
    if (typeof (activeId) == 'object')
      obj.printAllLayers();
  },
  mapExtend: function (param, geo) {
    var obj = this;
    switch (typeof (param)) {
      case 'string':
        obj.options.map.goCoords(param);
        break;
      case 'object':
        var geo = (!(geo === undefined) && geo) ? 'geographic' : 'mercator';
        var lon = 0;
        var lat = 0;
        if (param.length == 2) {
          lon = parseFloat(param[0], 10);
          lat = parseFloat(param[1], 10);
        } else {
          lon = parseFloat(param.lon);
          lat = parseFloat(param.lat);
        }

        obj.options.map.goCoords(lon, lat, geo);
        break;
    };
  },
  setCheckLayer: function (group, layer, value) {
    var obj = this;
    var g = group;
    var l = layer;
    var group = obj.options.layers[group];
    var canActive = false;
    if (group.private) { // es privado el grupo
      var _var = group.private.urlvar;
      var val = group.private.value;
      var cookieVal = $.cookie(_var);
      if (cookieVal) {
        canActive = true
      } else {
        obj.options.map.Notification({ message: 'La capa es privada' });
      }
    } else {
      canActive = true;
    }

    if (canActive) {

      //exluir layers en caso de que se vaya a activar una capa
      if (value){
        obj.exludeLayer(layer);
      }


      //var item = obj.options.layers[group].layers[layer];
      var item = group.layers[layer];
      item.active = value;
      $('#' + layer).prop('checked', item.active);
      if (!item.active) {
        //$('#container_'+layer+'_s').remove();
        $('#container_'+layer+'_selected').remove();
        
        obj.options.onDeactiveLayer(item);
        //var addPos = obj.obtenerPos();
        var pos = parseInt(0);
        obj.selectedLayers.splice(addPos, 1);
        obj.closeLayer(g, l);
        //e.stopPropagation();
        
      } else {
        obj.options.onActiveLayer(item);
        obj.addLayerShortcut(item);
      }
      obj.printAllLayers();
    }
  },
  obtenerPos: function(pos){
    var pos = pos; 
    return pos;
  },
  closeLayer: function (group, layer) {
    var obj = this;
    if (typeof (group) == 'object') {
      layer = group.idLayer;
      group = group.idGroup;
    }
    var item = obj.options.layers[group].layers[layer];
    if (item.active){
      item.active = false;
    }
      obj.options.onDeactiveLayer(item);
    if (!(item.texts === undefined) && item.texts.active) {
      var tId = layer.replace('c', 't');
      var titem = $.extend(true, {}, item);
      titem.idLayer = tId;
      item.texts.active = false;
      obj.options.onDeactiveLayer(titem);
    }

    $('#' + layer).prop('checked', false); //desmarca input
    /*$('.layerDisplay-btnText[idgroup="' + group + '"][idref="' + layer + '"]').each(function () {
      console.log("REMUEVE COSAS DE CloseLayer--- :0");
      var strActive = (item.texts.active) ? 'a' : 'd';
      $(this).removeClass('layerDisplay-iconText_a')
        .removeClass('layerDisplay-iconText_d')
       .addClass('layerDisplay-iconText_' + strActive);
    }); */
   obj.printAllLayers();
  },
  addLayerShortcut: function (item) {
    var obj = this;

    var list = this.selectedLayers;
    var ban = false; //existe el elemento?
    var idLayer = item.idLayer;
    if (list.length > 0) {
      for (var x in list) {
        if (list[x].idLayer == idLayer) {
          ban = true;
          break;
        }
      }
    }
    if (!ban)
      list.push(item);

    return !ban; //devuelve true si la inserto y false de lo contrario
  },
  printLayerSelectedList: function () {
    var obj = this;
    var list = this.selectedLayers;
    var services = obj.wmsLayers;
    var strGroup = '';
    for (var x in list) {

      var idGroup = list[x].idGroup;
      var idLayer = list[x].idLayer;
      var item = list[x];

      var strLayer = '';

      var label = item.label;
      var synonymous = item.synonymous;
      var scale = item.scale;
      var position = item.position;
      var active = item.active;

      var displayStatus = (active) ? 'layerDisplay-iconEye_a' : 'layerDisplay-iconEye_d';
      var btnClose = '<button alt="Remover capa" title="Remover capa" pos="' + x + '" id="' + obj.id + '_' + idLayer + '_show_" idref="' + idLayer + '" scale="' + scale + '"  idGroup="' + idGroup + '" class="layerDisplay-sprite layerDisplay-iconClose2 layerDisplay-transparentBtn btnCloseShortcut"></button>';
      var btnDisplay = (item.isText === undefined) ? '<button alt="Visualizar/Ocultar capa" title="Visualizar/Ocultar capa" id="' + obj.id + '_' + idLayer + '_show" idref="' + idLayer + '" scale="' + scale + '"  idGroup="' + idGroup + '" class="layerDisplay-sprite ' + displayStatus + ' layerDisplay-transparentBtn btnShowShortcut"></button>' : '<div class="layerDisplay-btnSpace"></div>';

      var scaleVisible = ((obj.currentScale < scale) && (scale != 0)) ? '' : 'none';
      var btnScale = '<button alt="Cambiar la escala para visualizar la capa de informaci&oacute;n" title="Cambiar la escala para visualizar la capa de informaci&oacute;n" id="' + obj.id + '_' + idLayer + '_scale_sel" idref="' + idLayer + '" scale="' + scale + '"  idGroup="' + idGroup + '" style="display:' + scaleVisible + '" class="layerDisplay-sprite layerDisplay-btnScale layerDisplay-btnScale-selected  layerDisplay-iconZoom_a layerDisplay-flatBtn shadow"></button>';
      //
      var texts = (!(item.texts === undefined)) ? item.texts : null;
      var btnTextClass = (texts != null && texts.active) ? 'layerDisplay-iconText_a shadow' : 'layerDisplay-iconText_d';
      var btnText = ((texts != null) ? '<button id="' + obj.id + '_' + idLayer + '_tl_s2" idref="' + idLayer + '" idGroup="' + idGroup + '" alt="Activar/Desactivar textos" title="Activar/Desactivar textos" class="layerDisplay-sprite ' + btnTextClass + ' layerDisplay-flatBtn btnTextShortcut"></button>' : '');

      var btnViewLayerData = (!(item.viewData === undefined)) ? '<button idref="' + idLayer + '" idGroup="' + idGroup + '" alt="Ver metadato" title="Ver datos de capa" class="layerDisplay-iconViewData_a layerDisplay-btnViewData layerDisplay-flatBtn"></button>' : '';

      var btnDownload = (!(item.download === undefined)) ? '<button idref="' + idLayer + '" idGroup="' + idGroup + '" alt="Descarga" title="Descarga" class="layerDisplay-iconDownload_a layerDisplay-flatBtn layerDisplay-download btnLayerDownload"></button>' : '';

      strLayer += '<div class="layerDisplay-layerSelected-2 shadow" layer="' + idLayer + '" id="container_'+idLayer+'_selected">' + btnClose + btnDisplay + '<label id="' + obj.id + '_l_' + idLayer + '_s_">' + label + '</label><div style="float:right;padding-right:3px;">' + btnViewLayerData + btnText + btnScale + btnDownload + '</div></div>';
      //    
      strGroup += strLayer;
    }
    var strService = '';
    var selectedServices = []
    for (var x in services) {
      var service = services[x];
      if (service.selected.layers.length > 0) {
        selectedServices.push(service);
        var id = service.id;
        var label = service.label;
        var format = service.selected.format.split('/')[1].toUpperCase();

        var checked = (service.active) ? 'layerDisplay-iconEye_a' : 'layerDisplay-iconEye_d';

        strService += '<div id="layerDisplay_selectedService_' + id + '" idref="' + id + '" class="layerDisplay-selectedService2">';
        strService += '	<span id="layerDisplay_selectedService2_check_' + id + '" active="' + service.active + '" idref="' + id + '" class="layerDisplay-selectedService2-check layerDisplay-sprite ' + checked + '"/>';
        strService += '	<label>' + label + '</label>';
        strService += '	<label class="layerDisplay-selectedService2-check">' + format + '</label>';
        strService += '</div>';
      }
    }
    obj.selectedServices = selectedServices;

    $('#' + obj.id + '_service_selected_2').html(strService);
    $('.shortList-service-group').css('display', ((strService != '') ? 'block' : 'none'));

    //_service_selected_2

    $('.shortList-layer-group').css('display', ((strGroup != '') ? 'block' : 'none'));
    $('#' + obj.id + '_layer_selected_2').html(strGroup);

    $('.layerDisplay-selectedService2-check').each(function (index, element) {
      $(this).click(function () {
        var idref = $(this).attr('idref');
        var active = ($(this).attr('active') == 'true');
        obj.changeService({ active: !active }, idref)
      });
    });


    $('.btnCloseShortcut').each(function () {
      var layer = $(this).attr('idref');
      var group = $(this).attr('idgroup');
      var pos = parseInt($(this).attr('pos'), 10);
      var value = $(this).hasClass('layerDisplay-iconEye_a');
      var outlayer = $(this).attr('outlayer');
      $(this).click(function (e) {
        if (!outlayer) {
          obj.selectedLayers.splice(pos, 1);
          obj.closeLayer(group, layer);
          e.stopPropagation();
        } else {
          obj.closeOutLayer(group, pos);
        }
      })
    });

    $('.btnShowShortcut').each(function () {
      var layer = $(this).attr('idref');
      var group = $(this).attr('idgroup');
      var value = $(this).hasClass('layerDisplay-iconEye_a');
      var outlayer = $(this).attr('outlayer');
      $(this).click(function (e) {
        if (!outlayer) {
          obj.setCheckLayer(group, layer, !value);
        } else {
          var pos = parseInt($(this).attr('pos'), 10);
          obj.setCheckOutLayer(group, pos, !value);
        }
        e.stopPropagation();
      })
    });

    $('.btnTextShortcut').each(function () {
      $(this).click(function (e) {
        var layer = $(this).attr('idref');
        var group = $(this).attr('idgroup');
        var value = $(this).hasClass('layerDisplay-iconText_a');
        obj.setTextLayer(group, layer, !value);
        e.stopPropagation();
      });

    });



  },
  getLayersSelected: function () {
    var obj = this;
    var list = obj.options.layers;
    var services = obj.wmsLayers;

    var strGroup = '';
    for (var x in list) {
      var idGroup = x;
      var labelGroup = list[x].label;
      var item = list[x].layers;
      var strLayer = '';
      for (var i in item) {
        if (
          (!(item[i].active === undefined) && item[i].active) ||
          (!(item[i].texts === undefined) && item[i].texts.active)) {
          var idLayer = i;
          var label = item[i].label;
          var synonymous = item[i].synonymous;
          var scale = item[i].scale;
          var position = item[i].position;
          var active = item[i].active;

          var checked = (active) ? 'checked="checked"' : '';

          var scaleVisible = ((obj.currentScale < scale) && (scale != 0)) ? '' : 'none';
          var btnScale = '<button alt="Cambiar la escala para visualizar la capa de informaci&oacute;n" title="Cambiar la escala para visualizar la capa de informaci&oacute;n" id="' + obj.id + '_' + idLayer + '_scale_s" scale="' + scale + '" idref="' + idLayer + '"  idGroup="' + idGroup + '" style="display:' + scaleVisible + '" class="layerDisplay-sprite layerDisplay-btnScale layerDisplay-btnScale-selected  layerDisplay-iconZoom_a layerDisplay-flatBtn shadow"></button>';

          var texts = (!(item[i].texts === undefined)) ? item[i].texts : null;
          var btnTextClass = (texts != null && texts.active) ? 'layerDisplay-iconText_a shadow' : 'layerDisplay-iconText_d';
          var btnText = ((texts != null) ? '<button id="' + obj.id + '_' + idLayer + '_tl_s" idref="' + idLayer + '" idGroup="' + idGroup + '" alt="Activar/Desactivar textos" title="Activar/Desactivar textos" class="layerDisplay-sprite ' + btnTextClass + ' layerDisplay-btnText layerDisplay-btnText-selected layerDisplay-flatBtn"></button>' : '');
          var checkbox = (item[i].isText === undefined) ? '<input type="checkbox" id="' + idLayer + '_s" idGroup="' + idGroup + '" layer="' + idLayer + '" ' + checked + ' class="layerDisplay-checkLayer layerDisplay-checkLayer-selected">' : '<div class="layerDisplay-btnSpace"></div>';
          strLayer += '<div class="layerDisplay-layerSelected" layer="' + idLayer + '" id="container_' + idLayer + '_s">' + checkbox + '<label id="' + obj.id + '_l_' + idLayer + '_s">' + label + '</label><div style="float:right;padding-right:3px;">' + btnText + btnScale + '</div></div>';
        }
      }
      strGroup += strLayer;
    }
    //Listado de servicios
    if (strGroup != '')
      strGroup = '<label class="layerDisplay-layerSelected-title">Capas de informaci&oacute;n</label>' + strGroup;
    var strService = '';
    for (var x in services) {
      var service = services[x];
      if (service.selected.layers.length > 0) {
        var id = service.id;
        var label = service.label;
        var format = service.selected.format.split('/')[1].toUpperCase();

        var checked = (service.active) ? 'checked="checked"' : '';

        strService += '<div id="layerDisplay_selectedService_' + id + '" idref="' + id + '" class="layerDisplay-selectedService">';
        strService += '	<input id="layerDisplay_selectedService_check_' + id + '" idref="' + id + '" class="layerDisplay-selectedService-check" type="checkbox" ' + checked + ' />';
        strService += '	<label for="layerDisplay_selectedService_check_' + id + '">' + label + '</label>';
        strService += '	<span idref="' + id + '" class="layerDisplay-selectedService-close layerDisplay-sprite layerDisplay-iconClose-s" />';
        strService += '	<label for="layerDisplay_selectedService_check_' + id + '" class="layerDisplay-selectedService-check">' + format + '</label>';
        strService += '</div>';
      }
    }
    if (strService != '')
      strGroup = strGroup + '<label class="layerDisplay-layerSelected-title">Servicios</label>' + strService;

    return strGroup;
  },
 
   

  getLayersDomList: function () {

    var obj = this;
    var list = obj.options.layers;
    var strGroup = '';
    var count = 0;
    var coords= '';
    

    for (var x in list) {
      var idGroup = x;
      var labelGroup = list[x].label;
      var coords = list[x].coord;
      var item = list[x].layers;
      var strLayer = '';
      for (var i in item) {
        
        var idLayer = i;
        //var coords = "POLYGON((-11299922.452010626 2207653.2407313734,-11299922.452010626 2256722.065129013,-11248008.985908026 2256722.065129013,-11248008.985908026 2207653.2407313734,-11299922.452010626 2207653.2407313734))";
        //var coords1 = "POLYGON((-11181882.3530 2243013.3482, -11181882.3530 2253785.0922, -11160372.5497 2243013.3482, -11160372.5497 2253785.0922))";
        //var coords = "357706.47 2182133.93 358429.19 2182998.98";

        var label = item[i].label;
        var synonymous = item[i].synonymous;
        var scale = item[i].scale;
        var position = item[i].position;
        var active = item[i].active;

        

        var checked = (active) ? 'checked="checked"' : '';

        var btnScale = '<button alt="Cambiar la escala para visualizar la capa de informaci&oacute;n" title="Cambiar la escala para visualizar la capa de informaci&oacute;n" id="' + obj.id + '_' + idLayer + '_scale" layer="' + idLayer + '" idref="' + idLayer + '" scale="' + scale + '" idGroup="' + idGroup + '" style="display:none" class="layerDisplay-sprite layerDisplay-btnScale layerDisplay-iconZoom_a layerDisplay-flatBtn shadow"></button>';

        var texts = (!(item[i].texts === undefined)) ? item[i].texts : null;
        var btnTextClass = (texts != null && texts.active) ? 'layerDisplay-iconText_a shadow' : 'layerDisplay-iconText_d';
        var btnText = ((texts != null) ? '<button id = "' + idLayer+'_btn" idref="' + idLayer + '" idGroup="' + idGroup + '" alt="Activar/Desactivar textos" title="Activar/Desactivar textos" class="layerDisplay-sprite ' + btnTextClass + ' layerDisplay-btnTextIcon layerDisplay-btnText layerDisplay-flatBtn button"></button>' : '');
        var btnDisplay = (item[i].isText === undefined) ? '<input type="checkbox" id="' + idLayer + '" idGroup="' + idGroup + '" layer="' + idLayer + '" ' + checked + ' class="layerDisplay-checkLayer layerDisplay-coord" coords="' + coords + '" >' : '<div class="layerDisplay-btnSpace"></div>';
        var relLabelCheck = (item[i].isText === undefined) ? 'for="' + idLayer + '"' : '';
      /*var btnMetadato = (!(item[i].metadato === undefined)) ? '<div class="dropdown2"> <button onclick="myFunction()" idref="' + idLayer + '" url="' + item[i].metadato + '" idGroup="' + idGroup + '" alt="Ver metadato" title="Ver metadato" class="layerDisplay-iconDownload layerDisplay-download dropbtn  layerDisplay-flatBtn"></button> <div id="myDropdown" class="dropdown-content2">   <a class = "layerDisplay-btnMetadato" href="#">Link 1</a>  <a href="#">Link 2</a> </div> </div>' : ''; */
        //var btnMetadato = (!(item[i].metadato === undefined))?'<button idref="'+idLayer+'" url="'+item[i].metadato+'" idGroup="'+idGroup+'" alt="Ver metadato" title="Ver metadato" class="layerDisplay-iconDownload layerDisplay-download layerDisplay-btnMetadato layerDisplay-flatBtn"></button>':'';
        var btnMetadato = (!(item[i].metadato === undefined))?'<button   id = "'+idLayer+'_btnM" idref="'+idLayer+'" url="'+item[i].metadato+'" idGroup="'+idGroup+'" alt="Descargar" title="Descargar" class="layerDisplay-iconDownload layerDisplay-download dropbtn layerDisplay-flatBtn descargabtn " ></button>':'';
        var btnMetadatoC = (!(item[i].metadato === undefined))?'<button idref="'+idLayer+'" url="'+item[i].metadato+'" idGroup="'+idGroup+'" alt="Descargar" title="Descargar" class="layerDisplay-iconDownload layerDisplay-download layerDisplay-btnMetadato layerDisplay-flatBtn "></button>':'';
        var btnDownload = (!(item[i].download === undefined)) ? '<button idref="' + idLayer + '" idGroup="' + idGroup + '" alt="Descarga" title="Descarga" class="layerDisplay-iconDownload layerDisplay-download layerDisplay-flatBtn"></button>' : '';

        var btnViewLayerData = (!(item[i].viewData === undefined)) ? '<button idref="' + idLayer + '" idGroup="' + idGroup + '" alt="Ver metadato" title="Ver datos de capa" class="layerDisplay-iconViewData_a layerDisplay-btnViewData layerDisplay-flatBtn"></button>' : '';
/******** */
        var btnInformatio = (!(item[i].informatio === undefined))?'<button idref="'+idLayer+'" url="'+item[i].informatio+'" idGroup="'+idGroup+'" alt="Ver documento" title="Ver documento" class="layerDisplay-sprite layerDisplay-iconMetadato_a layerDisplay-btnMetadato layerDisplay-flatBtn"></button>':'';
        var btnImagen = (!(item[i].imagen === undefined))?'<button   id = "'+idLayer+'_btnM" idref="'+idLayer+'" url="'+item[i].imagen+'" idGroup="'+idGroup+'" alt="Visualizar mapa" title="Visualizar mapa" class="layerDisplay-icon-mapa layerDisplay-flatBtn layerDisplay-btnMetadato"></button>':'';

/******* */


        //var btnThematicLink = ((item[i].thematicLink && item[i].thematicLink != '' ))?'<a href="'+item[i].thematicLink+'" target="_blank"><button idref="'+idLayer+'"  class="layerDisplay-thematicLink layerDisplay-info layerDisplay-flatBtn"></button></a>':'';

      if(idLayer == "c53_pducp_zonif_sec" || idLayer == "c53_ppduzn_zonif_sec" || idLayer == "c53_ppduzo_zonif_sec" || idLayer == "c53_ppduzp_zonif_sec" || idLayer == "c53_ppduch_zonif_sec" || idLayer == "c102_pmdu_zonif_sec" || idLayer == "c102_pducp_zonif_sec" || idLayer == "c53_pmdu_zonif_sec"){
        strLayer += '<div class="layerDisplay-layer layerDisplay-coord " id="' + obj.id + '_mLayer_' + idLayer +'" coords="' + coords + '">' + btnDisplay + '<label ' + relLabelCheck + ' id="' + obj.id + '_l_' + idLayer + '">' + ((btnViewLayerData != '') ? '<big><b>*</b></big>' : '') + label + '</label>'+ btnMetadato + btnScale + btnText + btnDownload  /*+btnViewLayerData*/ + '</div>';
       
        strLayer +='<div class="btndescarga_'+idLayer+'">';
          strLayer += '<div id="myDropdown" class="dropdown-content2">';
            strLayer += '<a url="'+item[i].metadato+'" class = "layerDisplay-btnMetadato" > Documentos Descarga </a>';
            //strLayer += '<div url="'+item[i].metadato+'" class = "layerDisplay-btnMetadato"> Link 1 </div>';
            strLayer += '<a url="'+item[i].descarga+'" class = "layerDisplay-btnMetadato"> Shapefile Descarga </a>';
          strLayer += '</div>';
        strLayer += '</div>';
        //obj.myfuntionid(idLayer);
      }
       else{
      
        //strLayer += '<div class="layerDisplay-layer " id="' + obj.id + '_mLayer_' + idLayer + '">' + btnDisplay + '<label ' + relLabelCheck + ' id="' + obj.id + '_l_' + idLayer + '">' + ((btnViewLayerData != '') ? '<big><b>*</b></big>' : '') + label + '</label>'+ btnMetadato +btnImagen+ btnInformatio+ btnScale + btnText + btnDownload  /*+btnViewLayerData*/ + '</div>';
        strLayer += '<div class="layerDisplay-layer layerDisplay-coord" id="' + obj.id + '_mLayer_' + idLayer + '" coords="' + coords + '">' + btnDisplay + '<label ' + relLabelCheck + ' id="' + obj.id + '_l_' + idLayer + '">' + ((btnViewLayerData != '') ? '<big><b>*</b></big>' : '') + label + '</label>'+ btnMetadato +btnImagen+ btnInformatio+ btnScale + btnText + btnDownload  /*+btnViewLayerData*/ + '</div>';
      }
     
      }
      var groupMetadato = list[x].metadato;
      var groupDescarga = list[x].descarga;
      var groupSource = list[x].source;
      var hasLink = list[x].thematicLink;

     //original// var btnMetadatoGroup = (groupMetadato) ? '<div idref="' + idLayer + '" url="' + groupMetadato + '" idGroup="' + idGroup + '" alt="Ver informaci&oacute;n" title="Ver informaci&oacute;n" class="layerDisplay-sprite layerDisplay-iconMetadato_a layerDisplay-btnMetadato layerDisplay-btnMetadatoGroup"></div>' : '';
     
     var btnMetadatoGroup = (groupMetadato) ? '<div idref="' + idLayer + '" url="' + groupMetadato + '" idGroup="' + idGroup + '" alt="Descarga" title="Descarga" class="layerDisplay-iconDownload layerDisplay-download layerDisplay-btnMetadato layerDisplay-btnMetadatoGroup"></div>' : '';
     var btnMetadatoGroup1 = (groupMetadato) ? '<div id = "btnD_'+idGroup+'" idref="' + idLayer + '" url="' + groupMetadato + '" idGroup="' + idGroup + '" alt="Descarga" title="Descarga" class="layerDisplay-iconDownload layerDisplay-download  layerDisplay-btnMetadatoGroup dropbtn"></div>' : '';
     var btnMetadatoGroup2 = (groupMetadato,groupDescarga) ? '<div id = "btnD_'+idGroup+'" idref="' + idLayer + '" url="' + groupMetadato + '" idGroup="' + idGroup + '" alt="Descarga" title="Descarga" class="layerDisplay-iconDownload layerDisplay-download  layerDisplay-btnMetadatoGroup dropbtn"></div>' : '';
      var labelSource = (groupSource) ? '<div class="layerDisplay-source-label"><div><label alt="Fuente" title="Fuente">' + groupSource + '</label></div></div>' : '';
      var btnThematicLink = ((hasLink && hasLink != '')) ? '<a href="' + hasLink + '" target="_blank"><button idref="' + x + '"  class="layerDisplay-thematicLink layerDisplay-info layerDisplay-flatBtn"></button></a>' : '';
      
      strGroup += '<div id="' + obj.id + '_groupLayer_' + idGroup + '" class="layerDisplay-groupLayer">';
      if(idGroup == "G1" ){
        strGroup += '	<div class="layerDisplay-title-container"><div class="layerDisplay-title">'+ btnMetadatoGroup +'<div class="layerDisplay-groupLayer-name" idGroup="' + idGroup + '">'+labelGroup + '</div></div></div>' + strLayer;

      }

  
      else{
        //Apatzigán
        if(idGroup == "G7"){
          strGroup += '	<div class="layerDisplay-title-container"><div class="layerDisplay-title"><div class="layerDisplay-groupLayer-name" idGroup="' + idGroup + '">'+labelGroup + '</div></div> <h6>07-Nov-23 a 17-Ene-24 </h6>'; 
          
          strGroup +='<div class="menuConsulta" style="margin-top: 10px;">';
            strGroup += '<div id="myDropdown" class="dropdown-content2">';
            //strGroup += '<a url="https://docs.google.com/forms/d/e/1FAIpQLSfsy-3MiZvTXfQK6ec0SVbiXuBQgqCS5gpTG29ZL16YWVPwFg/viewform" class = "layerDisplay-btnMetadato layerDisplay-icon-hand" > Formulario de Participaci&oacuten</a>';
            strGroup += '<a url="https://drive.google.com/drive/folders/1MTInayJcKRs9iPfJuxPPOtDOnUPYRPmM" class="layerDisplay-btnMetadato layerDisplay-icon-libro"> Documento T&eacutecnico de PMDU </a>';
            strGroup += '</div>';
            strGroup += '</div>';   
        
            /* ************************ */
            strGroup += '</div>' + strLayer; 
        }
        //Hidalgo
        else if(idGroup == "G35"){
          strGroup += '	<div class="layerDisplay-title-container"><div class="layerDisplay-title"><div class="layerDisplay-groupLayer-name" idGroup="' + idGroup + '">'+labelGroup + '</div></div> <h6>07-Nov-23 a 16-Ene-24 </h6>'; 
          
          strGroup +='<div class="menuConsulta" style="margin-top: 10px;">';
            strGroup += '<div id="myDropdown" class="dropdown-content2">';
            //strGroup += '<a url="https://docs.google.com/forms/d/e/1FAIpQLSfsy-3MiZvTXfQK6ec0SVbiXuBQgqCS5gpTG29ZL16YWVPwFg/viewform" class = "layerDisplay-btnMetadato layerDisplay-icon-hand" > Formulario de Participaci&oacuten</a>';
            strGroup += '<a url="https://drive.google.com/drive/folders/1ZDmhDY7TKgB7tOFjoPhNIYDc2WigP1GU" class="layerDisplay-btnMetadato layerDisplay-icon-libro"> Documento T&eacutecnico de PMDU </a>';
            strGroup += '</div>';
            strGroup += '</div>';   
        
            /* ************************ */
            strGroup += '</div>' + strLayer; 
        }
        //Jacona
        else if(idGroup == "G44"){
          strGroup += '	<div class="layerDisplay-title-container"><div class="layerDisplay-title"><div class="layerDisplay-groupLayer-name" idGroup="' + idGroup + '">'+labelGroup + '</div></div> <h6>07-Nov-23 a 17-Ene-24 </h6>'; 
          
          strGroup +='<div class="menuConsulta" style="margin-top: 10px;">';
            strGroup += '<div id="myDropdown" class="dropdown-content2">';
            //strGroup += '<a url="https://docs.google.com/forms/d/e/1FAIpQLSfsy-3MiZvTXfQK6ec0SVbiXuBQgqCS5gpTG29ZL16YWVPwFg/viewform" class = "layerDisplay-btnMetadato layerDisplay-icon-hand" > Formulario de Participaci&oacuten</a>';
            strGroup += '<a url="https://drive.google.com/drive/folders/1aszAsug0MmgG3XyIVs0dDTFca1yJ3g--" class="layerDisplay-btnMetadato layerDisplay-icon-libro"> Documento T&eacutecnico de PMDU </a>';
            strGroup += '</div>';
            strGroup += '</div>';   
        
            /* ************************ */
            strGroup += '</div>' + strLayer; 
        }
        //Sahuayo 
        else if(idGroup == "G77"){
          strGroup += '	<div class="layerDisplay-title-container"><div class="layerDisplay-title"><div class="layerDisplay-groupLayer-name" idGroup="' + idGroup + '">'+labelGroup + '</div></div> <h6>13-Nov-23 a 24-Ene-24 </h6>'; 
          
          strGroup +='<div class="menuConsulta" style="margin-top: 10px;">';
            strGroup += '<div id="myDropdown" class="dropdown-content2">';
            //strGroup += '<a url="https://docs.google.com/forms/d/e/1FAIpQLSfsy-3MiZvTXfQK6ec0SVbiXuBQgqCS5gpTG29ZL16YWVPwFg/viewform" class = "layerDisplay-btnMetadato layerDisplay-icon-hand" > Formulario de Participaci&oacuten</a>';
            strGroup += '<a url="https://drive.google.com/drive/folders/1S9VOZqxLicAQ5Wl-QMKL_9bpHc0dHBxT" class="layerDisplay-btnMetadato layerDisplay-icon-libro"> Documento T&eacutecnico de PMDU </a>';
            strGroup += '</div>';
            strGroup += '</div>';   
        
            /* ************************ */
            strGroup += '</div>' + strLayer; 
        }
        //Tarímbaro
        else if(idGroup == "G89"){
          strGroup += '	<div class="layerDisplay-title-container"><div class="layerDisplay-title"><div class="layerDisplay-groupLayer-name" idGroup="' + idGroup + '">'+labelGroup + '</div></div> <h6>15-Nov-23 a 19-Ene-24 </h6>'; 
          
          strGroup +='<div class="menuConsulta" style="margin-top: 10px;">';
            strGroup += '<div id="myDropdown" class="dropdown-content2">';
            //strGroup += '<a url="https://docs.google.com/forms/d/e/1FAIpQLSfsy-3MiZvTXfQK6ec0SVbiXuBQgqCS5gpTG29ZL16YWVPwFg/viewform" class = "layerDisplay-btnMetadato layerDisplay-icon-hand" > Formulario de Participaci&oacuten</a>';
            strGroup += '<a url="https://tarimbaromich.gob.mx/index.php/pmdu/" class="layerDisplay-btnMetadato layerDisplay-icon-libro"> Documento T&eacutecnico de PMDU </a>';
            strGroup += '</div>';
            strGroup += '</div>';   
        
            /* ************************ */
            strGroup += '</div>' + strLayer; 
        }
        //Zamora
        else if(idGroup == "G109"){
          strGroup += '	<div class="layerDisplay-title-container"><div class="layerDisplay-title"><div class="layerDisplay-groupLayer-name" idGroup="' + idGroup + '">'+labelGroup + '</div></div> <h6>15-Nov-23 a 29-Ene-24</h6>'; 
          
          strGroup +='<div class="menuConsulta" style="margin-top: 10px;">';
            strGroup += '<div id="myDropdown" class="dropdown-content2">';
            //strGroup += '<a url="https://docs.google.com/forms/d/e/1FAIpQLSfsy-3MiZvTXfQK6ec0SVbiXuBQgqCS5gpTG29ZL16YWVPwFg/viewform" class = "layerDisplay-btnMetadato layerDisplay-icon-hand" > Formulario de Participaci&oacuten</a>';
            strGroup += '<a url="https://drive.google.com/drive/folders/1zkBe7w8f_RzZ3vjs1iziPpJmNdcggcAo" class="layerDisplay-btnMetadato layerDisplay-icon-libro"> Documento T&eacutecnico de PMDU </a>';
            strGroup += '</div>';
            strGroup += '</div>';   
        
            /* ************************ */
            strGroup += '</div>' + strLayer; 
        }
        else{
          

        strGroup += '	<div class="layerDisplay-title-container"><div class="layerDisplay-title">'+ btnMetadatoGroup2 +'<div class="layerDisplay-groupLayer-name" idGroup="' + idGroup + '">'+labelGroup + '</div></div>'; 
      
        /* ***************************** */  
          strGroup +='<div class="btndescarga">';
          strGroup += '<div id="myDropdown" class="dropdown-content2">';
          strGroup += '<a url="'+groupMetadato+'" class = "layerDisplay-btnMetadato" > Documentos Descarga </a>';
          //strLayer += '<div url="'+item[i].metadato+'" class = "layerDisplay-btnMetadato"> Link 1 </div>';
          strGroup += '<a url="'+groupDescarga+'" class = "layerDisplay-btnMetadato"> Shapefile Descarga </a>';
          strGroup += '</div>';
          strGroup += '</div>';   
        
        /* ************************ */
        strGroup += '</div>' + strLayer;
          
        }
      } //Fin else
      strGroup += labelSource;
      strGroup += '</div>';
    }
    obj.layerCount = count;
    
    return strGroup;

    
  },

  
  listLayersSelected: function () {
    var obj = this;
    //obj.getLayerSelectedList();
    $('.layerDisplay-body-selected').html(obj.getLayersSelected());
    //$('#'+obj.id+'_layer_selected_2').html(obj.getLayersSelected2());
    obj.assignBtnsActions_selected();
    //obj.setZoomIcon(obj.currentScale);
  },
  //search in text
  textSearchFormat: function (text) {
    text = text.toLowerCase();

    text = text.replace(/[\u00E1]/gi, 'a');
    text = text.replace(/[\u00E9]/gi, 'e');
    text = text.replace(/[\u00ED]/gi, 'i');
    text = text.replace(/[\u00F3]/gi, 'o');
    text = text.replace(/[\u00FA]/gi, 'u');
    text = text.replace(/[\u00F1]/gi, 'n');

    text = text.replace(/&aacute;/g, 'a');
    text = text.replace(/&eacute;/g, 'e');
    text = text.replace(/&iacute;/g, 'i');
    text = text.replace(/&oacute;/g, 'o');
    text = text.replace(/&uacute;/g, 'u');
    text = text.replace(/&ntilde;/g, 'n');

    text = text.replace(/rr/g, 'r');
    text = text.replace(/ll/g, 'l');
    text = text.replace(/x|z|c/g, "s");
    return text;
  },
  compareText: function (a, b) {
    var obj = this;
    if (typeof (a) == 'object') {
      var ban = false;
      for (var x in a) {
        var a_s = (obj.textSearchFormat(a[x]));
        var b_s = (obj.textSearchFormat(b));
        if (a_s.search(b_s) >= 0) ban = true;
      }
      return ban;
    } else {
      var a_s = (obj.textSearchFormat(a));
      var b_s = (obj.textSearchFormat(b));
      return (a_s.search(b_s) >= 0);
    }
  },
  showAllLayers: function () {
    $('.layerDisplay-hidde').each(function () {
      $(this).removeClass('layerDisplay-hidde');
    });
    // $('#layerDisplay-footer').html('<label>Capas: '+this.layerCount+'</label>');
  },
  //Input filter
  initSearch: function (text) {
    var obj = this;
    var list = obj.options.layers;
    var strGroup = '';
    var count = 0;
    for (var x in list) {
      var idGroup = x;
      var labelGroup = list[x].label;
      var item = list[x].layers;
      var strLayer = '';

      var banGroup = false;
      var countLayer = 0;
      var toHidde = [];
      var notHidde = [];

      $('#' + obj.id + '_groupLayer_' + idGroup).addClass('layerDisplay-hidde');
      banGroup = false;//(obj.compareText(labelGroup,text));

      for (var i in item) {
        var idLayer = i;
        var label = item[i].label;
        var synonymous = item[i].synonymous;
        var scale = item[i].scale;
        var position = item[i].position;
        var active = item[i].active;

        if (obj.compareText(label, text) ||
          obj.compareText(synonymous, text)) {
          notHidde.push(idLayer);
        } else {
          toHidde.push(idLayer);
        }
      }
      if (notHidde.length > 0) {
        banGroup = true;
      }

      if (banGroup) {
        count += notHidde.length;

        for (var nh in notHidde) {
          $('#' + obj.id + '_mLayer_' + notHidde[nh]).removeClass('layerDisplay-hidde');
        }
        for (var h in toHidde) {
          $('#' + obj.id + '_mLayer_' + toHidde[h]).addClass('layerDisplay-hidde');
        }
        $('#' + obj.id + '_groupLayer_' + idGroup).removeClass('layerDisplay-hidde');
      }
    }
    // $('#layerDisplay-footer').html('<label>Capas: '+count+'</label>');
  },
  trackInput: function () {
    var obj = this;
    clearTimeout(obj.searchTimer);
    obj.searchTimer = setTimeout(function () {
      var text = $('#' + obj.id + '_txtSearch').val();
      if (text.length > 2 && text != obj.lastSearch) {
        obj.lastSearch = text;
        obj.initSearch(text);
        $('#' + obj.id + '_txtSearch').css('color', '#444');
      }
      if (text.length <= 2) {
        obj.showAllLayers();
        $('#' + obj.id + '_txtSearch').css('color', '#888');
      }
    }, obj.options.timeToSearch);
  },
  setInputText: function (id, callback) {
    var obj = this;
    $('#' + id).bind("keypress", function (evt) {
      var otherresult = 12;
      if (window.event != undefined) {
        otherresult = window.event.keyCode;
      }
      var charCode = (evt.which) ? evt.which : otherresult;
      if (charCode == 13 || charCode == 12) {
        if (charCode == 13)/*$("#"+idClick).click();*/
          if (charCode == 12 && evt.keyCode == 27) {  //atrapa esc y limpia
            setTimeout(function () { $('#' + id).val(''); }, 200);
          }
        if (charCode == 46 && $.isFunction(callback)) {
          callback();
        }
        if (charCode == 27) {
          setTimeout(function () { $('#' + id).val(''); }, 200);
          obj.showAllLayers();
        }
      } else {
        var keyChar = String.fromCharCode(charCode);
        var keyChar2 = keyChar.toLowerCase();
        var re = /[\u00E0-\u00E6\u00E8-\u00EB\u00EC-\u00EF\u00F2-\u00F6\u00F9-\u00FC\u0061-\u007a\u00f10-9 \-\,\.]/
        var result = re.test(keyChar2);
        result = (charCode == 8) ? true : result;
        if (result) {
          if ($.isFunction(callback))
            callback();
        }
        return result;

      }

    }).keydown(function (e) {
      if (((e.which == 46) || (e.which == 8)) && $.isFunction(callback)) {
        callback();
      }
      if (e.which == 27) {
        setTimeout(function () { $('#' + id).val(''); }, 200);
        obj.showAllLayers();
      }
    });
  },
  adjustDefaultLayers: function () {
    var obj = this;
    var def = obj.options.defaultLayers;
    var layers = obj.options.layers;

    obj.resetActiveStatus();
    for (var x in def) {
      var g = def[x].group;
      var l = def[x].id; //layer

      var item = obj.options.layers[g].layers[l];
      if (item === undefined) {
        if (l.substr(0, 1) == 't') {
          var tmpL = l.replace('t', 'c');
          var item = obj.options.layers[g].layers[tmpL];//.texts;
          item.isText = true;
        }
      }
      if (!(item === undefined)) {
        item.active = true;
        obj.addLayerShortcut(item);
      }
    }
  },
  // the constructor
  _create: function () {
    var obj = this;
    obj.id = obj.element.attr('id');
    var defaultLayers = obj.options.defaultLayers;

    //carga las capas que se podran deplegar sus contenidos
    var listViewLayers = obj.options.tree.specialActions.consultables;
    obj.layerViewData = [];
    for (var x in listViewLayers) {
      obj.layerViewData.push(listViewLayers[x].name);
    }
    //----------------------------

    if (defaultLayers.length > 0) {
      obj.adjustDefaultLayers();
    }
    obj.prepareLayers(); //complementa la informacion de las capas con identificadores
    obj.exludeRules();
    //obj.exludeList; 
    obj.bootActionLayers();

    this.element
      // add a class for theming
      // .addClass("custom-layerDisplay no-print");
    // prevent double click to select text
    //.disableSelection();
    var layersSelected = obj.getLayersSelected();
    var struc = '<div id="layerDisplay-container1" class="layerDisplay-container">';
    struc += ' <div class="layerDisplay-header">';
    struc += '       <input id="' + obj.id + '_txtSearch" value="" placeholder="Consulta de capa">'; 
    struc += '       <span id="' + obj.id + '_btnClear" class="btnlayerDisplay-clear fa-solid fa-delete-left"></span>'; 
    struc += '       <span id="' + obj.id + '_btnClose" class="btnlayerDisplay-close fa-solid fa-xmark"></span>';
    struc += ' </div>';
    struc += ' <div class="layerDisplay-body">';
    struc += ' 	<div id="layerDisplay-bodyLayers" style="display: flex; flex-direction: column">' + obj.getLayersDomList() + '</div>';
    struc += ' 	<div id="layerDisplay-bodyWms" style="display:none">' + obj.getWmsForm() + '</div>';
    struc += ' </div>';
    // struc += ' <div class="layerDisplay-tabSelection">';
    // struc += ' 	<div id="' + obj.id + '_btnLayers" value="Layers" active="true" class="layerDisplay-btnLayers layerDisplay-tabBtn"><label class="layerDisplay-rotateLeft">Capas</label></div>';
    // struc += ' 	<div id="' + obj.id + '_btnWms" value="Wms" class="layerDisplay-btnWms layerDisplay-tabBtn"><label class="layerDisplay-rotateLeft">Servicios</label></div>';
    // struc += ' </div>';
    // struc+= ' <div class="layerDisplay-body-selected">'+layersSelected+'</div>';
    // struc+= ' <div id="layerDisplay-footer" class="layerDisplay-footer"><b>*</b>: Puede ser consultada la información tabular de la capa</div>';
    // struc+= '</div>';

    var cadena = '<div class="layerDisplay-bgmodal"></div>';
    // var cadena = '<div class="layerDisplay-bgmodal"><div class="layerDisplay-overlay"></div></div>';
    // cadena += '  <div class="layerDisplay-area-patch-br"><div class="layerDisplay-overlay"></div></div>';
    // cadena += '  <div class="layerDisplay-area-patch-bl"><div class="layerDisplay-overlay"></div></div>';
    cadena += '<div>' + struc + '</div>';
    // cadena += '<div class="layerDisplay-area ui-corner-all">' + struc + '</div>';

    var layerSelected_mini = '<div id="' + obj.id + '_shortList" class="layerDisplay-body-selected-2 shadow">';
    layerSelected_mini += '  <label class="shortList-title">Capas en Mapa</label><span id="' + obj.id + '_btnClose_selected" class="flatBbtnlayerDisplay-close-s layerDisplay-sprite layerDisplay-iconClose-s" title="Cerrar lista" alt="Cerrar lista"></span>';
    layerSelected_mini += '  <div class="shortList-layer-group">';
    layerSelected_mini += '  	<div class="tool">';
    layerSelected_mini += '  		<label>Capas de Informaci&oacute;n</label>';
    layerSelected_mini += '  		<span id="' + obj.id + '_btnClear_shortcut" title="limpiar capas" alt="limpiar capas" class="layerDisplay-btnClear layerDisplay-sprite layerDisplay-iconClear"></span>';
    layerSelected_mini += '  	</div>';
    layerSelected_mini += '  	<div class="layerDisplay-transparencyContainer"><div class="layerDisplay-transparencyText">Transparencia</div><div class="layerDisplay-sprite layerDisplay-iconCircleBlank_a"></div><div id="' + obj.id + '_sliderTransparency" class="layerDisplay-sliderTransparency" alt="transparencia de capas" title="transparencia de capas"></div><div class="layerDisplay-sprite layerDisplay-iconCircleFill_a"></div></div>';
    layerSelected_mini += '  	<div id="' + obj.id + '_layer_selected_2" class="container"></div>';
    layerSelected_mini += '  </div>';
    layerSelected_mini += '  <div id="shortList_outlayers_group"class="shortList-outlayers-group"></div>';
    layerSelected_mini += '  <div class="shortList-service-group">';
    layerSelected_mini += '  	<div class="tool">';
    layerSelected_mini += '  		<label>Servicios de Informaci&oacute;n</label>';
    layerSelected_mini += '  	</div>';
    layerSelected_mini += '  	<div id="' + obj.id + '_service_selected_2" class="container"></div>';
    layerSelected_mini += '  </div>';
    layerSelected_mini += '</div>';
    obj.element.html(cadena);
    //obj.element.parent().append(layerSelected_mini);
    $('#panel-center').append(layerSelected_mini);

    $('#layerDisplay_serviceTypes').buttonset().change(function () {
      var type = $("#layerDisplay_serviceTypes :radio:checked").attr('value');
      $("#layerDisplay_serviceVer").css('display', ((type != 'wms') ? 'block' : 'none'));
    });

    $('#layerDisplay_serviceVer').buttonset();

    $('#layerDisplay_addService_btn').click(function (e) {

      var url = $("#layerDisplay_newServiceUrl").val();
      if (url != '' && url.isUrl()) {
        var type = $("#layerDisplay_serviceTypes :radio:checked").attr('value');
        var newService = {
          type: type,
          url: url
        }
        if (type != 'wms') {
          newService.version = $("#layerDisplay_serviceVer :radio:checked").attr('value');
        }

        obj.addService(newService)//spinner(true);
      }
    });
/****************me */    
$(".btndescarga").hide();
$(".layerDisplay-layer").hide();
$(".menuConsulta").hide();
/**me ocultar descarga */
$(".descargas").hide();
 /********* */   
var obj = this;
var list = obj.options.layers;
for (var x in list) {
  var item = list[x].layers;
  for (var i in item) {
    var idLayer = i;
    $(".btndescarga_"+idLayer).hide();
  }
}
 /**************************** */
var obj = this;
var list = obj.options.layers;

for (var x in list) {
  var idGroup = x;
  var item = list[x].layers;
  
  for (var i in item) {
    var idLayer = i;
    $('#'+idLayer +'_btn').click(function (){
      this.classList.toggle("active");
    });

    $('#'+idLayer+'_btnM').on('click',function(){
      var idref = $(this).attr('idref');
      if($('#'+idref+'_btnM').attr('data-click-state') == 1) {
          $('#'+idref+'_btnM').attr('data-click-state', 0);
          $('#'+idref+'_btnM').closest('.layerDisplay-groupLayer').children(".btndescarga_"+idref).css("display","none");
         // $(this).children( ".layerDisplay-layer" ).css( "display", "none" )
        }
      else {
        $('#'+idref+'_btnM').attr('data-click-state', 1);
        $('#'+idref+'_btnM').closest('.layerDisplay-groupLayer').children(".btndescarga_"+idref).css("display","block");
        //$(this).children( ".layerDisplay-layer" ).css( "display", "block" )
      }
    });


  }
  
  $('#btnD_'+idGroup).on('click',function(){
    
    if($(this).attr('data-click-state') == 1) {
        $(this).attr('data-click-state', 0);
        $(this).closest('.layerDisplay-title-container').children(".btndescarga").css("display","none");
       // $(this).children( ".layerDisplay-layer" ).css( "display", "none" )
       
      }
      
    else {
      $(this).attr('data-click-state', 1);
      $(this).closest('.layerDisplay-title-container').children(".btndescarga").css("display","block");
      //$(this).children( ".layerDisplay-layer" ).css( "display", "block" )
    }
  }); 
}

/* -------------------cerrrar descargs------------------- */

var cierreDescarga = document.getElementById('myDropdown');

document.addEventListener('click', function(event) {
  var targetElement = event.target; 
  if (!cierreDescarga.contains(targetElement)) {
    //$(this).attr('data-click-state', 0);
    //$(this).closest('.layerDisplay-title-container').children(".btndescarga").css("display","none");
  }
});
/* --------------------------------------- */
/* *************** */
$('.layerDisplay-coord').click(function (){
  var coords = $(this).attr('coords');
  obj.mapExtend(coords);
  
});
 /* ************************** */

//+++++++++++++++++++++++++++++ capas windows  +++++++++++++++++++++++++++++
var carrusel = document.getElementById('layerDisplay-container1');
document.addEventListener('click', function(event) {
  var targetElement = event.target; // Elemento clicado
  if (!carrusel.contains(targetElement)) {
    // Cierra 
   // $('#layersDisplay').css('display', 'none'); //Cierra ventana capa
  }
});

//++++++++++++++++++++++++++++++++  Fin  ++++++++++++++++++++++++++++++++++++++++++
    
$('.layerDisplay-groupLayer-name').on('click',function(){
        var idDes = $(this).attr('idgroup');
    if($(this).attr('data-click-state') == 1) {
        $(this).attr('data-click-state', 0);
        $(this).closest('.layerDisplay-groupLayer').children(".layerDisplay-layer").css("display","none");
       // $(this).children( ".layerDisplay-layer" ).css( "display", "none" )
        //console.log('Valor de idDes: '+idDes);
       //$(this).closest('.layerDisplay-title-container').children(".btndescarga").css("display","none");
       $('#btnD_'+idDes).attr('data-click-state', 0);
        $('#btnD_'+idDes).closest('.layerDisplay-title-container').children(".btndescarga").css("display","none");

       $(this).closest('.layerDisplay-title-container').children(".menuConsulta").css("display","none");
      }
    else {
      $(this).attr('data-click-state', 1);
      $(this).closest('.layerDisplay-groupLayer').children(".layerDisplay-layer").css("display","block");
      $(this).closest('.layerDisplay-title-container').children(".menuConsulta").css("display","block");
      //$(this).children( ".layerDisplay-layer" ).css( "display", "block" )
    }
  });
  $(".layerDisplay-groupLayer-name").hover(function(){
   // $(this).css("background-color", "#99C43A");
    $(this).css('cursor','pointer');
    }, function(){
    $(this).css("background-color", "#FFFFFF");
    $(this).css('cursor','auto');
  });


    $('.layerDisplay-body').each(function () {
      $(this).disableSelection();
    });
    $('#' + obj.id + '_btnClose').click(function () {
      obj.closeMainList();
    });

    $('.layerDisplay-tabBtn').each(function (index, element) {
      $(this).click(function (e) {
        var tab = $(this).attr('value');
        $('.layerDisplay-tabBtn[active=true]').removeAttr('active');
        $(this).attr('active', 'true');

        //control display body content
        $('#layerDisplay-bodyLayers').css('display', 'none');
        $('#layerDisplay-bodyWms').css('display', 'none');
        $('#layerDisplay-body' + tab).css('display', '');
        if (tab == 'Wms') {
          $('.layerDisplay-header label').hide();
          $('.layerDisplay-header input').hide();
          $('#layersDisplay_btnClear').hide();
        } else {
          $('.layerDisplay-header label').show();
          $('.layerDisplay-header input').show();
          $('#layersDisplay_btnClear').show();
        }
        e.stopPropagation();
      })
    });

    $('#' + obj.id + '_btnClose_selected').click(function () {
      obj.closeShortList();
    });

    $('#' + obj.id + '_btnClear_shortcut').click(function (e) {
      obj.setActiveLayers();
      e.stopPropagation();
    });

    $('#' + obj.id + '_btnClear').click(function () {
      $('#' + obj.id + '_txtSearch').val('');
      obj.showAllLayers();
      $('#' + obj.id + '_txtSearch').focus();
    })
    $('#' + obj.id + '_sliderTransparency').slider({
      range: "max",
      min: 1,
      max: 100,
      value: 100,
      slide: function (event, ui) {
        var val = (ui.value > 0) ? (ui.value / 100) : 0;
        obj.transparency = val;
        obj.options.onChangeOpacity(val);
      }
    });

    //$('#layerDisplay-footer').html('<label>Capas: '+obj.layerCount+'</label>');

    obj.setInputText(obj.id + '_txtSearch', function () { obj.trackInput() });

    $('#' + obj.id + '_shortList').mouseenter(function () {
      clearTimeout(obj.shortListTimer);
    })
    $('#' + obj.id + '_shortList').mouseleave(function () {
      if (obj.statusList == 'show')
        obj.shortListTimer = setTimeout(function () {
          obj.closeShortList();
        }, 2500);
    });

    obj.printLayerSelectedList();
    obj.assignBtnsActions();
    //ocualta paneles
    obj.closeMainList();
    obj.closeShortList();
    this._refresh();
  },


  bootActionLayers: function () {
    var obj = this;
    var layers = obj.getActiveLayers();
    for (var x in layers) {
      var item = layers[x];
      obj.options.onActiveLayer(item);
    }
  },
  getTransparency: function () {
    return this.transparency;
  },
  openMainList: function () {
    var obj = this;
    obj.statusMain = 'show';
    obj.statusList = 'hidden';
    $('#' + obj.id).css('display', '');
   // $('.' + obj.id + '-container').css('display', '');
    $('#' + obj.id + '_shortList').css('display', 'none');
    $('#' + obj.id + '_txtSearch').focus();


    $(document).bind('keydown', function (e) {
      if (e.which == 27) {
        obj.closeMainList();
      }
    });
  },
  switchMainList: function () {
    var obj = this;
    //if (obj.statusMain == 'show') {
    //  obj.closeMainList();
  //  } else {
      obj.openMainList();
   // }
  },
  switchShortList: function () {
    var obj = this;
    if (obj.statusList == 'show') {
      obj.closeShortList();
    } else {
      obj.openShortList();
    }
  },
  openShortList: function () {
    var obj = this;

    var bottomMargin = obj.options.getBottomMargin() || 31;
    obj.statusMain = 'hidden';
    obj.statusList = 'show';
    $('#' + obj.id).css('display', 'none');
    $('#' + obj.id + '_shortList').css({
      'display': '',
      'bottom': bottomMargin + 'px'
    });
  },
  closeShortList: function () {
    var obj = this;
    obj.statusList = 'hidden';
    $('#' + obj.id + '_shortList').css('display', 'none');
  },
  isOpenShortList: function () {
    var obj = this;
    var status = $('#' + obj.id + '_shortList').css('display');
    return status != 'none';
  },
  adjustMarginShortList: function () {
    var obj = this;
    if (obj.isOpenShortList()) {
      obj.openShortList();
    }
  },
  closeMainList: function () {
    var obj = this;
    obj.statusMain = 'hidden';
    $('#' + obj.id).css('display', 'none');

    $(document).unbind('keydown');
  },
  assignBtnsActions_selected: function () {
    var obj = this;
    $('.layerDisplay-selectedService-check').each(function (index, element) {
      $(this).click(function (e) {
        var idref = $(this).attr('idref');
        obj.changeService({ active: $(this).is(':checked') }, idref)
        e.stopPropagation();
      })
    });
    $('.layerDisplay-selectedService-close').each(function (index, element) {
      $(this).click(function (e) {
        var idref = $(this).attr('idref');
        obj.deleteService(idref)
        e.stopPropagation();
      })
    });
    $('.layerDisplay-btnText-selected').each(function () {
      var assigned = $(this).attr('assigned');
      if (assigned === undefined) {
        $(this).click(function (e) {
          $(this).attr('assigned', true);
          var layer = $(this).attr('idref');
          var group = $(this).attr('idgroup');
          obj.setTextLayer(group, layer);
          e.stopPropagation();
        });
      }
    });
    $('.layerDisplay-checkLayer-selected').each(function () {
      var assigned = $(this).attr('assigned');
      if (assigned === undefined) {
        $(this).click(function (e) {
          $(this).attr('assigned', true);
          var layer = $(this).attr('layer');
          var group = $(this).attr('idgroup');
          var value = $(this).is(':checked');

          //guarda estadistica
          if (value) obj.saveStats({ id: layer, type: 'main list' });

          obj.setCheckLayer(group, layer, value);
          e.stopPropagation();
        });
      }
    });
    $('.layerDisplay-btnScale').each(function () {
      var assigned = $(this).attr('assigned');
      if (assigned === undefined) {
        $(this).attr('assigned', true);
        $(this).click(function (e) {
          var scale = $(this).attr('scale');
          if (!(scale === undefined)) {
            obj.options.onSetScale(parseFloat(scale, 10));
          }
          e.stopPropagation();
        });
      }
    });
    $('.layerDisplay-btnViewData').each(function () {
      var assigned = $(this).attr('assigned');
      if (assigned === undefined) {
        $(this).attr('assigned', true);
        $(this).click(function (e) {
          var idref = $(this).attr('idref');
          obj.options.onViewLayerData(idref);
          e.stopPropagation();
        });
      }
    });
  },
  /***********/
  myfuntionid: function (idlayer){
   console.log("myfuntionid: "+idlayer);
    
  },
 /***********/ 
  assignBtnsActions: function () {
    var obj = this;

    $('.layerDisplay-btnText').each(function () {
      var assigned = $(this).attr('assigned');
      if (assigned === undefined) {
        $(this).attr('assigned', true);
        $(this).click(function (e) {
          var layer = $(this).attr('idref');
          var group = $(this).attr('idgroup');
          obj.setTextLayer(group, layer);
          e.stopPropagation();
        });
      }
    }); 
    
    $('.layerDisplay-checkLayer').each(function () {
      var assigned = $(this).attr('assigned');
      if (assigned === undefined) {
        
        $(this).attr('assigned', true);
        $(this).click(function (e) {
          
          var layer = $(this).attr('layer');
          var group = $(this).attr('idgroup');
          var value = $(this).is(':checked');
          if (value){ 
            obj.saveStats({ id: layer, type: 'main list' });
          }

          obj.setCheckLayer(group, layer, value);
          e.stopPropagation();
        });
      }
    });
    $('.layerDisplay-btnScale').each(function () {
      var assigned = $(this).attr('assigned');
      if (assigned === undefined) {
        $(this).attr('assigned', true);
        $(this).click(function (e) {
          var scale = $(this).attr('scale');
          if (!(scale === undefined)) {
            obj.options.onSetScale(parseFloat(scale, 10));
          }
          e.stopPropagation();
        });
      }
    });
    $('.layerDisplay-btnMetadato').each(function () {
      var assigned = $(this).attr('assigned');
      if (assigned === undefined) {
        $(this).attr('assigned', true);
        $(this).click(function (e) {
          var url = $(this).attr('url');
          if (!(url === undefined)) {
            window.open(url);
          }
          e.stopPropagation();
        });
      }
    });
    $('.layerDisplay-btnMetadato').each(function () {
      var assigned = $(this).attr('assigned');
      if (assigned === undefined) {
        $(this).attr('assigned', true);
        $(this).click(function (e) {
          var url = $(this).attr('url');
          if (!(url === undefined)) {
            window.open(url);
          }
          e.stopPropagation();
        });
      }
    });
 
/* ******************************* */ //cometar por ahora 
    /*
    $('.layerDisplay-download').each(function () {
      var assigned = $(this).attr('assigned');
      if (assigned === undefined) {
        $(this).attr('assigned', true);
        $(this).click(function (e) {
          var idref = $(this).attr('idref');
          var layer = obj.getLayer(idref);
          obj.menuLayerDownload(layer.download);
          e.stopPropagation();
        });
      }
    });
    */
 /* ************************** */   


  },
  loadMessages: function () {
    var obj = this;
    var params = {};
    obj.getData(obj.options.url, params, function (data) {
      //console.log(data);    
    });
  },
  menuLayerDownload: function (layer) {
    var obj = this;
    var list = layer.list;
    var dialog = '<div id="layerDisplay_layerDownload" title="' + layer.title + '">';
    dialog += '<table cellspacing="0" width="100%">';
    for (var x in list) {
      var item = list[x];
      dialog += '<tr><td width="100%">' + item.title + '</td><td><a class="ui-button ui-widget ui-corner-all layerDisplay-layerBtnDownload" target="_blank" href="' + item.url + '">Descargar</a></td></tr>';

      //<button style="width:100%" url="'+item.url+'" class="layerDisplay-layerBtnDownload ui-button ui-widget ui-corner-all">Descargar</button></td></tr>';
    }
    dialog += '</table></div>';
    $('#layerDisplay_layerDownload').remove();
    $('body').append(dialog);
    $('#layerDisplay_layerDownload').dialog({
      resizable: false,
      width: 350,
      modal: true,
      height: 100 + (list.length * 40),
      close: function (event, ui) {
        $(this).dialog('destroy').remove();
      },
      buttons: {
        "Aceptar": function () {
          $(this).dialog("close");
        }
      }
    });
  },
  printWmsServices: function () {
    var obj = this;
    var services = obj.wmsLayers;
    var createItem = function (service) {
      var selected = service.selected;
      var cadena = '';
      cadena += '<div id="serviceLayer_' + service.id + '" class="serviceLayer-serviceItem">';
      cadena += '	<div class="serviceLayer-header">';
      cadena += '		<div id="serviceLayer_cloudContainer' + service.id + '" class="serviceLayer-cloudContainer"></div>';
      cadena += '		<input id="serviceLayer_check_' + service.id + '" class="serviceLayer-checkService" idref="' + service.id + '" type="checkbox"' + ((service.active) ? 'checked="checked"' : '') + '/>';
      cadena += '		<span idref="' + service.id + '" class="serviceLayer-editName ui-icon ui-icon-pencil"/>';
      cadena += '		<span idref="' + service.id + '" class="serviceLayer-editName-ok ui-icon ui-icon-check" style="display:none"/>';
      cadena += '		<label class="serviceLayer-name" for="serviceLayer_check_' + service.id + '" idref="' + service.id + '" title="' + service.path + '">' + service.label + '</label>';
      cadena += '		<input class="serviceLayer-inputName" id="serviceLayer_name_' + service.id + '" type="text" value="' + service.label + '" idref="' + service.id + '" style="display:none" />';
      cadena += '	</div>';
      cadena += '	<span id="serviceLayer_' + service.id + '_closeBtn" idref="' + service.id + '" class="serviceLayer-closeBtn layerDisplay-sprite layerDisplay-iconClose-s"/>';

      cadena += '	<div class="serviceLayer-innerTools">';
      cadena += '		<span idref="' + service.id + '" class="serviceLayer-cloudBtn layerDisplay-sprite layerDisplay-iconZoom_a" title="Buscar elementos" />';
      cadena += '		<label class="serviceLayer-serviceType">' + service.type + '</label>';

      var formats = service.data.formats;


      var imgSel = selected.format;
      imgSel = ((!imgSel) || imgSel == '') ? service.data.formats[0] : imgSel;
      service.selected.format = imgSel;
      if (service.type != 'WFS') {
        cadena += '		<div class="serviceLayer-options">';
        cadena += '		<label>Imagen</label>';
        cadena += '			<select id="serviceLayer_' + service.id + '_formats" class="serviceComboFormat" idref="' + service.id + '">';
        for (var x in formats) {
          var format = formats[x];
          if (format.indexOf('/') >= 0)
            format = formats[x].split('/')[1];

          var selected = (formats[x] == imgSel) ? 'selected="selected"' : '';
          cadena += '			<option  val="' + formats[x] + '" idref="' + service.id + '" class="serviceLayer-combo" ' + selected + '>' + format.toUpperCase() + '</option>';
        }
        cadena += '			</select>';
        cadena += '		</div>';
      }
      var srsSel = service.selected.srs;
      srsSel = ((!srsSel) || srsSel == '') ? service.data.srs[0] : srsSel;
      service.selected.srs = srsSel;

      cadena += '		<div class="serviceLayer-options">';
      cadena += '		<label>Proyecci&oacute;n</label>';
      cadena += '		<select id="serviceLayer_' + service.id + '_srs" class="serviceComboSRS" idref="' + service.id + '">';
      var srs = service.data.srs;
      for (var x in srs) {
        var proj = srs[x];
        var selected = (srs[x] == srsSel) ? 'selected="selected"' : '';
        cadena += '			<option  val="' + proj + '" idref="' + service.id + '" class="serviceLayer-combo" ' + selected + '>' + proj.toUpperCase() + '</option>';
      }
      cadena += '			</select>';
      cadena += '		</div>'

      cadena += '</div>';
      //transparencia tool
      cadena += '<div class="serviceLayer-transparencyTool-container" title="Control de transparencia">';
      cadena += '	<span class="layerDisplay-sprite layerDisplay-iconCircleBlank_a"/>';
      cadena += '	<div id="serviceLayer_' + service.id + '_tranparency" idref="' + service.id + '" val="' + service.opacity + '" class="serviceLayer-transparencyTool"></div>';
      cadena += '	<span class="layerDisplay-sprite layerDisplay-iconCircleFill_a"/>';
      cadena += '</div>';
      //cloud filter
      cadena += '<div class="serviceLayer-filterTools">';
      cadena += '	<div id="serviceLayer_filterTools_' + service.id + '" class="serviceLayer-filterBtns">'
      //cadena+= '		<span idref="'+service.id+'" class="serviceLayer-cloudBtn layerDisplay-sprite layerDisplay-iconZoom_a" title="Buscar elementos" />';
      cadena += '	</div>';
      cadena += '</div>';

      cadena += '	<ul id="serviceLayer_' + service.id + '_layersContent" class="serviceLayer-layerList" idref="' + service.id + '">';
      var layers = service.data.layers;
      for (var x in layers) {
        var layer = layers[x];
        var isSelected = '';
        var isValid = (layer.formats.join().indexOf(service.selected.format) >= 0) ?
          (layer.srs.join().indexOf(service.selected.srs) >= 0) ? true : false : false;

        if (isValid) { //la capa tiene un formato y proyeccion contenido en el universo del servicio
          var slayers = service.selected.layers;
          for (var y in slayers) {
            if (slayers[y].id == layer.id) {
              isSelected = 'checked="checked"';
              break;
            }
          }

          var formats = '';
          for (var y in layer.formats) {
            var format = layer.formats[y];
            if (format.indexOf('/') >= 0)
              format = format.split('/')[1];

            formats += ' ' + format.toUpperCase();
          }
          cadena += '		<li class="ui-state-default" id="' + service.id + '_' + layer.id + '" idservice="' + service.id + '" layername="' + layer.layer + '" idref="' + layer.id + '" tit="' + layer.title + '" formats="' + layer.formats.join() + '" >';
          cadena += '			<span class="ui-icon ui-icon-arrowthick-2-n-s"></span>';
          cadena += '			<label for="' + service.id + '_' + layer.id + '_layer">' + layer.title + '</label>';
          cadena += '			<input type="checkbox" ' + isSelected + ' class="serviceLayer-layerList-layerCheck" id="' + service.id + '_' + layer.id + '_layer" layerid="' + layer.id + '" idref="' + service.id + '" srs="' + layer.srs + '" formats="' + layer.formats.join() + '"/>';
          cadena += '			<label for="' + service.id + '_' + layer.id + '_layer" class="serviceLayer-layerList-formats">' + formats + '</label>';
          cadena += '		</li>';
        }
      }
      cadena += '	</ul>';

      cadena += '</div>';

      return cadena;
    }
    var cadena = '';
    for (var x in services) {
      var service = services[x];
      cadena += createItem(service);
    }
    $('#layerDisplay_serviceListContent').html(cadena);

    $('.serviceLayer-cloudBtn').each(function (index, element) {
      $(this).click(function () {
        obj.createCloudSelection($(this).attr('idref'));
      });
    });
    $('.serviceLayer-closeBtn').each(function (index, element) {
      $(this).click(function () {
        var idref = $(this).attr('idref');
        obj.deleteService(idref);
      });
    });
    $('.serviceLayer-inputName').each(function (index, element) {
      $(this).keydown(function (event) {
        if (event.which == 13) {
          var idref = $(this).attr('idref');
          $('.serviceLayer-editName-ok[idref=' + idref + ']').click();
          event.preventDefault();
        }
      });
    });



    $('.serviceLayer-checkService').click(function () {
      var val = $(this).is(':checked');
      obj.changeService({ active: val }, $(this).attr('idref'));
      var service = obj.getService($(this).attr('idref'));
      $(this).prop('checked', service.active);
    });

    $('.serviceLayer-editName').each(function (index, element) {
      $(this).click(function () {
        var idref = $(this).attr('idref');
        $(this).css('display', 'none');
        $('.serviceLayer-name[idref=' + idref + ']').css('display', 'none');

        $('.serviceLayer-editName-ok[idref=' + idref + ']').css('display', '');
        $('.serviceLayer-inputName[idref=' + idref + ']').css('display', '').focus().select();

      });
    });

    $('.serviceLayer-editName-ok').each(function (index, element) {
      $(this).click(function () {
        var idref = $(this).attr('idref');
        $(this).css('display', 'none');
        $('.serviceLayer-editName[idref=' + idref + ']').css('display', '');
        $('.serviceLayer-name[idref=' + idref + ']').css('display', '');

        $('.serviceLayer-editName-ok[idref=' + idref + ']').css('display', 'none');
        $('.serviceLayer-inputName[idref=' + idref + ']').css('display', 'none');

        var val = $('.serviceLayer-inputName[idref=' + idref + ']').val();
        if (val != '') {
          $('.serviceLayer-name[idref=' + idref + ']').html(val);
          obj.changeService({ label: val }, $(this).attr('idref'));
        } else {
          $('.serviceLayer-inputName[idref=' + idref + ']').val($('.serviceLayer-name[idref=' + idref + ']').html());
        }
      });
    });

    $('.serviceLayer-transparencyTool').each(function (index, element) {
      var val = parseFloat($(this).attr('val'), 10);
      $(this).slider({
        min: 0,
        max: 100,
        value: val * 100,
        change: function (event, ui) {
          obj.changeService({ opacity: (ui.value / 100) }, $(this).attr('idref'));
        }
      });
    });
    $('.serviceComboFormat').each(function () {
      $(this).change(function () {
        var _serv = obj.getService($(this).attr('idref'));
        var selected = $('option:selected', this);
        var idref = selected.attr('idref');
        var val = selected.attr('val');
        _serv.selected.layers = [];
        obj.changeService({ selected: { format: val } }, idref);
        obj.printWmsServices();
      });
    })
    $('.serviceComboSRS').each(function () {
      $(this).change(function () {
        var _serv = obj.getService($(this).attr('idref'));
        var selected = $('option:selected', this);
        var idref = selected.attr('idref');
        var val = selected.attr('val');
        _serv.selected.layers = [];
        obj.changeService({ selected: { srs: val } }, idref);
        obj.printWmsServices();
      });
    });

    $('.serviceLayer-layerList').each(function (index, element) {
      $(this).sortable({
        stop: function (event, ui) {
          var items = [];
          var idref = $(this).attr('idref');
          $(this).find('li').each(function (index, element) {
            var isActive = $('#' + $(this).attr('idservice') + '_' + $(this).attr('idref') + '_layer').is(':checked');
            if (isActive) {
              items.push({ layer: $(this).attr('idref'), title: $(this).attr('tit') });
            }
          });
          obj.changeService({ selected: { layers: items } }, idref);
        }
      });
      $(this).disableSelection();
    });
    $('.serviceLayer-layerList-layerCheck').each(function (index, element) {
      $(this).click(function () {
        var idref = $(this).attr('idref');
        var layerid = $(this).attr('layerid');

        var service = obj.getService(idref);
        var s_layer = obj.getLayerService(idref, layerid);

        obj.clickOnServiceLayer(service, s_layer);
      });
    });

  },
  clickOnServiceLayer: function (service, layer) {
    var obj = this;
    var type = service.type;
    var l_sel = $.extend(true, [], service.selected.layers);
    var d_layer = $('#' + service.id + '_' + layer.id + '_layer');
    var d_service = $('.serviceLayer-checkService[idref=' + service.id + ']');

    if (d_layer.is(':checked')) {
      var okFormat = (layer.formats.join().search(service.selected.format) >= 0);
      var okSrs = (layer.srs.join().search(service.selected.srs) >= 0);
      if (okFormat && okSrs) {
        if (/WMS|WMTS/.test(type)) { //formatos que soportan multiseleccion
          l_sel.push(layer);
        } else { //seleccion de capa unica
          for (var x in l_sel)
            $('#' + service.id + '_' + l_sel[x].id + '_layer').prop('checked', false);
          l_sel = [layer];
        }
      } else {
        $('#' + service.id + '_' + layer.id + '_layer').prop('checked', false);
      }
    } else {
      for (var x in l_sel) {
        if (l_sel[x].id == layer.id) {
          l_sel.splice(x, 1);
          break;
        }
      }
    }
    obj.changeService({ selected: { layers: l_sel } }, service.id);
    service = obj.getService(service.id);
    d_service.prop('checked', service.active);
  },
  loadWmsList: function (list, index) {
    var obj = this;
    index = (index) ? index : 0;

    if (list.length > 0 && index <= (list.length - 1)) {

      var service = list[index];
      var newService = {
        type: service.type,
        url: service.path
      }
      obj.addService(newService, function (data) {
        var t_service = obj.wmsLayers.pop();
        t_service.selected = service.selected;
        t_service.active = service.active;
        t_service.opacity = service.opacity;
        t_service.label = service.label;
        t_service.type = service.type;

        obj.wmsLayers.push(t_service);


        if (index == (list.length - 1)) {
          obj.serviceChanged();
          obj.printWmsServices();
        } else {
          index++;
          obj.loadWmsList(list, index);
        }

      })//spinner(true);

    }
  },
  getWmsServices: function () {
    var obj = this;
    var services = obj.wmsLayers;
    var list = [];

    for (var x in services) {
      var service = services[x];
      var values = {};
      values.selected = service.selected;
      values.active = service.active;
      values.opacity = service.opacity;
      values.label = service.label;
      values.path = service.path;
      values.type = service.type;
      list.push(values);
    }
    return list;
  },
  serviceChanged: function () {
    var obj = this;
    var services = obj.wmsLayers;
    var map = obj.options.map;

    clearTimeout(obj.timer)
    obj.timer = setTimeout(function () {
      map.Service.event({ action: 'set', data: services });
    }, 1000);
    obj.listLayersSelected();
    obj.printLayerSelectedList();
  },
  changeService: function (valObj, id) {
    var obj = this;
    var services = obj.wmsLayers;
    var service = obj.getService(id);
    var root = obj.getService(id);
    if (service) {
      var sub = valObj.selected;
      if (sub) {
        valObj = sub;
        service = service.selected;
      }
      for (var x in valObj) {
        service[x] = valObj[x];
      }
      //el servicio será activo solo si hay almenos una capa seleccionada
      root.active = (root.selected.layers.length > 0) ? root.active : false;
      if ((sub && sub.format) || (sub && sub.srs) || (!sub && !(valObj.active === undefined))) { //si se cambio el formato se reviza integridad
        obj.verifyIntegrityService(id);
      }
    }
    obj.serviceChanged();
  },
  verifyIntegrityService: function (id) {
    var obj = this;
    var service = obj.getService(id);
    var format = service.selected.format;
    var srs = service.selected.srs;
    var slayers = service.selected.layers;
    var nlayers = [];
    for (var x in slayers) {
      var slayer = slayers[x];
      if (
        (slayer.formats.join().indexOf(format) >= 0) && //si el formato existe para la capa
        (slayer.srs.indexOf(srs) >= 0) //si la proyeccion existe para la capa
      ) {
        nlayers.push(slayer);
      } else {
        $('#' + id + '_' + slayer.id + '_layer').prop('checked', false);
      }
    }
    if (slayers.length == 0) {
      service.active = false;
    }

    $('#serviceLayer_check_' + id).prop('checked', service.active);
    $('#layerDisplay_selectedService_check_' + id).prop('checked', service.active);
    $('#layerDisplay_selectedService2_check_' + id).prop('checked', service.active);

    obj.options.onRefreshLists({ layers: obj.selectedLayers, services: obj.selectedServices, outlayers: obj.countOutLayers() });

    slayers = nlayers;
  },
  deleteService: function (id) {
    var obj = this;
    var map = obj.options.map;
    var services = obj.wmsLayers;
    var index = null;
    for (var x in services) {
      if (services[x].id == id) {
        index = x;
        break;
      }
    }
    if (index) {
      clearTimeout(obj.timer); //detiene refresco de capas de servicios
      var delItem = $.extend({}, services[index]);
      services.splice(index, 1);
      map.Service.event({ action: 'delete', data: [delItem] });

      obj.listLayersSelected();
      obj.printLayerSelectedList();
      obj.printWmsServices();
    }
  },
  getService: function (id) {
    var obj = this;
    var services = obj.wmsLayers;
    var r = null;
    for (var x in services) {
      if (services[x].id == id) {
        r = services[x];
        break;
      }
    }
    return r;
  },
  getLayerService: function (service, idlayer) {
    var obj = this;
    var services = obj.wmsLayers;
    var r = null;
    for (var x in services) {
      if (services[x].id == service) {
        var list = services[x].data.layers;
        for (var y in list) {
          var layer = list[y];
          if (layer.id == idlayer) {
            r = layer;
            break;
          }
        }
      }
    }
    return r;
  },
  addService: function (service, func) {
    var obj = this;
    var map = obj.options.map;
    obj.checkService(service, function (data) {
      if (!data.valid) {
        obj.spinner(true, 'Servicio inv&aacute;lido');
        setTimeout(function () { obj.spinner(false); }, 1500);
      } else {
        if (!obj.getService(data.id)) {

          if (data.data.formats.length == 0) {
            var format = ['feature/F'];
            var layers = data.data.layers;

            data.data.formats = format;
            for (var x in layers) {
              layers[x].formats = format;
            }
          }


          data.selected.format = data.data.formats[0];
          data.selected.srs = data.data.srs[0];

          data.active = false;
          for (var x in data.data.layers) {
            data.data.layers[x].id = data.data.layers[x].layer.asId() + '_' + x;
          }
          obj.wmsLayers.push(data);

          obj.listLayersSelected();
          obj.printLayerSelectedList();
          obj.printWmsServices();
          if ($.isFunction(func)) {
            setTimeout(function () {
              func(data);
            }, 500);
          }
        } else {
          alert('El servicio que intenta agregar, contiene el mismo ID de uno que actualmente esta ya agregado');
        }
      }
    })
  },
  checkService: function (service, func) {
    var obj = this;
    service.path = service.url;
    var map = obj.options.map;

    var params = {
      action: 'get',
      catchEvent: function (data) {
        $('#layerDisplay_newServiceUrl').val('');
        obj.spinner(false);
        if ($.isFunction(func)) {
          func(data);
        }
      }
    };
    for (var x in service) {
      params[x] = service[x];
    }


    obj.spinner(true, 'Verificando servicio...')
    map.Service.event(params);
  },
  createCloudSelection: function (id) {
    var obj = this;
    var service = obj.getService(id);
    var layers = service.data.layers;
    var cloud = {};

    var applyFilterText = function (text) {
      var cloud = obj.cloud;
      text = text.asId();
      if (text.length > 2) {
        for (var x in cloud) {
          if (x.search(text) < 0) {
            $('.layerDisplay-cloudItem[idref=' + x + ']').hide();
          } else {
            $('.layerDisplay-cloudItem[idref=' + x + ']').show();
          }
        }
      } else {
        $('.layerDisplay-cloudItem').each(function () {
          $(this).show();
        });
      }
    };

    var domParent = $('#serviceLayer_' + service.id);
    var mainContainer = $('.layerDisplay-body').width();
    var pos = domParent.position();
    var sidePos = (pos.left + 430 > mainContainer) ? 'Left' : 'Right';

    var max = 0;
    for (var x in layers) {
      var layer = layers[x];
      var words = layer.title.replace(/_/g, ' ').split(' ');
      for (var y in words) {
        var word = words[y].asId();
        var testVals = ['el', 'la', 'los', 'las', 'a', 'ante', 'va', 'bajo', 'con', 'contra', 'de', 'desde', 'hasta', 'hacia', 'para', 'por', 'sin', 'son', 'sobre', 'tras']
        if (testVals.indexOf(word) < 0) {
          var item = cloud[word];
          if (!item) {
            cloud[word] = { label: words[y], count: 0, list: [] }
            item = cloud[word];
          }
          item.count++;
          item.list.push(layer.id);
          if (item.count > max) max = item.count;
        }
      }
    }
    obj.cloud = cloud;
    var cloudText = '';
    for (var x in cloud) {
      var item = cloud[x];
      var size = item.count * (60 / max); //maximo valor de tamaño de fuente
      var colorElem = ((max - item.count) * (60 / max));
      //var color = 'background-color:rgb('+colorElem+','+colorElem+','+colorElem+');'
      var color = 'background-color:rgb(' + (60 + colorElem) + ',' + (99 + colorElem) + ',255);'
      cloudText += '<div idref="' + x + '" class="layerDisplay-cloudItem" style="font-size:' + (Math.round(100 + size)) + '%;' + color + '" title="' + item.count + ' ocurrencia(s)">' + item.label + '</div>'
    }

    $('.layerDisplay-cloud-container').remove();

    var cadena = '<div class="layerDisplay-cloud-container cloudSide' + sidePos + '">';
    cadena += '	<input type="text" id="layerDisplay_cloud_input" class="layerDisplay-cloud-title" placeholder="Buscar elementos"/>';
    cadena += '	<span class="layerDisplay-cloud-clearInput ui-icon ui-icon-close" />';
    cadena += '	<span class="layerDisplay-cloud-close layerDisplay-sprite layerDisplay-iconClose-s" />';
    cadena += '	<div class="layerDisplay-cloud" idref="' + id + '">' + cloudText + '</div>';
    cadena += '	<div class="layerDisplay-cloud-detail" idref="' + id + '"></div>';
    cadena += '</div>';

    $('#serviceLayer_cloudContainer' + id).append(cadena);

    obj.setInputText('layerDisplay_cloud_input', function (text) {
      setTimeout(function () {
        var text = $('#layerDisplay_cloud_input').val();
        applyFilterText(text);
      }, 20);
    });

    $('.layerDisplay-cloud-clearInput').click(function () {
      $('#layerDisplay_cloud_input').val();
      applyFilterText('');
    });

    $('.layerDisplay-cloud-close').click(function () {
      $('.layerDisplay-cloud-container').remove();
      $('#serviceLayer_' + id + '_layersContent li').each(function (index, element) {
        $(this).css('display', '');
      });
    });
    $('.layerDisplay-cloudItem').each(function (index, element) {
      $(this).click(function () {
        if ($(this).attr('selected')) {
          $(this).removeAttr('selected');
          $('#serviceLayer_' + id + '_layersContent li').each(function (index, element) {
            $(this).css('display', '');
          });
        } else {
          $('.layerDisplay-cloudItem[selected=selected]').removeAttr('selected');
          $(this).attr('selected', 'selected');
          var idref = $(this).attr('idref');

          $('#serviceLayer_' + id + '_layersContent li').each(function (index, element) {
            $(this).css('display', 'none');
          });
          var items = obj.cloud[idref].list;
          for (var x in items) {
            $('#' + id + '_' + items[x]).css('display', '');
          }
        }
      });
    });

  },
  controlSpinner: function (data) {
    var obj = this;
    obj.spinner(data.status, data.label);
  },
  spinner: function (status, label) {
    var obj = this;
    label = label || 'procesando...';
    if (status) {
      if ($('#layerDisplay_serviceSpinner').attr('id')) {
        $('.layerDisplay-serviceSpinner-label').html(label);
      } else {
        var cadena = '<div id="layerDisplay_serviceSpinner" class="layerDisplay-serviceSpinner">';
        cadena += '		<div class="layerDisplay-serviceSpinner-bg"></div>';
        cadena += '		<div class="layerDisplay-serviceSpinner-center">';
        cadena += '			<div class="layerDisplay-serviceSpinner-content"><center>';
        cadena += '				<div class="layerDisplay-serviceSpinner-img"></div>';
        cadena += '				<div class="layerDisplay-serviceSpinner-label">' + label + '</div>';
        cadena += '			</center></div>';
        cadena += '		</div>';
        cadena += '</div>';

        $('body').append(cadena);
      }
    } else {
      $('#layerDisplay_serviceSpinner').remove();
    }

  },
  //WMS Form
  getWmsForm: function () {
    var obj = this;
    var layers = obj.wmsLayers;
    var cadena = '';
    cadena += '<div class="layerDisplay-addService">';
    cadena += '	<label></label>';
    cadena += '	<input id="layerDisplay_newServiceUrl" placeholder="Dirección web del servicio" type="text" value="" />';
    cadena += '	<div id="layerDisplay_addService_btn" class="layerDisplay-addService-btn" title="Agregar nuevo servicio"><span class="ui-icon ui-icon-plusthick"></span></div>';
    cadena += '	<span id="layerDisplay_serviceTypes">';
    cadena += '			<input type="radio" value="wms" id="layerDisplay_serviceWms" name="remoteServices" checked="checked"><label for="layerDisplay_serviceWms">WMS</label>';
    cadena += '			<input type="radio" value="wfs" id="layerDisplay_serviceWfs" name="remoteServices"><label for="layerDisplay_serviceWfs">WFS</label>';
    cadena += '			<input type="radio" value="wmts" id="layerDisplay_serviceWmts" name="remoteServices"><label for="layerDisplay_serviceWmts">WMTS</label>';
    cadena += '			<input type="radio" value="tms" id="layerDisplay_serviceTms" name="remoteServices"><label for="layerDisplay_serviceTms">TMS</label>';
    cadena += '	</span>';
    cadena += '	<span id="layerDisplay_serviceVer" style="display:none">';
    cadena += '			<input type="radio" value="1.0.0" id="layerDisplay_service100" name="remoteVer" checked="checked"><label for="layerDisplay_service100">ver 1.0.0</label>';
    cadena += '			<input type="radio" value="1.1.0" id="layerDisplay_service110" name="remoteVer"><label for="layerDisplay_service110">ver 1.1.0</label>';
    cadena += '			<input type="radio" value="1.1.1" id="layerDisplay_service111" name="remoteVer"><label for="layerDisplay_service111">ver 1.1.1</label>';
    cadena += '	</span>';
    cadena += '	<div id="layerDisplay_serviceListContent" class="layerDisplay-serviceListContent">';
    cadena += '		<div class="layerDisplay-editService">';
    cadena += '		</div>';
    cadena += '	</div>';
    cadena += '</div>';


    return cadena;
  },
  //External Layers Creation
  createNewLayer: function (layer) {
    var obj = this;
    var outLayers = obj.outLayers;
    var groupData = layer.group;

    var group = outLayers[groupData.idGroup];
    if (!group) {
      outLayers[groupData.idGroup] = {
        list: [],
        id: groupData.idGroup,
        label: groupData.labelGroup,
        onChange: groupData.onChange
      };
      group = outLayers[groupData.idGroup];
    }

    var list = group.list;
    var found = false;
    for (var x in list) {
      var item = list[x];
      if (item.id == layer.id) {
        found = true;
        item.active = true;
      }
    }
    if (!found) {
      layer.active = true;
      list.push(layer);
    }

    if ($.isFunction(group.onChange))
      group.onChange(group);

    obj.printOutLayers();

    //make it blink
    setTimeout(function () {
      $('#container_' + layer.id + '_outlayer').addClass('blink_it');
      setTimeout(function () {
        $('#container_' + layer.id + '_outlayer').removeClass('blink_it');
      }, 3000);
    }, 300);
    obj.openShortList();
  },
  printOutLayers: function () {
    var obj = this;
    var outLayers = obj.outLayers;


    var cadena = '';
    for (var x in outLayers) {
      var group = outLayers[x];
      var list = group.list;
      var label = group.label;
      if (list.length > 0) { //solo imprime grupos con capas
        cadena += '  <div class="shortList-outLayer-group">';
        cadena += '  	<div class="tool">';
        cadena += '  		<label>Capas ' + label + '</label>';
        cadena += '  	</div>';
        cadena += '  	<div id="' + group.id + '_outlayer" class="container">';

        for (var y in list) {
          var item = list[y];

          var strLayer = '';
          var label = item.name;
          var position = item.position;
          var active = item.active;

          var displayStatus = (active) ? 'layerDisplay-iconEye_a' : 'layerDisplay-iconEye_d';
          var btnClose = '<button alt="Remover capa" outlayer="true" title="Remover capa" pos="' + y + '" id="outLayer_' + item.id + '" idref="' + item.id + '" idGroup="' + group.id + '" class="layerDisplay-sprite layerDisplay-iconClose2 layerDisplay-transparentBtn outLayer_btnCloseShortcut"></button>';
          var btnDisplay = (item.isText === undefined) ? '<button alt="Visualizar/Ocultar capa" outlayer="true"  pos="' + y + '" title="Visualizar/Ocultar capa" id="outLayer_' + item.id + '_show" idref="' + item.id + '" idGroup="' + group.id + '" class="layerDisplay-sprite ' + displayStatus + ' layerDisplay-transparentBtn outLayer_btnShowShortcut"></button>' : '<div class="layerDisplay-btnSpace"></div>';
          //
          strLayer += '<div class="layerDisplay-layerSelected-2 shadow" outlayer="true" layer="' + item.id + '" id="container_' + item.id + '_outlayer">' + btnClose + btnDisplay + '<label id="outlayer_' + item.id + '_label">' + label + '</label></div>';
          //    
          cadena += strLayer;

        }
        cadena += '  	</div>';
        cadena += '  </div>';
      }

    }
    $('#shortList_outlayers_group').html(cadena);


    $('.outLayer_btnCloseShortcut').each(function () {
      var layer = $(this).attr('idref');
      var group = $(this).attr('idgroup');
      var pos = parseInt($(this).attr('pos'), 10);
      var value = $(this).hasClass('layerDisplay-iconEye_a');
      var outlayer = $(this).attr('outlayer');

      $(this).click(function (e) {
        if (!outlayer) {
          obj.selectedLayers.splice(pos, 1);
          obj.closeLayer(group, layer);
          e.stopPropagation();
        } else {
          obj.closeOutLayer(group, pos);
        }
      })
    });

    $('.outLayer_btnShowShortcut').each(function () {
      var layer = $(this).attr('idref');
      var group = $(this).attr('idgroup');
      var value = $(this).hasClass('layerDisplay-iconEye_a');
      var outlayer = $(this).attr('outlayer');
      $(this).click(function (e) {
        if (!outlayer) {
          obj.setCheckLayer(group, layer, !value);
        } else {
          var pos = parseInt($(this).attr('pos'), 10);
          obj.setCheckOutLayer(group, pos, !value);
        }
        e.stopPropagation();
      })
    });

  },
  countOutLayers: function () {
    var obj = this;
    var outLayers = obj.outLayers;
    var list = [];
    for (var x in outLayers) {
      var layers = outLayers[x].list;
      for (var y in layers) {
        list.push(layers[y]);
      }
    }
    return list;
  },
  setCheckOutLayer: function (group, layer, value) {
    var obj = this;
    var outLayers = obj.outLayers;
    var group = outLayers[group];
    var list = group.list;
    var item = list[layer];
    item.active = value;

    if ($.isFunction(group.onChange))
      group.onChange(group);

    obj.printAllLayers();
  },
  closeOutLayer: function (group, pos) {
    var obj = this;
    var outLayers = obj.outLayers;
    var group = outLayers[group];
    var list = group.list;
    list = list.splice(pos, 1);

    if ($.isFunction(group.onChange))
      group.onChange(group);

    obj.printAllLayers();
  },
  // called when created, and later when changing options
  _refresh: function () {
    // trigger a callback/event
    this._trigger("change");
  },


  // events bound via _on are removed automatically
  // revert other modifications here
  _destroy: function () {
    var obj = this;
    // remove generated elements
    this.element
      .removeClass("custom-layerDisplay")
      .enableSelection()
      .css("background-color", "transparent");
    $('#' + obj.id + '_shortList').remove();
  },

  // _setOptions is called with a hash of all options that are changing
  // always refresh when changing options
  _setOptions: function () {
    // _super and _superApply handle keeping the right this-context

    this._refresh();
  },

  // _setOption is called for each individual option that is changing
  _setOption: function (key, value) {
    // prevent invalid color values
    //if ( /red|green|blue/.test(key) && (value < 0 || value > 255) ) {
    //  return;
    //}
    this._super(key, value);
  },
  getData: function (url, params, callback, error, before, complete) {
    var obj = this;
    $.ajax({
      type: obj.options.postType,
      dataType: obj.options.dataType,
      url: url,
      data: params,
      success: function (json, estatus) { callback(json, estatus) },
      beforeSend: function (solicitudAJAX) {
        if ($.isFunction(before)) {
          before(params);
        }
      },
      error: function (solicitudAJAX, errorDescripcion, errorExcepcion) {
        if ($.isFunction(error)) {
          error(errorDescripcion, errorExcepcion);
        }
      },
      complete: function (solicitudAJAX, estatus) {
        if ($.isFunction(params)) {
          complete(solicitudAJAX, estatus);
        }
      }
    });
  }

  
});


