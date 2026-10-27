<template lang="pug">
u-dropdown-menu(:items="items")
  u-button.whitespace-nowrap(
    :color="color",
    :size="size",
    variant="subtle",
    icon="i-lucide-ellipsis",
    label="More"
  )
</template>

<script setup lang="ts">
import { BBoxToGeoJSONFeature, getWKTBBox } from "bbox-helper-functions";
import tokml from "tokml";
import { wktToGeojson } from "wkt-parser-helper";
import { useMainStore } from "~/store/main";
import { useModalsStore } from "~/store/modals";
import type { StorePolygon } from "~/models/StorePolygon";

const props = withDefaults(
  defineProps<{
    color?: "primary" | "neutral";
    size?: "xs" | "sm" | "md";
    polygon: StorePolygon;
  }>(),
  {
    size: "md",
    color: "primary",
  }
);

const { copy } = useClipboard();
const { downloadFile } = useDownload("kml");

const store = useMainStore();

function copyBBox() {
  copy(getWKTBBox(props.polygon.wkt).toString());
}

function createBBox() {
  store.addPolygon(
    BBoxToGeoJSONFeature(getWKTBBox(props.polygon.wkt)),
    `${props.polygon.name}_bbox`
  );
}

function convertToKml() {
  const asGeoJSON = wktToGeojson(props.polygon.wkt);

  downloadFile(tokml(asGeoJSON), props.polygon.name);
}

const modalsStore = useModalsStore();

function getRandom() {
  modalsStore.randomPointsModal.modal = true;
  modalsStore.randomPointsModal.wkt = {
    name: props.polygon.name,
    wkt: props.polygon.wkt,
  };
}

function openApplyBuffer() {
  modalsStore.applyBufferModal.id = props.polygon.id;
  modalsStore.applyBufferModal.wkt = props.polygon.wkt;
  modalsStore.applyBufferModal.modal = true;
}

function findGeohashes() {
  modalsStore.geohashesModal.name = props.polygon.name;
  modalsStore.geohashesModal.wkt = props.polygon.wkt;
  modalsStore.geohashesModal.modal = true;
}

const items = [
  { label: "Copy BBox", onSelect: copyBBox },
  { label: "Add BBox as new shape", onSelect: createBBox },
  { label: "Convert to KML", onSelect: convertToKml },
  { label: "Apply buffer", onSelect: openApplyBuffer },
  { label: "Get random points inside shape", onSelect: getRandom },
  { label: "Find geohashes inside shape", onSelect: findGeohashes },
];
</script>
