<template lang="pug">
u-card.mb-2(:ui="{ header: 'p-2 sm:p-2', body: 'p-0 sm:p-0', footer: 'p-2 sm:p-2' }")
  template(#header)
    justify-between(v-if="!isEditing", :gap="2")
      .flex.items-center.gap-2
        color-preview(:color="polygon.color")
        .flex.flex-col
          u-tooltip(text="Zoom to feature")
            .cursor-pointer.break-words.font-bold(@click="centerOnFeature") {{ polygon.name }}
          .text-xs {{ shapeDetails }}
      .flex.gap-1
        u-tooltip(text="Toggle visibility")
          u-button(
            variant="outline",
            :icon="iconName",
            @click="polygon.visible = !polygon.visible"
          )
        u-button.whitespace-nowrap(
          variant="outline",
          icon="bi:pencil-square",
          label="Edit name",
          @click="toggleEdit"
        )
    justify-between(v-if="isEditing", :gap="2")
      .flex.gap-2
        u-input(v-model="polygon.color", type="color", class="w-14")
        u-input(
          v-model="polygon.name",
          type="text",
          @keydown.enter="toggleEdit"
        )
      u-button(label="Close", @click="toggleEdit")
  codemirror(
    v-model="text",
    disabled,
    :extensions="extensions",
    :style="style"
  )
  template(#footer)
    justify-between.flex-wrap(:gap="2")
      .flex.gap-2
        clipboard-button(text="Copy", :value="text")
        u-button.truncate(
          icon="bi:download",
          label="Download",
          @click="() => { downloadFile(text, polygon.name); }"
        )
        more-button(color="neutral", :polygon="polygon")
      u-button.shrink-0(
        color="error",
        icon="bi:trash",
        :label="deleteConfirmation ? 'Sure?' : 'Remove'",
        @click="deleteHandler"
      )
</template>

<script setup lang="ts">
import { wktToGeojson } from "wkt-parser-helper";
import { Formatter } from "fracturedjsonjs";
import { getWKTBBox } from "bbox-helper-functions";
import area from "@turf/area";
import length from "@turf/length";
import { processNumber } from "number-helper-functions";
import { useMainStore } from "../store/main";
import type { StorePolygon } from "../models/StorePolygon";
import mapEmitter from "../emitters/mapEmitter";
import { Codemirror } from "vue-codemirror";

const props = defineProps<{
  polygon: StorePolygon;
}>();

const store = useMainStore();

const { format } = storeToRefs(store);
const { polygon } = toRefs(props);

const { style, extensions } = useCodeStyle();

const text = computed(() => {
  if (format.value === "geojson") {
    const formatter = new Formatter();

    return formatter.Serialize(
      wktToGeojson(props.polygon.wkt, true, {
        name: props.polygon.name,
        id: props.polygon.id,
        color: props.polygon.color,
      })
    ) as string;
  }

  return props.polygon.wkt;
});

const { deleteHandler, deleteConfirmation } = useDeleteConfirm(() => {
  store.deletePolygon(props.polygon.id);
});

const extension = useGeoFormat(format);

const { downloadFile } = useDownload(extension);

const isEditing = ref(false);

function toggleEdit(): void {
  isEditing.value = !isEditing.value;
}

function centerOnFeature() {
  mapEmitter.emit("goTo", getWKTBBox(polygon.value.wkt));
}

const shapeDetails = computed(() => {
  const lineTypes = ["LineString", "MultiLineString"];
  const parsed = wktToGeojson(props.polygon.wkt);
  const isLine = lineTypes.includes(parsed.type);

  if (isLine) {
    let lengthUnit = "m";
    let lineLength = length(parsed as any, {
      units: "meters",
    });

    if (lineLength > 1000) {
      lengthUnit = "km";
      lineLength = lineLength / 1000;
    }

    return `Length: ${processNumber(lineLength)} ${lengthUnit}.`;
  } else {
    const calcArea = area(parsed as any) / 1000000;
    const rounded = processNumber(calcArea);
    const toReturn = rounded === 0 ? processNumber(calcArea, 4) : rounded;

    return `Area: ${toReturn} km2`;
  }
});

const iconName = computed(() =>
  props.polygon.visible ? "tabler:eye" : "tabler:eye-closed"
);
</script>
