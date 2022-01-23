<template lang="pug">
.col-lg-8.col-md-7.col-6.vh-100.px-0
  .h-100(:id="mapDiv")
</template>

<script lang="ts" setup>
import L, { LatLng, LatLngBounds } from 'leaflet';
import 'leaflet-draw';
import { parseFromWK } from 'wkt-parser-helper';
import circle from '@turf/circle';
import { storeToRefs } from 'pinia';
import {
  computed, onMounted, watch,
} from 'vue';
import { uniqueId } from 'lodash-es';
import { useMainStore } from '../store/main';
import mapEmitter from '../emitters/mapEmitter';

(window as any).type = true;

const store = useMainStore();

const mapDiv = uniqueId('mapDiv');

const { polygons, showLabels, tile } = storeToRefs(store);

const parsedPolygons = computed(() => polygons.value.map(({ wkt, id, color }) => ({
  id,
  color,
  shape: parseFromWK(wkt),
})));

onMounted(() => {
  const map = new L.Map(mapDiv, {
    center: [0, 0],
    zoom: 3,
  });

  const drawControl = new L.Control.Draw({
    draw: {
      circlemarker: false,
    },
  });

  let tileLayer = new L.TileLayer(tile.value.url, {
    attribution: tile.value.attribution,
  });

  tileLayer.addTo(map);

  watch(tile, (val) => {
    tileLayer.removeFrom(map);
    tileLayer = new L.TileLayer(val.url, {
      attribution: val.attribution,
    });
    tileLayer.addTo(map);
  });

  map.addControl(drawControl);

  map.on('draw:created', (e: any) => {
    const { layer, layerType } = e;
    let asJSON;
    if (layerType === 'circle') {
      // eslint-disable-next-line no-underscore-dangle
      const { lat, lng } = layer._latlng;
      asJSON = circle([lng, lat], layer.getRadius(), {
        steps: 100,
        units: 'meters',
      });
    } else {
      asJSON = layer.toGeoJSON();
    }
    store.addPolygon(asJSON.geometry);
  });

  let layerGroup = new L.LayerGroup();

  watch([parsedPolygons, showLabels], ([polys]) => {
    const newLayerGroup = new L.LayerGroup();

    polys.forEach((poly) => {
      const layer = new L.GeoJSON(poly.shape, {
        style: {
          color: poly.color,
          fillColor: poly.color,
        },
      });

      if (showLabels.value) {
        layer.bindTooltip(poly.id, {
          direction: 'top',
          permanent: true,
        });
      }

      newLayerGroup.addLayer(layer);
    });

    layerGroup.removeFrom(map);
    layerGroup = newLayerGroup;
    layerGroup.addTo(map);
  }, {
    immediate: true,
  });

  map.on('ready', () => {
    map.invalidateSize();
  });

  mapEmitter.on('goTo' as any, (bbox: number[]): void => {
    const leafletBounds = new LatLngBounds(
      new LatLng(bbox[1], bbox[0]),
      new LatLng(bbox[3], bbox[2]),
    );

    map.flyToBounds(leafletBounds);
  });
});
</script>
