var kartView
var kart
var diverseResultat
var bakkeLag
var hitResultat
var sketchObjekt
var itemVerdier = {}
require([
  'esri/Map',
  'esri/views/MapView',
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
  'dojo/domReady!'
], function (
  Map, MapView, Basemap, TileLayer,
  FeatureLayer, Extent, SpatialReference,
  LayerList, Locate, Search, Graphic, SketchViewModel,
  ElevationLayer, Ground
) {
  /************************************************************
   * Creates a new WebMap instance. A WebMap must reference
   * a PortalItem ID that represents a WebMap saved to
   * arcgis.com or an on-premise portal.
   *
   * To load a WebMap from an on-premise portal, set the portal
   * url with esriConfig.portalUrl.
   ************************************************************/
  var nvdbBasemap = new TileLayer({
    url: 'https://nvdbcache.geodataonline.no/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer',
    id: 'NVDB-trafikk'
  })
  var bilder = new TileLayer({
    url: 'https://services.geodataonline.no/arcgis/rest/services/Geocache_UTM33_EUREF89/GeocacheBilder/MapServer',
    id: 'Bilder',
    visible: false
  })

  var linje = new FeatureLayer({
    url: 'https://services1.arcgis.com/oc32TmBcUxTXagmW/ArcGIS/rest/services/Prosjekter___SVV/FeatureServer/0',
    visible: false
  })

  var flate = new FeatureLayer({
    url: 'https://services1.arcgis.com/oc32TmBcUxTXagmW/ArcGIS/rest/services/Prosjekter___SVV/FeatureServer/1',
    visible: false
  })

  var bakke = ElevationLayer({
    url: 'https://services.geodataonline.no/arcgis/rest/services/Geocache_UTM33_EUREF89/GeocacheTerreng/ImageServer'
  })
  bakkeLag = bakke
  var baseMap = new Basemap({
    baseLayers: [nvdbBasemap],
    title: 'NVDB',
    id: 'nvdb'
  })

   // Create a Map instance
  var map = new Map({
    basemap: baseMap,
    ground: new Ground({
      layers: [bakke]
    }),
    layers: [bilder, linje, flate]
  })

  kart = map

  var extent = new Extent({
    xmin: 373601,
    ymin: 7507874,
    xmax: 721751,
    ymax: 7743925,
    spatialReference: new SpatialReference({wkid: 25833})
  })

  /************************************************************
   * Set the WebMap instance to the map property in a MapView.
   ************************************************************/
  var view = new MapView({
    map: map,
    container: 'viewDiv'
  })
  view.constraints.rotationEnabled = false

  var locateWidget = new Locate({
    view: view,   // Attaches the Locate button to the view
    graphic: new Graphic({
      symbol: { type: 'simple-marker' }  // overwrites the default symbol used for the
      // graphic placed at the location of the user when found
    })
  })

  var searchWidget = new Search({
    view: view
  })

  var freehandIcon = document.querySelector('#freehandButton')
  var undoIcon = document.querySelector('#undoButton')

  kartView = view

  view.extent = extent
  view.ui.add('baseToggle', 'bottom-left')
  //  view.ui.add(layerList, 'top-left');

  view.ui.add(locateWidget, 'top-left')
  view.ui.add(searchWidget, {
    position: 'top-right',
    index: 0
  })
  view.ui.add('topbar', 'bottom-right')
  //  test = view;

  view.then(function (evt) {
 // create a new sketch view model
    var sketchViewModel = new SketchViewModel({
      view: view,
      polylineSymbol: { // symbol used for polylines
        type: 'simple-line', // autocasts as new SimpleMarkerSymbol()
        color: '#ED9300',
        width: '4',
        style: 'dash',
        attributes: {
          'Name': 'Test'
        }
      },
      polygonSymbol: { // symbol used for polygons
        type: 'simple-fill', // autocasts as new SimpleMarkerSymbol()
        color: 'rgba(237, 224, 202, 0.57)',
        style: 'solid',
        outline: {
          color: '#ED9300',
          width: '4',
          style: 'dash'
        },
        attributes: {
          'Name': 'Test'
        }
      }
    })

    console.log(sketchViewModel)

    sketchViewModel.on('draw-complete', function (evt) {
      console.log(evt)
      //  TODO:Lag logikk som ikke kopierer kode her
      freehandIcon.classList.add('hide')
      undoIcon.classList.add('hide')
      view.graphics.add(evt.graphic)

      setActiveButton()
    })

    var dragEvent = {}
    view.on('drag', function (evt) {
      if (evt.action === 'start') {
        dragEvent.start = view.toMap(evt.origin)
      } else if (evt.action === 'end') {
        dragEvent.end = view.toMap(evt.origin)
      }
    })

 // ****************************************
 // activate the sketch to create a polyline
 // ****************************************
    var drawLineButton = document.getElementById('polylineButton')
    drawLineButton.onclick = function () {
      freehandIcon.classList.remove('hide')
      undoIcon.classList.remove('hide')
      if (view.graphics.length > 0) {
        if (view.graphics.items[0].symbol.type === 'picture-marker') {
          view.graphics.removeAll()
        }
      }
   // set the sketch to create a polyline geometry
      sketchViewModel.create('polyline')
      sketchViewModel.draw.activeAction._dragEnabled = false
      setActiveButton(this)
    }

 // ***************************************
 // activate the sketch to create a polygon
 // ***************************************
    var drawPolygonButton = document.getElementById('polygonButton')
    drawPolygonButton.onclick = function (event) {
      freehandIcon.classList.remove('hide')
      undoIcon.classList.remove('hide')
      view.graphics.removeAll()
   // set the sketch to create a polygon geometry
      sketchViewModel.create('polygon')
      sketchViewModel.draw.activeAction._dragEnabled = false
      sketchViewModel.draw.activeAction.on('vertex-add', function (evt) {
        if (evt.native.ctrlKey) {
          evt.preventDefault()
        }
      // if(evt.native.offsetY == dragEvent.end.y || evt.native.offsetY == dragEvent.start.y){
      //   evt.preventDefault();
      //   console.log('Det funka!!',evt);
      // }
      })
      setActiveButton(this)
    }

 // **************
 // reset button
 // **************
    document.getElementById('resetBtn').onclick = function () {
      freehandIcon.classList.add('hide')
      undoIcon.classList.add('hide')
      view.graphics.removeAll()
      sketchViewModel.reset()
      setActiveButton()
    }

    freehandIcon.addEventListener('click', function () {
      if (sketchViewModel.draw.activeAction) {
        sketchViewModel.draw.activeAction._dragEnabled = !sketchViewModel.draw.activeAction._dragEnabled
        this.classList.toggle('aktiv')
      }
    })

    undoIcon.addEventListener('click', function () {
      sketchViewModel.draw.activeAction.undo()
    })

    function setActiveButton (selectedButton) {
   // focus the view to activate keyboard shortcuts for sketching
      view.focus()
      var elements = document.querySelectorAll('.aktiv')
      Array.prototype.map.call(elements, function (obj) {
        obj.classList.remove('aktiv')
      })

      if (selectedButton) {
        selectedButton.classList.add('aktiv')
      }
    }
  }).otherwise(function (error) {
  // This function is called when the promise is rejected
    console.error(error)  // Logs the error message
  })

  view.then(function () {
    var baseToggle = document.querySelector('#baseToggle')
    var img = document.querySelectorAll('#baseToggle img')
    var lag = {}

    baseToggle.classList.remove('hide')
    bilder.load().then(function () {
      map.allLayers.items.forEach(function (element) {
        lag[element.title] = element
      })
      baseToggle.addEventListener('click', function () {
        img[0].classList.toggle('hide')
        img[1].classList.toggle('hide')

        lag.GeocacheBilder.visible = !lag.GeocacheBilder.visible
        lag.GeocacheTrafikkJPG.visible = !lag.GeocacheTrafikkJPG.visible
      })
    })
  })

  function oppdaterFeatureLayer (skjemaItems, grafikk, featurelag) {
    Array.prototype.map.call(skjemaItems, function (obj) {
      console.log('\n\n\n', skjemaItems)
      console.log(obj.value, obj.name)
      itemVerdier[obj.name] = obj.value
    })

    var dato = new Date(itemVerdier['aar'], itemVerdier['mnd'] - 1, 1, 12, 0)

    var attributter = {
      'Prosjektnavn': itemVerdier['prosjektnavn'],
      'Vegavdeling': itemVerdier['vegavdeling'],
      'Seksjon': itemVerdier['seksjon'],
      'Epost': itemVerdier['epost'],
      'Kontaktperson': itemVerdier['kontaktperson'].replace(/\b\w/g, function (l) { return l.toUpperCase() }),
      'Ferdigdato': dato
    }

    grafikk.attributes = attributter

    var edits = {
      addFeatures: [grafikk]
    }

    featurelag.applyEdits(edits).otherwise(function (error) {
      console.log(error)
    })
  }

  document.getElementById('sendinn').addEventListener('click', function () {
    console.log('Skjemaitems', skjemaItems)
    console.log('Itemverdier', itemVerdier)
    if (view.graphics.length > 0 && skjemaValidering()) {
      document.querySelector('#prosjektVerdi').innerHTML = document.querySelector('[name="prosjektnavn"]').value
      console.log(view.graphics)
      var grafikk = view.graphics
      var grafikkArray = []

      //  Hvis registrert grafikk er linje, gjør noe logikk
      if (grafikk.items[0].symbol.type === 'simple-line') {
        if (grafikk.length > 1) {
          console.log(grafikk)
        } else {
          grafikkArray = [grafikk.items[0]]
        }

        console.log('Grafikkarray', grafikkArray)
        oppdaterFeatureLayer(skjemaItems, grafikk.items[0], linje)

      //  Hvis registrert grafikk er polygon, gjør noe annen logikk
      } else if (grafikk.items[0].symbol.type === 'simple-fill') {
        oppdaterFeatureLayer(skjemaItems, grafikk.items[0], flate)
      }

      //  Fjern aktiv, åpen og andre markør-klasser
      fjernCss()
      form.reset()
      this.classList.add('active')
      this.nextElementSibling.classList.add('aapen')
      view.graphics.removeAll()
    } else {
      document.querySelector('#kart .errorMessage').innerHTML = '<p>Prosjektinfo er ikke fyllt ut eller stedfestet</p>'
    }
  //  if(view.graphics)
  //  view.graphics.removeAll();
  })
})
