<template lang="pug">
.row.mx-0.g-0
  .col-lg-8.col-md-7.col-6.vh-100
    map-component.flex-grow-1
  .col.border-left.vh-100
    result
  b-modal(
    v-model="addModal"
    size="lg"
    @close="() => { addModal = false }"
    title="Add manually"
    title-class="modal-title"
    hide-footer
    lazy
  )
    add-manually(@done='() => { addModal = false }')
  b-modal(
    v-model="mapSettings"
    @close="() => { mapSettings = false }"
    title="Map Options"
    title-class="modal-title"
    hide-footer
    lazy
  )
    map-options
  b-offcanvas(
    v-model="searchInterface",
    placement="end"
    @hide="hideSearchInterface"
    title="Search"
  )
    .p-2.bg-white
      the-search
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import MapComponent from './components/Map.vue';
import Result from './components/Result.vue';
import AddManually from './components/AddManually.vue';
import MapOptions from './components/MapOptions.vue';
import TheSearch from './components/TheSearch.vue';
import { useModalsStore } from './store/modals';
import 'vue-prism-editor/dist/prismeditor.min.css';
import 'prismjs/themes/prism-coy.css';

const store = useModalsStore();
const { addModal, mapSettings, searchInterface } = storeToRefs(store);

function hideSearchInterface() {
  searchInterface.value = false;
}
</script>
