<template lang="pug">
b-form.mt-3(@submit.prevent="createGeoJSONFromBBox")
  b-form-group(
    valid-feedback="Valid BBox(es)",
    :invalid-feedback="error",
    :state="isValid",
    description="Enter the BBox in the [minLon, minLat, maxLon, maxLat] format or drag and drop a file to the input. You can add multiple BBoxes at once, separated by new lines"
  )
    text-input(v-model:text="enteredText")
  b-button.w-100(variant="success", type="submit", :disabled="btnDisabled") #[icon(name="bi:plus")] Add BBox(es)
</template>

<script setup lang="ts">
import { BBoxToGeoJSONFeature } from "bbox-helper-functions";
import { validateBBox } from "../helpers/validators";
import { useMainStore } from "../store/main";

const store = useMainStore();

const enteredText = ref("");
const isValid = ref<boolean | null>(null);
const error = ref("");

const hasEnteredText = computed(() => enteredText.value !== "");

function validate(str: string): void {
  if (hasEnteredText.value) {
    try {
      const bboxes = str.split("\n");

      for (const bboxStr of bboxes) {
        validateBBox(bboxStr);
        isValid.value = true;
        error.value = "";
      }
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

function createGeoJSONFromBBox() {
  enteredText.value.split("\n").forEach((d) => {
    const asBBox = JSON.parse(d);

    store.addPolygon(BBoxToGeoJSONFeature(asBBox), d);
  });

  emit("done");
}
</script>
