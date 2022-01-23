<template lang="pug">
#app.container-fluid
  .row
    map-component
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

const store = useModalsStore();
const { addModal, mapSettings } = storeToRefs(store);
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
