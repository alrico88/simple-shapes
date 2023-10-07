<template lang="pug">
form.form.mt-3(@submit.prevent='createGeoJSONFromTilenames')
  .form-group
    text-input(v-model:text="enteredText")
    .form-text Enter the Slippy map tilename input in the [x, y, z] format
      |  or drag and drop a file to the input
    .form-text You can add multiple tilenames at once, separated by new lines
    .valid-feedback.d-block(v-if="isValid === true") Valid tiles
    .invalid-feedback.d-block(v-if="isValid === false") {{ error }}
  button.btn.btn-success.w-100(
    type='submit',
    :disabled="btnDisabled"
  ) #[icon(name="bi:plus")] Add tile(s)
</template>

<script setup lang="ts">
import { tileToGeoJSON } from "@mapbox/tilebelt";
import { validateTilenames } from "../helpers/validators";
import { useMainStore } from "../store/main";

const store = useMainStore();

const enteredText = ref("");
const isValid = ref<boolean | null>(null);
const error = ref("");

const hasEnteredText = computed(() => enteredText.value !== "");

function validate(str: string): void {
  if (hasEnteredText.value) {
    try {
      validateTilenames(str);
      isValid.value = true;
      error.value = "";
    } catch (e: any) {
      isValid.value = false;
      error.value = e.message;
    }
  } else {
    isValid.value = null;
    error.value = "";
  }
}

debouncedWatch(enteredText, validate, {
  debounce: 500,
});

const btnDisabled = computed(() => !hasEnteredText.value || !isValid.value);

const emit = defineEmits(["done"]);

function createGeoJSONFromTilenames() {
  enteredText.value.split("\n").forEach((d) => {
    const asXYZ = JSON.parse(d);

    store.addPolygon(tileToGeoJSON(asXYZ), d);
  });

  emit("done");
}
</script>
