<template lang="pug">
form.form.mt-3(@submit.prevent='createPolygonFromText')
  .form-group
    textarea.form-control.bg-white(
      v-model='geojson',
      rows='4',
      max-rows='20',
      @drop.prevent="handleDrop",
      @dragover.prevent,
      placeholder="Paste a GeoJSON representation of a geometry here or drag and drop a file to this box"
    )
    .valid-feedback.d-block(v-if="isValid === true") Valid GeoJSON
    .invalid-feedback.d-block(v-if="isValid === false") {{ error }}
  button.btn.btn-success.w-100(
    type='submit',
    :disabled="btnDisabled"
  ) #[icon-plus] Add GeoJSON
</template>

<script setup lang="ts">
import { readAsText } from 'promise-file-reader';
import {
  computed, ref,
} from 'vue';
import { debouncedWatch } from '@vueuse/core';
import { Formatter } from 'fracturedjsonjs';
import { validateGeoJSON } from '../helpers/validators';
import { useMainStore } from '../store/main';
import IconPlus from '~icons/bi/plus';

const formatter = new Formatter();
const emit = defineEmits(['done']);

const geojson = ref('');
const isValid = ref<boolean | null>(null);
const error = ref('');

const hasEnteredText = computed(() => geojson.value !== '');

const store = useMainStore();

debouncedWatch(geojson, (val) => {
  try {
    validateGeoJSON(val);
    isValid.value = true;
  } catch (err: any) {
    isValid.value = false;
    error.value = err.message;
  }
}, {
  debounce: 500,
});

const btnDisabled = computed(() => !hasEnteredText.value || !isValid.value);

function getBasicGeometriesToAdd(parsed: any): void {
  const { type } = parsed;

  if (type === 'FeatureCollection') {
    parsed.features.forEach((feature: any) => {
      getBasicGeometriesToAdd(feature);
    });
  } else if (type === 'Feature') {
    store.addPolygon(parsed.geometry);
  } else if (type === 'GeometryCollection') {
    parsed.geometries.forEach((geometry: any) => {
      store.addPolygon(geometry);
    });
  } else {
    store.addPolygon(parsed);
  }
}

function createPolygonFromText() {
  const parsed = JSON.parse(geojson.value);

  store.addShapes(parsed);
  emit('done');
}

async function handleDrop(e: DragEvent): Promise<void> {
  if (e.dataTransfer) {
    try {
      const textGeoJSON = await readAsText(e.dataTransfer.files[0]);
      const parsed = JSON.parse(textGeoJSON);
      geojson.value = formatter.serialize(parsed);
    } catch (err) {
      console.error(err);
    }
  }
}
</script>
