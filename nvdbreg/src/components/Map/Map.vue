<template lang="html">
  <div id="viewDiv" ref="map" @click="logView">
    <map-loader :kartLastet="kartLastet"></map-loader>
    <stedSok @valgt-sted="zoomTil"></stedSok>
    <base-map :baseMap="baseMaps"></base-map>
    <map-objekt-registrering></map-objekt-registrering>
  </div>
</template>

<script>
import { loadModules } from 'esri-loader'
import Search from './Stedssok.vue'
import BaseMap from './BaseMapToggle.vue'
import Loader from './Loader.vue'
import ObjektRegistrering from './ObjektRegistrering.vue'

export default {
  data() {
    return {
      data: 'test',
      kartView: null,
      baseMaps: null,
      mapLayers: null,
      kartLastet: false
    }
  },
  components: {
    stedSok: Search,
    baseMap: BaseMap,
    mapLoader: Loader,
    mapObjektRegistrering: ObjektRegistrering
  },
  methods: {
    zoomTil(pos) {
      console.log(pos);
      loadModules([
        'esri/Graphic',
        'esri/geometry/Point',
        'esri/Viewpoint'
      ]).
      then(([Graphic, Point, Viewpoint])=> {
        var grafikk = new Graphic({
          geometry: new Point({
              x: pos.x,
              y: pos.y,
              spatialReference: {
                wkid: 25833
              }
            }),
          symbol: {
              type: "simple-marker",
              outline: {
                  width: 1.75,
                  color: [255, 0, 0, 1]
              }
          }
        })
        this.kartView.graphics.removeAll()
        this.kartView.graphics.add(grafikk)
        var viewpoint = new Viewpoint({
          targetGeometry: grafikk.geometry,
          scale: 30000,
          heading: 20,
          tilt: 50
        })

        var options = {
          easing: "in-out-cubic",
        }
        this.kartView.goTo(viewpoint, options)
      })
      // zoomTo(pos)
    },
    logView(evt){
      console.log(this.kartView.toMap({x:evt.clientX, y:evt.clientY}));
    }
  },
  created() {
    loadModules([
      'esri/Map',
      'esri/layers/TileLayer',
      'esri/layers/FeatureLayer',
      'esri/layers/MapImageLayer',
      'esri/Basemap',
      'esri/layers/ElevationLayer',
      'esri/views/MapView',
      'esri/Graphic',
      'esri/Viewpoint',
      'esri/geometry/Point',
      'esri/geometry/Polygon',
      'esri/geometry/Circle',
      'esri/layers/GraphicsLayer',
      'esri/symbols/PictureMarkerSymbol',
      'dojo/on',
      'esri/config',
      'esri/core/promiseUtils'
      ]).
      then(([
             Map, TileLayer, FeatureLayer, MapImageLayer, Basemap, ElevationLayer,
             MapView, Graphic, Viewpoint, Point, Polygon,
             Circle, GraphicsLayer, PictureMarkerSymbol, on,
             esriConfig, promiseUtils
           ]) => {

       esriConfig.request.corsEnabledServers.push("www.norgeskart.no");
       esriConfig.request.corsEnabledServers.push("ws.geonorge.no");
       esriConfig.request.corsEnabledServers.push("www.vegvesen.no");
        // create map with the given options at a DOM node w/ id 'mapNode'

        let nvdbBasemap = new TileLayer({
          url: 'https://nvdbcache.geodataonline.no/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer',
          id: 'NVDB-trafikk',
          visible: false
        })
        let bilder = new TileLayer({
          url: 'https://services.geodataonline.no/arcgis/rest/services/Geocache_UTM33_EUREF89/GeocacheBilder/MapServer',
          id: 'Bilder',
          visible: true
        })

        let baseLayers = [bilder, nvdbBasemap]

        let bakgrunnsKart = new Basemap({
          baseLayers: baseLayers,
          title: 'Bakgrunnskart',
          id: 'bakgrunnskart'
        });

        let map = new Map({
          basemap: bakgrunnsKart
        });

        let view = new MapView({
          container: this.$refs.map,
          map: map
        });

        view.center = [679740.6418199595, 7564951.3128187675];
        view.zoom = 5;


        view.constraints.rotationEnabled = false
        view.ui.move('zoom', 'top-right')

        console.log('Map loaded', view);
        view.when(() => {
          this.kartLastet = true
          this.kartView = view;
          this.baseMaps = view.basemapView.baseLayerViews.items
          console.log(this.baseMaps,"Basemap");
          this.mapLayers = view.layerViews.items
        })
      })
  }
}
</script>

<style lang="css" scoped>
  @import url('https://js.arcgis.com/4.6/esri/css/main.css');

  #viewDiv {
    height: 60vh;
    width: 100%;
    border: 2px solid #ecb140;
    border-radius: 5px;
    position: relative;
  }
</style>
