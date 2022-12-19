<template lang="pug">
.row.mx-0.g-0
  .col-lg-8.col-md-7.col-6.vh-100
    map-component.flex-grow-1
  .col.border-left.vh-100
    result
  c-modal(:visible="addModal", @close="() => { addModal = false }")
    c-modal-header
      h5.modal-title Add manually
    c-modal-body
      add-manually(@done='() => { addModal = false }')
  c-modal(:visible="mapSettings", @close="() => { mapSettings = false }")
    map-options
  c-offcanvas(:visible="searchInterface", placement="end", @hide="hideSearchInterface")
    c-offcanvas-header
      .hstack.gap-2.justify-content-between.align-items-center.w-100
        .fw-bold.text-uppercase Search
        div
          c-close-button(@click="hideSearchInterface")
    c-offcanvas-body.p-0
      .p-2.bg-white
        the-search
</template>

<script setup lang="ts">
import {
  CModal, CModalHeader, CModalBody, COffcanvas, COffcanvasHeader, COffcanvasBody, CCloseButton,
} from '@coreui/bootstrap-vue';
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
