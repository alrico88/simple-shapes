<template lang="pug">
b-form.mt-3(@submit.prevent="createGeoJSONFromTilenames")
  b-form-group(
    valid-feedback="Valid tile(s)",
    :invalid-feedback="error",
    :state="isValid",
    description="Enter the Slippy map tilename input in the [x, y, z] format or drag and drop a file to the input. You can add multiple tilenames at once, separated by new lines"
  )
    text-input(v-model:text="enteredText")
  b-button.w-100(variant="success", type="submit", :disabled="btnDisabled") #[icon(name="bi:plus")] Add tile(s)
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
