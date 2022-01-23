<template lang="pug">
.row
  .col
    .alert.alert-primary.border-primary.mb-2.auto-mb
      .row.mb-2
        .col
          .hstack.gap-2.align-items-center
            div Get all features as
            c-form-select.w-50(:options="options", v-model="collMode")
      .row
        .col
          .hstack.gap-1
            clipboard-button(
              size="sm",
              text="Copy",
              :value="toCopy"
            )
            button.btn.btn-primary.btn-sm(
              @click='downloadAll'
            ) #[icon-download] Download
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { Formatter } from 'fracturedjsonjs';
import { CFormSelect } from '@coreui/bootstrap-vue';
import ClipboardButton from './ClipboardButton.vue';
import { useMainStore } from '../store/main';
import { useDownload } from '../composables/useDownload';
import IconDownload from '~icons/bi/download';

enum CollMode {
    GeometryCollection = 'geomColl',
    FeatureCollection = 'featColl'
}

const formatter = new Formatter();

const store = useMainStore();

const { format, getAsGeometryCollection, getAsFeatureCollection } = storeToRefs(store);

const collMode = ref(CollMode.GeometryCollection);

const options = computed(() => {
  const baseOpts = [
    {
      label: 'GeometryCollection',
      value: CollMode.GeometryCollection,
    },
  ];

  if (format.value === 'geojson') {
    baseOpts.push({
      label: 'FeatureCollection',
      value: CollMode.FeatureCollection,
    });
  }

  return baseOpts;
});

const geomCollText = computed(() => formatter.serialize(getAsGeometryCollection.value));
const featCollText = computed(() => formatter.serialize(getAsFeatureCollection.value));

const toCopy = computed(() => (collMode.value === CollMode.GeometryCollection ? geomCollText.value : featCollText.value));

const { downloadFile } = useDownload(format);

function downloadAll() {
  downloadFile(toCopy.value, 'allFeatures');
}
</script>
