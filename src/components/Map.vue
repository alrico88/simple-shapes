<template lang="pug">
.col-lg-8.col-md-7.col-6.vh-100.px-0
  .h-100(:id='id')
</template>

<script>
import uniqueId from 'lodash/uniqueId';
import {parseFromWK} from 'wkt-parser-helper';
import {mapGetters} from 'vuex';
import circle from '@turf/circle';

const tileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',
});

export default {
  data() {
    return {
      id: uniqueId('mapDiv'),
      drawn: null,
    };
  },
  computed: {
    ...mapGetters(['getPolygons']),
  },
  watch: {
    getPolygons(polygons) {
      this.drawPolygons(polygons);
    },
  },
  mounted() {
    this.map = L.map(this.id).setView([0, 0], 3);
    tileLayer.addTo(this.map);
    const drawControl = new L.Control.Draw({
      draw: {
        circlemarker: false,
      },
    });
    this.map.addControl(drawControl);
    const store = this.$store;
    this.map.on('draw:created', (e) => {
      const {layer, layerType} = e;
      let asJSON;
      if (layerType === 'circle') {
        const {lat, lng} = layer._latlng;
        asJSON = circle([lng, lat], layer.getRadius(), {
          steps: 100,
          units: 'meters',
        });
      } else {
        asJSON = layer.toGeoJSON();
      }
      store.dispatch('addPolygon', asJSON.geometry);
    });
    if (this.getPolygons.length > 0) {
      this.drawPolygons(this.getPolygons);
    }
  },
  methods: {
    removeDrawn() {
      if (this.drawn) {
        this.map.removeLayer(this.drawn);
      }
    },
    addDrawn(featureLayer) {
      this.removeDrawn();
      this.drawn = featureLayer;
      featureLayer.addTo(this.map);
    },
    drawPolygons(polygons) {
      const featureGroup = L.featureGroup();
      polygons.forEach((polygon) => {
        const parsed = parseFromWK(polygon.wkt);
        function onEachFeature(feature, layer) {
          layer.bindTooltip(polygon.id, {
            permanent: true,
            direction: 'top',
          });
        }
        L.geoJSON(parsed, {
          onEachFeature,
          fillColor: '#39528E',
          color: '#39528E',
        }).addTo(featureGroup);
      });
      this.addDrawn(featureGroup);
    },
  },
};
</script>
