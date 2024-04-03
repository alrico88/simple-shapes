<template lang="pug">
.container-fluid
  .row
    .col
      b-form(@submit.prevent="generateRandom")
        .vstack.gap-3
          b-form-group(label="Amount of points to generate")
            b-form-input(v-model.number="amount", type="number", :min="0")
          b-form-checkbox(v-model="withValues") With values
          b-form-group(label="Values between this range", v-show="withValues")
            .hstack.gap-2
              b-input-group(prepend="Min")
                b-form-input(type="number", v-model.number="valuesDomain[0]")
              b-input-group(prepend="Max")
                b-form-input(type="number", v-model.number="valuesDomain[1]")
          b-button.w-100(
            type="submit",
            variant="primary",
            :disabled="points.length > 0"
          ) #[icon(name="tabler:dice")] Generate random points
      hr.my-4
      .hstack.gap-2
        b-button.w-100(
          :disabled="points.length === 0",
          @click="downloadRandom",
          variant="success"
        ) #[icon(name="mi:save")] Download as CSV
        b-button.w-100(
          :disabled="points.length === 0",
          @click="addToMap",
          variant="light",
          v-b-tooltip.hover,
          title="Be careful when adding a lot of points"
        ) #[icon(name="gis:map-add")] Add to map
</template>

<script setup lang="ts">
import { randomPosition } from "@turf/random";
import { point } from "@turf/helpers";
import booleanContains from "@turf/boolean-contains";
import { getWKTBBox } from "bbox-helper-functions";
import { getRandom } from "number-helper-functions";
import { parseFromWK } from "wkt-parser-helper";
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
  const geojsonShape = parseFromWK(props.shape);
  const [min, max] = valuesDomain.value;
  const wantsValue = withValues.value;

  const tempPoints: { coords: [number, number]; value?: number }[] = [];

  while (tempPoints.length < amount.value) {
    const rdm = randomPosition(bbox);

    if (booleanContains(geojsonShape, point(rdm))) {
      tempPoints.push({
        coords: rdm,
        value: wantsValue ? getRandom(min, max) : undefined,
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
