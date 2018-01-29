require([
  'esri/Map',
  'esri/layers/TileLayer',
  'esri/layers/MapImageLayer',
  'esri/Basemap',
  'esri/layers/ElevationLayer',
  'esri/views/SceneView',
  'esri/widgets/Locate',
  'esri/widgets/Search',
  'esri/Graphic',
  'esri/Viewpoint',
  'esri/geometry/Point',
  'esri/widgets/DirectLineMeasurement3D',
  'esri/widgets/Legend',
  'esri/request',
  'esri/geometry/Circle',
  'esri/layers/GraphicsLayer',
  'esri/symbols/PictureMarkerSymbol',
  'dojo/on',
  'esri/config',
  'dojo/domReady!'

], function(
  Map, TileLayer, MapImageLayer, Basemap, ElevationLayer, SceneView,
  Locate, Search, Graphic, Viewpoint, Point, DirectLineMeasurement3D,
   Legend, esriRequest, Circle, GraphicsLayer, PictureMarkerSymbol, on,
    esriConfig
) {
  esriConfig.request.corsEnabledServers.push("www.norgeskart.no");
  // Create elevation layers
  var bakke = new ElevationLayer({
    url: 'https://services.geodataonline.no/arcgis/rest/services/Geocache_UTM33_EUREF89/GeocacheTerreng/ImageServer'
  });

  var bilder = new TileLayer({
      url: 'https://services.geodataonline.no/arcgis/rest/services/Geocache_UTM33_EUREF89/GeocacheBilder/MapServer',
      id: 'Flyfoto',
      visible: false
    });

  var graatone = new TileLayer({
      url: 'https://services.geodataonline.no/arcgis/rest/services/Geocache_UTM33_EUREF89/GeocacheGraatone/MapServer',
      id: 'Gråtone',
      visible: true
    });

    var landskap = new TileLayer({
        url: 'https://services.geodataonline.no/arcgis/rest/services/Geocache_UTM33_EUREF89/GeocacheLandskap/MapServer',
        id: 'Landskap',
        visible: false
      });



  var bratthet = new MapImageLayer({
    url: 'https://wms3.nve.no/map/rest/services/Bratthet/MapServer',
    sublayers: [
        {
          id: 0,
          visible: true,
          opacity: .5,
          legendEnabled: true,
        }
      ]
    });

  var skredHendelser = new MapImageLayer({
    url: 'https://wms3.nve.no/map/rest/services/SkredHendelser/MapServer',
    sublayers: [
        {
          id: 1,
          visible: false,
          legendEnabled: true,
        }
      ]
    });

    var baseLayers = [bilder, graatone, landskap]
    console.log(baseLayers)



   var bilder = new Basemap({
     baseLayers: baseLayers,
     title: 'Bilder',
     id: 'bilder'
   });

  // Create Map and View
  var map = new Map({
    basemap: bilder,
    ground: {
      layers: [bakke]
    }
  });

  var view = new SceneView({
    container: 'viewDiv',
    map: map,
    camera: {
      // initial view:
      heading: 332.8,
      tilt: 30,
      position: {
        x: 564096,
        y: 7628465,
        z: 5000,
        spatialReference: {
          wkid: 25833
        }
      }
    }
  });

  // Create a symbol for rendering the graphic
  var fillSymbol = {
    type: 'simple-fill', // autocasts as new SimpleFillSymbol()
    color: [0, 0, 0, 0],
    outline: { // autocasts as new SimpleLineSymbol()
      color: [241, 33, 0],
      width: 2
    }
  }

  var markerSymbol = {
    type: 'point-3d',  // autocasts as new PointSymbol3D()
    symbolLayers: [{
      type: 'icon',  // autocasts as new IconSymbol3DLayer()
      size: 12,  // points
      resource: { primitive: 'square' },
      material: { color: [165, 201, 213,0.5] },
      outline: {
        color: 'blue',
        size: '1px'
      }
    }]
  };

  var grafikkLag = new GraphicsLayer({
    elevationInfo: 'on-the-ground',
    visible: true,
    title: 'Skredhendelser'
  })

  view.map.addMany([bratthet, skredHendelser, grafikkLag])
  console.log('Lag',view)

  // var measureWidget = new DirectLineMeasurement3D({
  //   view: view
  // });

  var viewElement
  view.when(function () {
    viewElement = document.querySelector('#viewDiv')
    console.log('View',view);

    var viewpoint = new Viewpoint({
      targetGeometry: new Point({
        x: 644831,
        y: 7734548
      }),
      scale: 2000,
      heading: 20,
      tilt: 10
    })

    var legend = new Legend({
      view: view
    })
    view.toolactive = false

    // Add widget to the bottom right corner of the view
    // view.ui.add(legend, 'top-right');
    view.goTo(viewpoint);
    view.ui.move(['zoom','navigation-toggle','compass'], 'top-right')
    view.ui.add('sokInfo', 'top-left')

    // view.ui.add(measureWidget, 'top-right');
    // view.on('click',function(){
    //   console.log(view)
    // });
    // var test = view.activeTool
    // console.log(test)
    // var handle = test.watch('directDistance', function(nyVerdi,gmlVerdi,property,objekt){
    //   if(objekt.verticalDistance){console.log(objekt.horizontalDistance, objekt.verticalDistance)}
    //   console.log(objekt)
    // });

    // view.on('pointer-move',function(evt){
    //   var hoydeDiv = document.querySelector('#hoydeinfo');
    //   hoydeDiv.style.left = evt.x + 10+'px';
    //   hoydeDiv.style.top = evt.y + 10 +'px';
    //
    //   var pos = view.toMap({
    //     x:evt.x,
    //     y:evt.y
    //   });
    //   var hoyde = bakke.queryElevation(pos);
    //   hoyde.then(function(res){
    //     hoydeDiv.innerHTML = res.geometry.z.toFixed(0) + ' moh';
    //   })
    // })

    function queryExtent(pos,d) {
      var extent =  {}
      extent.xmin = pos.x - d
      extent.xmax = pos.x + d
      extent.ymin = pos.y - d
      extent.ymax  = pos.y + d
      return extent
    }


    function copyToClipboard(text) {
      window.prompt('x,y,z koordinat\nSRID: 25833\n\nKopier tekst: Ctrl+C, Enter', text);
    }

    // function queryOptions(){
    //   var options = {
    //     query: {
    //       where: 'skredtype in (130,131,132,133,134,135,136,137,138,139)',
    //       geometry:'{xmin: ' + view.extent.xmin + ', ymin: ' + view.extent.ymin + ', xmax: ' + view.extent.xmax + ', ymax: ' + view.extent.ymax + '}',
    //       geometryType: 'esriGeometryEnvelope',
    //       inSR:28533,
    //       spatialRel: 'esriSpatialRelIntersects',
    //       outFields: 'skredType, skredNavn, stedsnavn, skredTidspunkt, noySkredTidspunkt, persBerort, annetSkadet, redningsaksjon, vaerObservasjon, totAntPersOmkommet, ansvarligInstitusjon, beskrivelse, objektType, registrertDato, utlosningArsak, dokumentasjon',
    //       // outFields: '*',
    //       returnGeometry:true,
    //       returnTrueCurves:false,
    //       outSR:25833,
    //       returnIdsOnly:false,
    //       returnCountOnly:false,
    //       returnZ:false,
    //       returnM:false,
    //       returnDistinctValues:false,
    //       returnExtentsOnly:false,
    //       f: 'geojson',
    //     },
    //     responseType: 'json'
    //   };
    // return options
    // }

    function queryOptions(){
      var options = {
        query: {
          where: 'skredtype in (130,131,132,133,134,135,136,137,138,139)',
          geometry:'{xmin: ' + view.extent.xmin + ', ymin: ' + view.extent.ymin + ', xmax: ' + view.extent.xmax + ', ymax: ' + view.extent.ymax + '}',
          geometryType: 'esriGeometryEnvelope',
          inSR:28533,
          spatialRel: 'esriSpatialRelIntersects',
          // outFields: 'skredType, skredNavn, stedsnavn,vaerObservasjonbeskrivelse, objektType, utlosningArsak, dokumentasjon',
          outFields: '*',
          returnGeometry:true,
          returnTrueCurves:false,
          outSR:25833,
          returnIdsOnly:false,
          returnCountOnly:false,
          returnZ:false,
          returnM:false,
          returnDistinctValues:false,
          returnExtentsOnly:false,
          f: 'geojson',
        },
        responseType: 'json'
      };
    return options
    }

    function addResponseData(item){
            var grafikk = new Graphic({
              geometry: new Point({
                  x: item.geometry.coordinates['0'],
                  y: item.geometry.coordinates['1'],
                  spatialReference: {
                    wkid: 25833
                  }
                }),
              symbol: markerSymbol,
              attributes: item.properties
            })
            grafikkLag.graphics.add(grafikk)
    }

    // function fjernMeny(){
    //   meny.classList.add('gjemt')
    //   setTimeout(function(){
    //     meny.classList.add('skjult')
    //   }, 300)
    // }

    var test = document.querySelector('#verktoyMeny')


    on(view, 'click', function (evt) {
      view.hitTest(evt)
      .then(function (response) {
        var pkt = {
          x: response.results["0"].mapPoint.x,
          y: response.results["0"].mapPoint.y,
        };
        if (response.results.length>0 && response.results[0].graphic) {
          console.log(response)
        }
      //Finner stedsnavn
      var urlSted = 'https://www.norgeskart.no/ws/elev.py?lat=7636351.411620195&lon=551110.8469032602&epsg=25833'
      var options = {
        query: {
          lat: pkt.y,
          lon: pkt.x,
          epsg: 25833
        }
      }
      esriRequest(urlSted,options).then(function(response) {
        vmInfoBoard.stedsNavn = response.data.placename;
        vmInfoBoard.hoyde = response.data.elevation;
        vmInfoBoard.vaerUrl = vmInfoBoard.yrUrl();
        })
      })
    })

    var sidenav = document.querySelector('.sidenav')

    on(document.querySelector('#search span:first-child'),'click', function () {
      openNav()
    })

    var vmInfoBoard = new Vue({
      el: '#sokInfo',
      data: {
        stedsNavn: '',
        hoyde: '',
        vaerUrl: "https://www.yr.no/soek/soek.aspx?sted="
      },
      methods: {
        openNav: function () {
          vmSidebar.menyAapen = true
        },
        yrUrl: function () {
          if(stedsNavn.length>0){
            var url = "https://www.yr.no/soek/soek.aspx?sted=" + stedsNavn
          }
          return url
        }
      }
    })

    var vmSidebar = new Vue({
      el: '#mySidenav',
      data: {
        menyAapen: false,
        aktivtLag: 'Gråtone',
        lag: bratthet,
        lukk: true,
        erAapen: false,
        verktoyAapen: false,
      },
      methods: {
        skiftBakgrunnskart: function () {
          baseLayers[1].visible = !baseLayers[1].visible;
          baseLayers[0].visible = !baseLayers[0].visible;
          this.lukkMeny();
          var result = ''
          baseLayers.forEach(function(element) {
            if (element.visible) {
              result = element.id
            }
          })
          this.aktivtLag = result
        },
        toggleLag: function() {
          bratthet.visible = !bratthet.visible
        },
        lukkMeny: function() {
          vmSidebar.lukkGrupper();
          this.menyAapen = false;
        },
        lukkGrupper: function () {
          vmSidebar.erAapen = false;
          vmSidebar.verktoyAapen = false;
        },
        hentData: function () {
          vmSidebar.menyAapen = false;
          vmSidebar.lukkGrupper();
          // fjernMeny()
          view.toolactive = true
          viewElement.style.cursor = 'crosshair'
          var initCamera = view.camera
          var heading = view.camera.heading;
          var heading = view.camera.tilt;
          view.goTo({
            heading:0,
            tilt: 35,
            scale: view.scale * 3.4
          })
          view.map.zoom = 4
          var tull = on.once(view, 'click', function(evt) {
            var pos1 = view.toMap({
              x: evt.x,
              y: evt.y
            })
            var pos2
            view.graphics.removeAll();
            // on.once(view, 'key-down', function(evt){
            //   if(test){
            //     view.graphics.removeAll()
            //   };
            // })
            var test = on(view, 'pointer-move', function(evt){
              view.graphics.removeAll()
              grafikkLag.graphics.removeAll()
              pos2 = view.toMap({
                x: evt.x,
                y: evt.y
              })
              var polygon = new Graphic({
                geometry: {
                  type: 'polygon',
                  rings: [
                    [pos1.x, pos1.y],
                    [pos1.x, pos2.y],
                    [pos2.x, pos2.y],
                    [pos2.x, pos1.y],
                    [pos1.x, pos1.y]
                  ],
                  spatialReference: {
                    wkid: 25833
                  }
                },
                symbol: fillSymbol
              })
              view.graphics.addMany([polygon])
            })
            var tov = on.once(view, 'click', function(evt){
              evt.stopPropagation()
              view.goTo(initCamera)

              //Hvis enhet ikke har mus så må pkt registreres gjennom museklikk nr2.
              if(!pos2){
                pos2 = view.toMap({
                  x: evt.x,
                  y: evt.y
                })
              }
                var url = 'https://wms3.nve.no/map/rest/services/SkredHendelser/MapServer/1/query?'
                var options = {
                  query: {
                    // where: 'skredtype in (130,131,132,133,134,135,136,137,138,139)',
                    where: '1=1',
                    geometry: '{xmin: ' + pos1.x + ', ymin: ' + pos1.y + ', xmax: ' + pos2.x + ', ymax: ' + pos2.y + '}',
                    geometryType: 'esriGeometryEnvelope',
                    inSR:25833,
                    spatialRel: 'esriSpatialRelIntersects',
                    // outFields: 'skredType, skredNavn, stedsnavn,vaerObservasjonbeskrivelse, objektType, utlosningArsak, dokumentasjon',
                    outFields: '*',
                    returnGeometry:true,
                    returnTrueCurves:false,
                    outSR:25833,
                    returnIdsOnly:false,
                    returnCountOnly:false,
                    returnZ:false,
                    returnM:false,
                    returnDistinctValues:false,
                    returnExtentsOnly:false,
                    f: 'geojson',
                  },
                  responseType: 'json'
                };
                esriRequest(url, options).then(function(response) {
                  var item = response.data.features['0']
                  if(item){
                    console.log(response);
                    response.data.features.forEach(function(obj){
                      addResponseData(obj)
                    })
                  }
                })
              view.graphics.removeAll()
              test.remove()
              tov.remove()
              view.toolactive = false
              viewElement.style.cursor = 'default'
              console.log(vmSidebar);
            })
          })
        },
      }
    })




    // view.on('click', function(evt) {
    //   var hoydeDiv = document.querySelector('#hoydeinfo');
    //
    //   var pos = view.toMap({
    //     x:evt.x,
    //     y:evt.y
    //   });
    //
    //   var extent = queryExtent(pos,50)
    //
    //   var sirkel = new Circle({
    //     center: new Point({
    //       x: pos.x,
    //       y: pos.y,
    //       // z: pos.z + 100, Om man legger til Z vil symbolet automatisk bli plassert 3dimensjonalt
    //       spatialReference: {
    //         wkid: 25833
    //       }
    //     }),
    //     geodesic: false,
    //     radius: 50,
    //     radiusUnit: 'meters',
    //     spatialReference: 25833,
    //     type: 'polygon'
    //   })
    //
    //
    //
    //   var polygonGraphic = new Graphic({
    //     geometry: sirkel,
    //     symbol: fillSymbol
    //   })
    //
    //   // view.graphics.add(polygonGraphic)
    //
    //   console.log('Sirkel', sirkel)
    //
    //   var options = {
    //     query: {
    //       // where: 'skredtype in (130,131,132,133,134,135,136,137,138,139)',
    //       where: '1=1',
    //       geometry:'{xmin: ' + extent.xmin + ', ymin: ' + extent.ymin + ', xmax: ' + extent.xmax + ', ymax: ' + extent.ymax + '}',
    //       geometryType: 'esriGeometryEnvelope',
    //       inSR:25833,
    //       spatialRel: 'esriSpatialRelIntersects',
    //       // outFields: 'skredType, skredNavn, stedsnavn,vaerObservasjonbeskrivelse, objektType, utlosningArsak, dokumentasjon',
    //       outFields: '*',
    //       returnGeometry:true,
    //       returnTrueCurves:false,
    //       outSR:25833,
    //       returnIdsOnly:false,
    //       returnCountOnly:false,
    //       returnZ:false,
    //       returnM:false,
    //       returnDistinctValues:false,
    //       returnExtentsOnly:false,
    //       f: 'geojson',
    //     },
    //     responseType: 'json'
    //   };
    //
    //   var url = 'https://wms3.nve.no/map/rest/services/SkredHendelser/MapServer/1/query?'
    //   esriRequest(url, options).then(function(response) {
    //     var item = response.data.features['0']
    //     if(item){
    //       console.log(item.geometry.coordinates['0'], item.geometry.coordinates['1'], item.properties);
    //       var grafikk = new Graphic({
    //         geometry: new Point({
    //             x: item.geometry.coordinates['0'],
    //             y: item.geometry.coordinates['1'],
    //             spatialReference: {
    //               wkid: 25833
    //             }
    //           }),
    //         symbol: markerSymbol,
    //         attributes: item.properties
    //       })
    //       view.graphics.add(grafikk)
    //     }
    //   })
    //
    //   var hoyde = bakke.queryElevation(pos)
    //   console.log('Høyde',hoyde)
    //   hoyde.then(function(res){
    //     hoydeDiv.innerHTML = 'x: ' + pos.x.toFixed(0) + ' <br />y: ' + pos.y.toFixed(0) + ' <br />moh: ' + res.geometry.z.toFixed(0)
    //
    //     copyToClipboard(pos.x.toFixed(0) + ', ' + pos.y.toFixed(0) + ', extent: ' + extent.xmin.toFixed(0) + ','  + extent.ymin.toFixed(0) + ','  + extent.xmax.toFixed(0) + ','  + extent.ymax.toFixed(0))
    //   })
    // })
  })
})
