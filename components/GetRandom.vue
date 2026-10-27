<template lang="pug">
div
  form.flex.flex-col.gap-4(@submit.prevent="generateRandom")
    u-form-field(label="Amount of points to generate")
      u-input.w-full(v-model.number="amount", type="number", :min="0")
    u-checkbox(v-model="withValues", label="With values")
    u-form-field(v-show="withValues", label="Values between this range")
      .flex.gap-2
        u-field-group.w-full
          u-badge(color="neutral", variant="outline", label="Min")
          u-input.w-full(v-model.number="valuesDomain[0]", type="number")
        u-field-group.w-full
          u-badge(color="neutral", variant="outline", label="Max")
          u-input.w-full(v-model.number="valuesDomain[1]", type="number")
    u-button(
      block,
      type="submit",
      icon="tabler:dice",
      label="Generate random points",
      :disabled="points.length > 0"
    )
  u-separator.my-4
  .flex.gap-2
    u-button.justify-center(
      block,
      color="success",
      icon="mi:save",
      label="Download as CSV",
      :disabled="points.length === 0",
      @click="downloadRandom"
    )
    u-tooltip.w-full(text="Be careful when adding a lot of points")
      u-button.justify-center(
        block,
        color="neutral",
        icon="gis:map-add",
        label="Add to map",
        :disabled="points.length === 0",
        @click="addToMap"
      )
</template>

<script setup lang="ts">
import { randomPosition } from "@turf/random";
import { point } from "@turf/helpers";
import booleanContains from "@turf/boolean-contains";
import { getWKTBBox } from "bbox-helper-functions";
import { getRandom } from "number-helper-functions";
import { wktToGeojson } from "wkt-parser-helper";
import { useMainStore } from "~/store/main";

const props = defineProps<{
  shape: string;
  name: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const amount = ref(100);
const withValues = ref(false);
const valuesDomain = ref([0, 100]);
const points = ref<{ coords: [number, number]; value?: number }[]>([]);

watch([amount, withValues, valuesDomain], () => {
  points.value = [];
});

function generateRandom() {
  const bbox = getWKTBBox(props.shape);
  const geojsonShape = wktToGeojson(props.shape);
  const [min, max] = valuesDomain.value;
  const wantsValue = withValues.value;

  const tempPoints: { coords: [number, number]; value?: number }[] = [];

  while (tempPoints.length < amount.value) {
    const rdm = randomPosition(bbox) as [number, number];

    if (booleanContains(geojsonShape, point(rdm))) {
      tempPoints.push({
        coords: rdm,
        value: wantsValue ? getRandom(min!, max!) : undefined,
      });
    }
  }

  points.value = tempPoints;
}

const { downloadFile } = useDownload("csv");

function downloadRandom() {
  let text = `lat,lon${withValues.value ? ",value" : ""}\n`;
  points.value.forEach((point) => {
    const [lon, lat] = point.coords;
    text += `${lat},${lon}${withValues.value ? "," + point.value : ""}\n`;
  });

  downloadFile(text, `${props.name} ${points.value.length} points`);

  emit("close");
}

const mainStore = useMainStore();

function addToMap() {
  points.value.forEach((d) => {
    mainStore.addPolygon(point(d.coords));
  });

  emit("close");
}
</script>
