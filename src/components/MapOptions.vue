<template lang="pug">
c-modal-header
  h5.modal-title Map Options
c-modal-body
  .form-group.mb-2.auto-mb
    .form-floating
      select.form-select.bg-white(v-model="selectedMapStyle", id="mapStyleSelect")
        option(v-for="option of mapStyles", :value="option.key") {{ option.text }}
      label(for="mapStyleSelect") Map style
  .form-group.mb-2.auto-mb
    .form-check.form-switch
      input.form-check-input(
        type="checkbox",
        v-model="showLabels",
        role="switch",
        id="showLabelsSwitch"
        )
      label.form-check-label(for="showLabelsSwitch") Show Labels in map
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import {
  CModalHeader, CModalBody,
} from '@coreui/bootstrap-vue';
import { useMainStore } from '../store/main';

const store = useMainStore();
const { showLabels, mapStyles, selectedMapStyle } = storeToRefs(store);
</script>
