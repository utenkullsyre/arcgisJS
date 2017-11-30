var kartView,kart,diverseResultat, bakkeLag,hitResultat = {};
require([
  "esri/Map",
  "esri/views/MapView",
  "esri/Basemap",
  "esri/layers/TileLayer",
  "esri/layers/FeatureLayer",
  "esri/geometry/Extent",
  "esri/geometry/SpatialReference",
  "esri/widgets/LayerList",
  "esri/widgets/Locate",
  "esri/widgets/Search",
  "esri/Graphic",
  "esri/widgets/Sketch/SketchViewModel",
  "esri/layers/ElevationLayer",
  "esri/Ground",
  "dojo/domReady!"
], function(
  Map,MapView,Basemap,TileLayer,
  FeatureLayer, Extent, SpatialReference,
  LayerList, Locate, Search, Graphic,SketchViewModel,
  ElevationLayer,Ground
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
     url: "https://nvdbcache.geodataonline.no/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer",
     id:"NVDB-trafikk"
   });
  var bilder = new TileLayer({
      url: "https://services.geodataonline.no/arcgis/rest/services/Geocache_UTM33_EUREF89/GeocacheBilder/MapServer",
      id: "Bilder",
      visible: false
    });
    var featureLayer = new FeatureLayer({
      portalItem: {  // autocasts as esri/portal/PortalItem
        id: "1c53fe4f67094bf49fdbae16fcf17641"
      },
      visible:false
    });

    var bakke = ElevationLayer({
      url: "https://services.geodataonline.no/arcgis/rest/services/Geocache_UTM33_EUREF89/GeocacheTerreng/ImageServer"
    });
    bakkeLag = bakke
   var nvdbBasemap = new Basemap({
     baseLayers: [nvdbBasemap],
     title: "NVDB",
     id: "nvdb"
   });

   // Create a Map instance
   var map = new Map({
     basemap: nvdbBasemap,
     ground: new Ground({
       layers: [bakke]
     }),
     layers: [bilder,featureLayer]
   });

  kart = map

  var extent = new Extent({
    xmin: 373601,
    ymin: 7507874,
    xmax: 721751,
    ymax: 7743925,
    spatialReference: new SpatialReference({wkid:25833})
  })

  /************************************************************
   * Set the WebMap instance to the map property in a MapView.
   ************************************************************/
  var view = new MapView({
          map: map,
          container: "viewDiv"
        });
  view.constraints.rotationEnabled = false;


  var locateWidget = new Locate({
    view: view,   // Attaches the Locate button to the view
    graphic: new Graphic({
      symbol: { type: "simple-marker" }  // overwrites the default symbol used for the
      // graphic placed at the location of the user when found
    })
  });

  var searchWidget = new Search({
      view: view
    });

  var layerList = new LayerList({
    view: view
  });



  kartView = view

  view.extent = extent
  view.ui.add("baseToggle","bottom-left");
  //view.ui.add(layerList, "top-left");
  view.ui.add(locateWidget, "top-left");
  view.ui.add(searchWidget, {
      position: "top-right",
      index: 0
    });
    view.ui.add("topbar", "bottom-right");
  //test = view;

  view.then(function(evt) {
 // create a new sketch view model
 var sketchViewModel = new SketchViewModel({
   view: view,
   polylineSymbol: { // symbol used for polylines
     type: "simple-line", // autocasts as new SimpleMarkerSymbol()
     color: "#ED9300",
     width: "4",
     style: "dash",
     attributes:{
       "Name":"Test"
     }
   },
   polygonSymbol: { // symbol used for polygons
     type: "simple-fill", // autocasts as new SimpleMarkerSymbol()
     color: "rgba(237, 224, 202, 0.57)",
     style: "solid",
     outline: {
       color: "#ED9300",
       width: "4",
       style: "dash"
     },
     attributes:{
       "Name":"Test"
     }
   }
 });

 sketchViewModel.on("draw-complete", function(evt) {
   var result = evt.graphic;
   view.graphics.add(evt.graphic);

   setActiveButton();
 });

 // ****************************************
 // activate the sketch to create a polyline
 // ****************************************
 var drawLineButton = document.getElementById("polylineButton");
 drawLineButton.onclick = function() {
   // set the sketch to create a polyline geometry
   sketchViewModel.create("polyline");
   setActiveButton(this);
 };

 // ***************************************
 // activate the sketch to create a polygon
 // ***************************************
 var drawPolygonButton = document.getElementById("polygonButton");
 drawPolygonButton.onclick = function() {
   view.graphics.removeAll();
   // set the sketch to create a polygon geometry
   sketchViewModel.create("polygon");
   setActiveButton(this);
 };

 // **************
 // reset button
 // **************
 document.getElementById("resetBtn").onclick = function() {
   view.graphics.removeAll();
   sketchViewModel.reset();
   setActiveButton();
 };

 function setActiveButton(selectedButton) {
   // focus the view to activate keyboard shortcuts for sketching
   view.focus();
   var elements = document.getElementsByClassName("aktiv");
   for (var i = 0; i < elements.length; i++) {
     elements[i].classList.remove("aktiv");
   }
   if (selectedButton) {
     selectedButton.classList.add("aktiv");
   }
 }
}).otherwise(function(error){
  // This function is called when the promise is rejected
  console.error(error);  // Logs the error message
});

 view.then(function(){
 var baseToggle = document.querySelector("#baseToggle");
 var img = document.querySelectorAll("#baseToggle img");
 var lag = {}

 baseToggle.classList.remove("hide");
 bilder.load().then(function(){
  map.allLayers.items.forEach(function(element){
    lag[element.title] = element;
  })
 baseToggle.addEventListener("click", function(){
   img[0].classList.toggle("hide");
   img[1].classList.toggle("hide");

   lag["GeocacheBilder"].visible = !lag["GeocacheBilder"].visible;
   lag["GeocacheTrafikkJPG"].visible = !lag["GeocacheTrafikkJPG"].visible;


     })
 })
 })

document.getElementById("sendinn").addEventListener("click", function(){
  if(view.graphics.length>0 && skjemaValidering()){

      var grafikk = view.graphics;
      var grafikkArray = []

      //Hvis registrert grafikk er linje, gjør noe logikk
      if(grafikk.items[0].symbol.type == "simple-line"){
        alert("Polyline");
        if (grafikk.length>1){
          console.log(grafikk)
        } else {
          grafikkArray = [grafikk.items[0]]
        }

        var edits = {
          addFeatures: grafikkArray
        };

        featureLayer.applyEdits(edits).otherwise(function(error){
            console.log(error)
          });
      //Hvis registrert grafikk er polygon, gjør noe annen logikk
      } else if(grafikk.items[0].symbol.type == "simple-fill"){
        alert("Polygon");
      }

      //Fjern aktiv, åpen og andre markør-klasser
      fjernCss();
      form.reset();
      this.classList.add("active");
      this.nextElementSibling.classList.add("aapen");




  } else {
    document.querySelector("#kart .errorMessage").innerHTML = "<p>Prosjektinfo er ikke fyllt ut eller stedfestet</p>";
  }
  //if(view.graphics)
  //view.graphics.removeAll();
});

});
