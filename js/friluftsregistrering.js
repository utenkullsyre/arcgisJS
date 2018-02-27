var kartView
var kart
var diverseResultat
var bakkeLag
var hitResultat
var sketchObjekt
var valgtExtent = {}
var itemVerdier = {}
var lag = {}
var view

require([
  'esri/Map',
  'esri/views/MapView',
  'esri/geometry/Point',
  'esri/geometry/Polygon',
  'esri/Basemap',
  'esri/layers/TileLayer',
  'esri/layers/FeatureLayer',
  'esri/geometry/Extent',
  'esri/geometry/SpatialReference',
  'esri/widgets/LayerList',
  'esri/widgets/Locate',
  'esri/widgets/Search',
  'esri/Graphic',
  'esri/widgets/Sketch/SketchViewModel',
  'esri/layers/ElevationLayer',
  'esri/Ground',
  "esri/geometry/geometryEngineAsync",
  'dojo/on',
  'dojo/dom',
  'esri/config',
  'esri/request',
  'dojo/domReady!'
], function (
  Map, MapView, Point, Polygon, Basemap, TileLayer,
  FeatureLayer, Extent, SpatialReference,
  LayerList, Locate, Search, Graphic, SketchViewModel,
  ElevationLayer, Ground, geometryEngineAsync, on, dom,
  esriConfig, esriRequest
) {
  /************************************************************
   * Creates a new WebMap instance. A WebMap must reference
   * a PortalItem ID that represents a WebMap saved to
   * arcgis.com or an on-premise portal.
   *
   * To load a WebMap from an on-premise portal, set the portal
   * url with esriConfig.portalUrl.
   ************************************************************/
  esriConfig.request.corsEnabledServers.push("www.norgeskart.no");
  esriConfig.request.corsEnabledServers.push("ws.geonorge.no");

  var bilder = new TileLayer({
    url: 'https://services.geodataonline.no/arcgis/rest/services/Geocache_UTM33_EUREF89/GeocacheBilder/MapServer',
    id: 'Bilder',
    visible: false
  })

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

  var topp = new FeatureLayer({
    portalItem: {
      id: "03ecdbb776314ca0b99388156da4cd41"
    },
    visible: true
  })

  var parkering = new FeatureLayer({
    portalItem: {
      id: "5b00dc4c792140f99af2fdd9978384e4"
    },
    visible: true
  })

  var spor = new FeatureLayer({
    portalItem: {
      id: "b00c50e3181c48aa93b2087a6d4d586f"
    },
    visible: true
  })

  var bakke = ElevationLayer({
    url: 'https://services.geodataonline.no/arcgis/rest/services/Geocache_UTM33_EUREF89/GeocacheTerreng/ImageServer'
  })
  bakkeLag = bakke
  var baseMap = new Basemap({
    baseLayers: [bilder, graatone, landskap],
    title: 'Bilder',
    id: 'bilder'
  })

   // Create a Map instance
  var map = new Map({
    basemap: baseMap,
    ground: new Ground({
      layers: [bakke]
    }),
    layers: [topp, parkering, spor]
  })

  kart = map

  console.log(topp);

  var startVindu = new Extent({
    xmin: 359715.6240792491,
    ymin: 7608796.799127923,
    xmax: 635390.8420963518,
    ymax: 7609135.466471925,
    spatialReference: new SpatialReference({wkid: 25833})
  })

  var sokSymbol = {
    type: "simple-marker",
    outline: {
        width: 2.75,
        color: [255, 0, 0, 0.72]
    }
  };


  /************************************************************
   * Set the WebMap instance to the map property in a MapView.
   ************************************************************/
   var pt = new Point({
      x: 557973.7536724593,
      y: 7629743.993260376,
      spatialReference: 25833
    });
  var view = new MapView({
    map: map,
    container: 'viewDiv',
    center: pt,
    zoom: 8
  })

  view.constraints.rotationEnabled = false;
  console.log(geometryEngineAsync);

  view.when(function () {
    topp.watch('loaded', function(newval, oldval) {
      if(newval) {
        view.cursor = 'pointer'
      };
    })
    var vm = new Vue({
      el: '#info-wrapper',
      data: {
        infoSynlig: true,
        registreringSynlig: false,
        velgtoppSynlig: false,
        registrertTopp: null,
        valgttopp: {
          navn: '',
          hoyde: 0,
          beskrivelse: ''
        }
      },
      methods: {
        lukkMeny: function() {
          this.infoSynlig = true;
          this.registreringSynlig = false;
          this.velgtoppSynlig = false;
          view.cursor = 'pointer'
        },
        nyTopp: function () {
          this.infoSynlig = false;
          this.velgtoppSynlig = false;
          this.registreringSynlig = true;
          view.cursor = 'crosshair'
        },
        velgTopp: function () {
          this.infoSynlig = false;
          this.velgtoppSynlig = true;
          this.registreringSynlig = false;
        },
        sendinnTopp: function() {
          var formItems  = document.querySelectorAll('.form-group input, .form-group textarea')
          console.log(formItems);
          var inputResult = {}
          Array.prototype.map.call(formItems, function(obj){
            inputResult[obj.name] = obj.value
          });
          console.log(inputResult);
          this.registrertTopp.attributes = {
            navn: inputResult.toppnavn,
            beskrivelse: inputResult.beskrivelse,
            merknad: inputResult.merknad,
            hoyde: inputResult.hoyde,
            editor: 'klientbruker'
          }
          var edits = {
            addFeatures: [this.registrertTopp]
          }
          topp.applyEdits(edits)
          .then(function(response){
            console.log("Objekt lagt inn", response);
            vm.infoSynlig = true;
            vm.registreringSynlig = false;
            view.graphics.removeAll()
            view.cursor = 'pointer'
          })
          .otherwise(function (error) {
            console.log("Det skjedde en feil ved innlegging", error)
          })
        }
      }
    })
    console.log("Vue instance", vm);
    on(view, 'click', function(event) {
      console.log(event);
      var hittest = {}
      view.hitTest(event)
      .then(function(response){
        hittest = response
        if (response.results.length>0) {
          view.graphics.removeAll();
          setTimeout(function(){
            view.goTo({
              target: hittest.results[0].graphic
            })
          }, 100)
        }
      })

      if (vm.registreringSynlig && hittest.results.length === 0) {
        var pkt = lagEnkeltPkt(event.mapPoint.x, event.mapPoint.y, sokSymbol)
        view.graphics.add(pkt)
        vm.registrertTopp = pkt
        hentHoyde(event.mapPoint.x, event.mapPoint.y)
        .then(function(response) {
          var navn = document.querySelector('[name = toppnavn]');
          var hoyde = document.querySelector('[name = hoyde]');

          navn.value = response.data.placename
          hoyde.value = parseInt(response.data.elevation)
        })
        .otherwise(function(error){
          console.log(error);
        })
      }  else if (hittest.results.length > 0 && hittest.results[0].graphic.layer.title === 'Fjelltopp') {
        if(vm.infoSynlig || vm.velgtoppSynlig){
          var selection = hittest.results[0].graphic
          selection.symbol = {
                type: "simple-marker",
                outline: {
                    width: 3,
                    color: [255, 255, 0, 1]
                },
                size: 23,
                color: [255, 255, 0, 0]
            };
          view.graphics.add(selection)
          event.stopPropagation();
          vm.velgTopp();
          // view.goTo({
          //   target: selection
          // })
          var data = hittest.results[0].graphic.attributes
          vm.valgttopp.navn = data.navn;
          vm.valgttopp.hoyde = data.hoyde;
          vm.valgttopp.beskrivelse = data.beskrivelse;
          console.log(hittest.results[0]);
        }
      }



      //  ---- Hente ut pkt som er innenfor en viss radius av klikk pkt ----
      // topp.queryFeatures()
      // .then(function(test){
      //   var geom = getGeoms(test.features)
      //   var geomUnion
      //   geometryEngineAsync.union(geom)
      //   .then(function(response){
      //     console.log("uniongeom",response);
      //     geomUnion = response
      //     geometryEngineAsync.buffer(event.mapPoint, 1000, "meters")
      //     .then(function(response){
      //       console.log("Buffer", response);
      //       geometryEngineAsync.intersect(response, geomUnion)
      //       .then(function(response){
      //         console.log(response);
      //       })
      //     })
      //   })
      // })
      //  ------Hente ut geometri, slå de sammen og finne nærmeste pkt--------
      // topp.queryFeatures()
      // .then(function(test){
      //   var geom = getGeoms(test.features)
        // geometryEngineAsync.union(geom)
        // .then(function(response){
        //   console.log("Union", response);
        //   geometryEngineAsync.nearestVertex(response, event.mapPoint)
        //   .then(function(response){
        //     console.log("Faen", response);
        //     view.graphics.add(lagEnkeltPkt(response.coordinate.x, response.coordinate.y, sokSymbol))
        //     view.hitTest(view.toScreen(response.coordinate))
        //     .then(function(response) {
        //       console.log();
        //     })
        //   })
        // })
      // })
    })
    console.log(view);
    // topp.queryFeatures().
    // then(function(test){
    //   var geom = getGeoms(test.features)
    //   geometryEngineAsync.union(geom)
    //   .then(function(response){
    //     console.log("Union", response);
    //     geometryEngineAsync.nearestVertex(response, event.mapPoint)
    //   })
    // })
    // view.whenLayerView(topp)
    // .then(function(response){
    //   console.log("Lyrview", response);
    //   console.log("Helvete!!!");
    //   response.when(function(helvete){
    //     console.log(helvete.layer);
    //   }).otherwise(function(error){console.log(error);})
    //   // var faen = grafikk.featuresView.graphics
    //   // console.log(faen);
    //   console.log("FAEAENANNNN", grafikk);
    //   // var geoms = getGeoms(graphics)
    //   // console.log(geoms);
    // })

    // on(view, "pointer-move", function(event){
    //     var pos = view.toMap({
    //       x:event.x,
    //       y:event.y
    //     });
    //     // console.log(pos);
    //     // geometryEngineAsync.buffer(pos, 5000, "feet")
    //     // .then(function(response){
    //     //   // console.log("Bufffer", response);
    //     //   view.graphics.removeAll();
    //     //   var d = lagPolygon(response.rings);
    //     //   view.graphics.add(d)
    //     // })
    // })
    function getGeoms(graphics){
       return graphics.map(function(item, i){
         console.log(item);
          return item.geometry;
       });
    }

    function lagPolygon(rings){
      var grafikk = new Graphic({
        geometry: new Polygon({
          rings: rings,
          spatialReference: { wkid: 25833 }
        }),
        symbol: {
          type: "simple-fill", // autocasts as new SimpleFillSymbol()
          color: [227, 139, 79, 0.8],
          outline: { // autocasts as new SimpleLineSymbol()
            color: [255, 255, 255],
            width: 1
          }
        }
      })

      return grafikk
    }

    function lagEnkeltPkt(x,y,symbol){
      var pt = new Graphic({
        geometry: new Point({
            x: x,
            y: y,
            spatialReference: {
              wkid: 25833
            }
          }),
        symbol: symbol
      })
      return pt
    }

    function hentHoyde(x,y){
      //Finner stedsnavn
      var urlSted = 'https://www.norgeskart.no/ws/elev.py?'
      var options = {
        query: {
          lat: y,
          lon: x,
          epsg: 25833
        }
      }
      return esriRequest(urlSted,options)
    }
  })
})
