<template lang="pug">
.container-fluid
  .row
    .col
      b-form(@submit.prevent="applyBuffer")
        .vstack.gap-3
          b-form-group(
            label="Radius",
            description="Distance to draw the buffer (negative values are allowed)"
          )
            b-form-input(v-model.number="radius", type="number")
          b-form-group(label="Units")
            b-form-select(:options="unitOptions", v-model="units")
          b-form-group(label="Steps")
            b-form-input(v-model.number="steps", type="number", :min="0")
          b-button.w-100(type="submit", variant="success") #[icon(name="gis:buffer")] Apply buffer
</template>

<script setup lang="ts">
import buffer from "@turf/buffer";
import { convertToWK, parseFromWK } from "wkt-parser-helper";
import { useMainStore } from "~/store/main";

const props = defineProps<{
  id: string;
  shape: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const unitOptions = ["kilometers", "meters", "miles"];

const radius = ref(1);
const units = ref("kilometers");
const steps = ref(8);

const mainStore = useMainStore();
const { polygons } = storeToRefs(mainStore);

function applyBuffer(): void {
  const geojsonShape = parseFromWK(props.shape);
  const buffered = buffer(geojsonShape, radius.value, {
    units: units.value,
    steps: steps.value,
  });

  const pol = polygons.value.find((d) => props.id === d.id);

  if (!pol) {
    return;
  }

  pol.wkt = convertToWK(buffered);

  emit("close");
}
</script>
