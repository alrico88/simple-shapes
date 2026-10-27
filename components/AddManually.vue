<template lang="pug">
u-tabs(v-model="tab", :items="modes", variant="pill", :ui="{ list: 'overflow-x-auto' }")
  template(#content="{ item }")
    component(:is="item.component", @done="sendDone")
</template>

<script setup lang="ts">
import {
  AddManuallyFromWkt,
  AddManuallyFromGeojson,
  AddManuallyFromTile,
  AddManuallyFromBbox,
  AddManuallyFromCoords,
} from "#components";

const emit = defineEmits(["done"]);

const tab = ref("wkt");

const modes = [
  {
    label: "From WKT",
    value: "wkt",
    component: AddManuallyFromWkt,
  },
  {
    label: "From GeoJSON",
    value: "geojson",
    component: AddManuallyFromGeojson,
  },
  {
    label: "From Tilename",
    value: "tilenames",
    component: AddManuallyFromTile,
  },
  {
    label: "From BBox",
    value: "bbox",
    component: AddManuallyFromBbox,
  },
  {
    label: "From coordinates",
    value: "coords",
    component: AddManuallyFromCoords,
  },
];

function sendDone() {
  emit("done");
}
</script>
