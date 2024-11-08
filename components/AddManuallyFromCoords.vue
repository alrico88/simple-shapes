<template lang="pug">
b-form.mt-3(@submit.prevent="createGeoJSONFromCoordinates")
  b-form-group(
    valid-feedback="Valid coordinates",
    :invalid-feedback="error",
    :state="isValid",
    description="Enter the coordinates in latitude,longitude,radius format (in that order, radius is optional, expressed in meters) or drag and drop a file to the input. You can add multiple coordinates at once, separated by new lines"
  )
    text-input(v-model:text="enteredText")
  b-button.w-100(variant="success", type="submit", :disabled="btnDisabled") #[icon(name="bi:plus")] Add coordinate(s)
</template>

<script setup lang="ts">
import { validateCoordinates } from "../helpers/validators";
import { useMainStore } from "../store/main";
import { point } from "@turf/helpers";
import circle from "@turf/circle";
import papa from "papaparse";

const store = useMainStore();

const enteredText = ref("");
const isValid = ref<boolean | null>(null);
const error = ref("");

const hasEnteredText = computed(() => enteredText.value !== "");

function validate(str: string): void {
  if (hasEnteredText.value) {
    try {
      validateCoordinates(str);
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

function createGeoJSONFromCoordinates() {
  const parsed = papa.parse<number[]>(enteredText.value, {
    header: false,
    dynamicTyping: true,
  }).data;

  parsed.forEach((d) => {
    const [latitude, longitude, radius] = d;

    if (radius != null) {
      store.addPolygon(
        circle([longitude, latitude], radius, {
          units: "meters",
        })
      );
    } else {
      store.addPolygon(point([longitude, latitude]));
    }
  });

  emit("done");
}
</script>
