<template lang="pug">
.row.mb-2
  .col
    c-form(@submit.prevent)
      .row.row-cols-1.row-cols-md-2.gx-2
        .col
          .form-group.mb-0(label="Format")
            label Shape format
            c-button-group.d-flex(size="sm", role="group")
              c-button.w-100(
                v-for="item of formats"
                :key="item.value",
                @click="format = item.value" ,
                color="secondary",
                :class="{active: format === item.value}"
              ) {{ item.text }}
        .col
          .form-group.mb-0
            label.w-100 Map options
            button.btn.btn-secondary.btn-sm.w-100(
              @click="openMapSettings"
            ) Show options
</template>

<script setup lang="ts">
import { CForm, CButton, CButtonGroup } from '@coreui/bootstrap-vue';
import { storeToRefs } from 'pinia';
import { useMainStore } from '../store/main';
import { useModalsStore } from '../store/modals';

const store = useMainStore();
const modalsStore = useModalsStore();

const { format } = storeToRefs(store);
const { mapSettings } = storeToRefs(modalsStore);

function openMapSettings() {
  mapSettings.value = true;
}

const formats = [
  {
    text: 'WKT',
    value: 'wkt',
  },
  {
    text: 'GeoJSON',
    value: 'geojson',
  },
];
</script>
