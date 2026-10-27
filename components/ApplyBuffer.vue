<template lang="pug">
form.flex.flex-col.gap-4(@submit.prevent="applyBuffer")
  u-form-field(
    label="Radius",
    description="Distance to draw the buffer (negative values are allowed)"
  )
    u-input.w-full(v-model.number="radius", type="number")
  u-form-field(label="Units")
    u-select.w-full(v-model="units", :items="unitOptions")
  u-form-field(label="Steps")
    u-input.w-full(v-model.number="steps", type="number", :min="0")
  u-button(
    block,
    color="success",
    type="submit",
    icon="gis:buffer",
    label="Apply buffer"
  )
</template>

<script setup lang="ts">
import buffer from "@turf/buffer";
import type { Units } from "@turf/helpers";
import { geojsonToWkt, wktToGeojson } from "wkt-parser-helper";
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
const units = ref<Units>("kilometers");
const steps = ref(8);

const mainStore = useMainStore();
const { polygons } = storeToRefs(mainStore);

function applyBuffer(): void {
  const geojsonShape = wktToGeojson(props.shape);
  const buffered = buffer(geojsonShape, radius.value, {
    units: units.value,
    steps: steps.value,
  });

  const pol = polygons.value.find((d) => props.id === d.id);

  if (!pol) {
    return;
  }

  if (!buffered) {
    return;
  }

  pol.wkt = geojsonToWkt(buffered);

  emit("close");
}
</script>
