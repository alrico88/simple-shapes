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
</template>

<script setup lang="ts">
import { CModal, CModalHeader, CModalBody } from '@coreui/bootstrap-vue';
import { storeToRefs } from 'pinia';
import MapComponent from './components/Map.vue';
import Result from './components/Result.vue';
import AddManually from './components/AddManually.vue';
import MapOptions from './components/MapOptions.vue';
import { useModalsStore } from './store/modals';
import 'vue-prism-editor/dist/prismeditor.min.css';
import 'prismjs/themes/prism-coy.css';

const store = useModalsStore();
const { addModal, mapSettings } = storeToRefs(store);
</script>
