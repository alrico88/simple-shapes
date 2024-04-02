<template lang="pug">
b-card.mb-2(no-body)
  b-card-header.p-2
    justify-between(:gap="2", v-if="!isEditing")
      .hstack.gap-2.align-items-center
        color-preview(:color="polygon.color")
        .vstack.gap-0
          .fw-bold.cursor-pointer.text-break(@click="centerOnFeature") {{ polygon.name }}
          .small {{ shapeDetails }}
      .hstack.gap-2
        form-check(v-model="polygon.visible", label="Visible")
        b-button.text-nowrap(
          variant="outline-primary",
          size="sm",
          @click="toggleEdit"
        ) #[icon(name="bi:pencil-square")] Edit name
    justify-between(:gap="2", v-if="isEditing")
      .hstack.gap-2
        input.form-control.form-control-color(
          type="color",
          v-model="polygon.color"
        )
        input.form-control(
          type="text",
          v-model="polygon.name",
          @keydown.enter="toggleEdit"
        )
      button.btn.btn-primary.btn-sm(@click="toggleEdit") Close
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
        b-button(
          variant="primary",
          size="sm",
          @click="() => { downloadFile(text, polygon.name); }"
        ) #[icon(name="bi:download")] Download
        more-button(
          color="secondary",
          :wkt="polygon.wkt",
          size="sm",
          :name="polygon.name"
        )
      b-button(variant="danger", size="sm", @click="deleteHandler") #[icon(name="bi:trash")] {{ deleteConfirmation ? "Sure?" : "Remove" }}
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
</script>

<style scoped>
.form-control[readonly] {
  background: white;
  font-size: 0.9rem;
}

.max-editor-height {
  max-height: 200px;
  overflow-y: auto;
}
</style>
