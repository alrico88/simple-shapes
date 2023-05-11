<template lang="pug">
c-nav(variant="pills", no-fade)
  c-nav-item(v-for="mode of modes", :key="mode.value")
    c-nav-link(
      href="javascript:void(0);"
      :active="tab === mode.value",
      @click="() => { setTab(mode.value) }"
    ) {{ mode.text }}
c-tab-content
  c-tab-pane(v-for="mode of modes", :key="mode.value" :visible="tab === mode.value")
    component(:is="mode.component", @done='sendDone')
</template>

<script setup lang="ts">
import {
  CNav, CNavItem, CNavLink, CTabContent, CTabPane,
} from '@coreui/bootstrap-vue';
import { ref } from 'vue';
import AddManuallyFromWkt from './AddManuallyFromWkt.vue';
import AddManuallyFromGeojson from './AddManuallyFromGeojson.vue';
import AddManuallyFromTile from './AddManuallyFromTile.vue';
import AddManuallyFromBbox from './AddManuallyFromBbox.vue';

const emit = defineEmits(['done']);

const tab = ref('wkt');

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
];

function setTab(newTab: string): void {
  tab.value = newTab;
}

function sendDone() {
  emit('done');
}
</script>
