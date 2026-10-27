<template lang="pug">
form.mt-3.flex.flex-col.gap-3(@submit.prevent="createGeoJSONFromTilenames")
  u-form-field(
    :description="'Enter the Slippy map tilename input in the [x, y, z] format or drag and drop a file to the input. You can add multiple tilenames at once, separated by new lines'",
    :error="isValid === false ? error : undefined",
    :help="isValid ? 'Valid tile(s)' : undefined"
  )
    text-input(v-model:text="enteredText")
  u-button(
    block,
    color="success",
    type="submit",
    icon="bi:plus",
    label="Add tile(s)",
    :disabled="btnDisabled"
  )
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
