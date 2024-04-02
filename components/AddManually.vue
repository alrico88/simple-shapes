<template lang="pug">
b-tabs(v-model="tab", pills, lazy)
  b-tab(v-for="mode of modes", :key="mode.value", :title="mode.text")
    component(:is="mode.component", @done="sendDone")
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

const tab = ref(0);

const modes = [
  {
    text: "From WKT",
    value: "wkt",
    component: AddManuallyFromWkt,
  },
  {
    text: "From GeoJSON",
    value: "gejson",
    component: AddManuallyFromGeojson,
  },
  {
    text: "From Tilename",
    value: "tilenames",
    component: AddManuallyFromTile,
  },
  {
    text: "From BBox",
    value: "bbox",
    component: AddManuallyFromBbox,
  },
  {
    text: "From coordinates",
    value: "boords",
    component: AddManuallyFromCoords,
  },
];

function sendDone() {
  emit("done");
}
</script>
