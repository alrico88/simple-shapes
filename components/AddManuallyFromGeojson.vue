<template lang="pug">
form.mt-3.flex.flex-col.gap-3(@submit.prevent="createPolygonFromText")
  u-form-field(
    :description="'Paste a GeoJSON representation of a geometry here or drag and drop a file to the input'",
    :error="isValid === false ? error : undefined",
    :help="isValid ? 'Valid GeoJSON' : undefined"
  )
    text-input(v-model:text="geojson")
  u-button(
    block,
    color="success",
    type="submit",
    icon="bi:plus",
    label="Add GeoJSON",
    :disabled="btnDisabled"
  )
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
  }
);

const btnDisabled = computed(() => !hasEnteredText.value || !isValid.value);

function createPolygonFromText() {
  const parsed = JSON.parse(geojson.value);

  store.addShapes(parsed);
  emit("done");
}
</script>
