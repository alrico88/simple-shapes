<template lang="pug">
c-nav(variant="pills", no-fade)
  c-nav-item
    c-nav-link(
      href="javascript:void(0);"
      :active="tab === 'wkt'",
      @click="() => { setTab('wkt') }"
    ) From WKT
  c-nav-item
    c-nav-link(
      href="javascript:void(0);"
      :active="tab === 'geojson'",
      @click="() => { setTab('geojson') }"
    ) From GeoJSON
c-tab-content
  c-tab-pane(:visible="tab === 'wkt'")
    add-manually-from-wkt(@done='sendDone')
  c-tab-pane(:visible="tab === 'geojson'")
    add-manually-from-geojson(@done='sendDone')
</template>

<script setup lang="ts">
import {
  CNav, CNavItem, CNavLink, CTabContent, CTabPane,
} from '@coreui/bootstrap-vue';
import { ref } from 'vue';
import AddManuallyFromWkt from './AddManuallyFromWkt.vue';
import AddManuallyFromGeojson from './AddManuallyFromGeojson.vue';

const emit = defineEmits(['done']);

const tab = ref('wkt');

function setTab(newTab: string): void {
  tab.value = newTab;
}

function sendDone() {
  emit('done');
}
</script>
