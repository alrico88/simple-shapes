<template lang="pug">
b-dropdown.text-nowrap(:variant="color", :size="size")
  template(#button-content) #[icon(name="bi:three-dots")] More
  b-dropdown-item(button, @click="copyBBox") Copy BBox
  b-dropdown-item(button, @click="createBBox") Add BBox as new shape
  b-dropdown-item(button, @click="convertToKml") Convert to KML
  b-dropdown-item(button, @click="openApplyBuffer") Apply buffer
  b-dropdown-item(button, @click="getRandom") Get random points inside shape
  b-dropdown-item(button, @click="findGeohashes") Find geohashes inside shape
</template>

<script setup lang="ts">
import { BBoxToGeoJSONFeature, getWKTBBox } from "bbox-helper-functions";
import tokml from "tokml";
import { parseFromWK } from "wkt-parser-helper";
import type { ColorVariant, Size } from "bootstrap-vue-next";
import { useMainStore } from "~/store/main";
import { useModalsStore } from "~/store/modals";
import type { StorePolygon } from "~/models/StorePolygon";

const props = withDefaults(
  defineProps<{
    color?: ColorVariant;
    size?: Size;
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
  const asGeoJSON = parseFromWK(props.polygon.wkt);

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
</script>
