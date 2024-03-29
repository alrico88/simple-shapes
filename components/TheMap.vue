<template lang="pug">
.h-100.w-100(:id="mapDiv")
</template>

<script lang="ts" setup>
import L, { LatLng, LatLngBounds } from "leaflet";
import "leaflet-draw";
import { parseFromWK } from "wkt-parser-helper";
import circle from "@turf/circle";
import { toBlob } from "html-to-image";
import { saveAs } from "file-saver";
import { useMainStore } from "../store/main";
import { useSearchStore } from "../store/search";
import mapEmitter from "../emitters/mapEmitter";

(window as any).type = true;

const store = useMainStore();
const searchStore = useSearchStore();

const mapDiv = "mapContainer";

const { polygons, showLabels, tile } = storeToRefs(store);

const parsedPolygons = computed(() =>
  polygons.value.map(({ wkt, id, name, color, visible }) => ({
    id,
    name,
    color,
    shape: parseFromWK(wkt),
    visible,
  })),
);

onMounted(() => {
  nextTick(() => {
    const map = new L.Map(mapDiv, {
      center: [0, 0],
      zoom: 3,
      preferCanvas: true,
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

    map.on("draw:created", (e: any) => {
      const { layer, layerType } = e;
      let asJSON;
      if (layerType === "circle") {
        // eslint-disable-next-line no-underscore-dangle
        const { lat, lng } = layer._latlng;
        asJSON = circle([lng, lat], layer.getRadius(), {
          steps: 100,
          units: "meters",
        });
      } else {
        asJSON = layer.toGeoJSON();
      }
      store.addPolygon(asJSON.geometry);
    });

    const { selectedSearch } = storeToRefs(searchStore);

    let searchLayer = new L.LayerGroup();

    watch(
      selectedSearch,
      (val) => {
        if (val === null) {
          searchLayer.removeFrom(map);

          return;
        }

        const point = new L.Marker([
          val.geometry.coordinates[1],
          val.geometry.coordinates[0],
        ]);

        const newLayerGroup = new L.LayerGroup();

        newLayerGroup.addLayer(point);

        searchLayer.removeFrom(map);
        searchLayer = newLayerGroup;
        searchLayer.addTo(map);
      },
      {
        immediate: true,
      },
    );

    let layerGroup = new L.LayerGroup();

    watch(
      [parsedPolygons, showLabels],
      ([polys]) => {
        const newLayerGroup = new L.LayerGroup();

        polys.forEach((poly) => {
          if (!poly.visible) {
            return;
          }

          const layer = new L.GeoJSON(poly.shape, {
            style: {
              color: poly.color,
              fillColor: poly.color,
            },
          });

          if (showLabels.value) {
            layer.bindTooltip(poly.name, {
              direction: "top",
              permanent: true,
            });
          }

          newLayerGroup.addLayer(layer);
        });

        layerGroup.removeFrom(map);
        layerGroup = newLayerGroup;
        layerGroup.addTo(map);
      },
      {
        immediate: true,
      },
    );

    map.on("ready", () => {
      map.invalidateSize();
    });

    mapEmitter.on("goTo" as any, (bbox: number[]): void => {
      const leafletBounds = new LatLngBounds(
        new LatLng(bbox[1], bbox[0]),
        new LatLng(bbox[3], bbox[2]),
      );

      map.flyToBounds(leafletBounds);
    });

    mapEmitter.on("focusOn" as any, (coords: [number, number]): void => {
      map.flyTo(new LatLng(coords[1], coords[0]), 14);
    });

    mapEmitter.on("download", async () => {
      const blob = (await toBlob(
        document.getElementById(mapDiv) as HTMLElement,
        {
          filter(node) {
            if (!node.classList) {
              return true;
            }

            return !node.classList.contains("leaflet-top");
          },
        },
      )) as Blob;

      saveAs(blob, "map.png");
    });
  });
});
</script>
