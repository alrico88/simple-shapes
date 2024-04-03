<template lang="pug">
b-card.mb-2(no-body)
  b-card-header.p-2
    justify-between(:gap="2", v-if="!isEditing")
      .hstack.gap-2.align-items-center
        color-preview(:color="polygon.color")
        .vstack.gap-0
          .fw-bold.cursor-pointer.text-break(
            @click="centerOnFeature",
            v-b-tooltip.hover,
            title="Zoom to feature"
          ) {{ polygon.name }}
          .small {{ shapeDetails }}
      .hstack.gap-1
        b-button(
          variant="outline-primary",
          size="sm",
          @click="polygon.visible = !polygon.visible",
          v-b-tooltip.hover,
          title="Toggle visibility"
        )
          icon(:name="iconName")
        b-button.text-nowrap(
          variant="outline-primary",
          size="sm",
          @click="toggleEdit"
        ) #[icon(name="bi:pencil-square")] Edit name
    justify-between(:gap="2", v-if="isEditing")
      .hstack.gap-2
        b-form-input(type="color", v-model="polygon.color")
        b-form-input(
          type="text",
          v-model="polygon.name",
          @keydown.enter="toggleEdit"
        )
      b-button(variant="primary", size="sm", @click="toggleEdit") Close
  b-card-body.p-0
    codemirror(
      v-model="text",
      disabled,
      :extensions="extensions",
      :style="style"
    )
  b-card-footer.p-2
    justify-between(:gap="2")
      .hstack.gap-2
        clipboard-button(text="Copy", :value="text", size="sm")
        b-button.text-truncate(
          variant="primary",
          size="sm",
          @click="() => { downloadFile(text, polygon.name); }"
        ) #[icon(name="bi:download")] Download
        more-button(color="secondary", size="sm", :polygon="polygon")
      b-button.text-truncate(
        variant="danger",
        size="sm",
        @click="deleteHandler"
      ) #[icon(name="bi:trash")] {{ deleteConfirmation ? "Sure?" : "Remove" }}
</template>

<script setup lang="ts">
import { parseFromWK } from "wkt-parser-helper";
import { Formatter } from "fracturedjsonjs";
import { getWKTBBox } from "bbox-helper-functions";
import area from "@turf/area";
import length from "@turf/length";
import { processNumber } from "number-helper-functions";
import { useMainStore } from "../store/main";
import { StorePolygon } from "../models/StorePolygon";
import mapEmitter from "../emitters/mapEmitter";
import { Codemirror } from "vue-codemirror";
import { vBTooltip } from "bootstrap-vue-next";

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
      parseFromWK(props.polygon.wkt, true, {
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
  const parsed = parseFromWK(props.polygon.wkt);
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

<style scoped>
.form-control[readonly] {
  background: white;
  font-size: 0.9rem;
}
</style>
