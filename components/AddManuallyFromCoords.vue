<template lang="pug">
form.form.mt-3(@submit.prevent='createGeoJSONFromCoordinates')
  .form-group
    text-input(v-model:text="enteredText")
    .form-text Enter the coordinates in latitude,longitude format (in that order)
      |  or drag and drop a file to the input
    .form-text You can add multiple coordinates at once, separated by new lines
    .valid-feedback.d-block(v-if="isValid === true") Valid coordinates
    .invalid-feedback.d-block(v-if="isValid === false") {{ error }}
  button.btn.btn-success.w-100(
    type='submit',
    :disabled="btnDisabled"
  ) #[icon(name="bi:plus")] Add coordinate(s)
</template>

<script setup lang="ts">
import { validateCoordinates } from "../helpers/validators";
import { useMainStore } from "../store/main";

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
  enteredText.value.split("\n").forEach((d) => {
    const [latitude, longitude] = d.split(",").map(Number);

    store.addPolygon(
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      },
      d,
    );
  });

  emit("done");
}
</script>
