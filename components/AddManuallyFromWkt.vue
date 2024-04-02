<template lang="pug">
b-form.mt-3(@submit.prevent="createWktFromText")
  b-form-group(
    valid-feedback="Valid WKT",
    :invalid-feedback="error",
    :state="isValid",
    description="Enter the Well-Known-Text representation of a geometry here or drag and drop a file to the input"
  )
    text-input(v-model:text="enteredText")
  b-button.w-100(variant="success", type="submit", :disabled="btnDisabled") #[icon(name="bi:plus")] Add WKT
</template>

<script setup lang="ts">
import { replace } from "lodash-es";
import { parseFromWK } from "wkt-parser-helper";
import { validateWKT } from "../helpers/validators";
import { useMainStore } from "../store/main";

const store = useMainStore();

const enteredText = ref("");
const wkt = computed(() => replace(enteredText.value, '"', ""));
const isValid = ref<boolean | null>(null);
const error = ref("");

const hasEnteredText = computed(() => wkt.value !== "");

function validate(str: string): void {
  if (hasEnteredText.value) {
    try {
      validateWKT(str);
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

debouncedWatch(wkt, validate, {
  debounce: 500,
});

const btnDisabled = computed(() => !hasEnteredText.value || !isValid.value);

const emit = defineEmits(["done"]);

function createWktFromText() {
  const parsed = parseFromWK(wkt.value);

  store.addShapes(parsed);
  emit("done");
}
</script>
