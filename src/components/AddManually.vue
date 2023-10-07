<template lang="pug">
b-tabs(v-model="tab", pills)
  b-tab(v-for="mode of modes", :key="mode.value", :title="mode.text")
    component(:is="mode.component", @done='sendDone')
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AddManuallyFromWkt from './AddManuallyFromWkt.vue';
import AddManuallyFromGeojson from './AddManuallyFromGeojson.vue';
import AddManuallyFromTile from './AddManuallyFromTile.vue';
import AddManuallyFromBbox from './AddManuallyFromBbox.vue';
import AddManuallyFromCoords from './AddManuallyFromCoords.vue';

const emit = defineEmits(['done']);

const tab = ref(0);

const modes = [
  {
    text: 'From WKT',
    value: 'wkt',
    component: AddManuallyFromWkt,
  },
  {
    text: 'From GeoJSON',
    value: 'gejson',
    component: AddManuallyFromGeojson,
  },
  {
    text: 'From Tilename',
    value: 'tilenames',
    component: AddManuallyFromTile,
  },
  {
    text: 'From BBox',
    value: 'bbox',
    component: AddManuallyFromBbox,
  },
  {
    text: 'From coordinates',
    value: 'boords',
    component: AddManuallyFromCoords,
  },
];

function setTab(tabIdx: number): void {
  tab.value = tabIdx;
}

function sendDone() {
  emit('done');
}
</script>
