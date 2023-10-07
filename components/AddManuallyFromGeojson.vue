<template lang="pug">
form.form.mt-3(@submit.prevent='createPolygonFromText')
  .form-group
    text-input(v-model:text='geojson')
    .form-text Paste a GeoJSON representation of a geometry here
      |  or drag and drop a file to the input
    .valid-feedback.d-block(v-if="isValid === true") Valid GeoJSON
    .invalid-feedback.d-block(v-if="isValid === false") {{ error }}
  button.btn.btn-success.w-100(
    type='submit',
    :disabled="btnDisabled"
  ) #[icon(name="bi:plus")] Add GeoJSON
</template>

<script setup lang="ts">
import { validateGeoJSON } from "../helpers/validators";
import { useMainStore } from "../store/main";

const emit = defineEmits(["done"]);

const geojson = ref("");
const isValid = ref<boolean | null>(null);
const error = ref("");

const hasEnteredText = computed(() => geojson.value !== "");

const store = useMainStore();

debouncedWatch(
  geojson,
  (val) => {
    try {
      validateGeoJSON(val);
      isValid.value = true;
    } catch (err: any) {
      isValid.value = false;
      error.value = err.message;
    }
  },
  {
    debounce: 500,
  },
);

const btnDisabled = computed(() => !hasEnteredText.value || !isValid.value);

function createPolygonFromText() {
  const parsed = JSON.parse(geojson.value);

  store.addShapes(parsed);
  emit("done");
}
</script>
