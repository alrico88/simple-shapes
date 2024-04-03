<template lang="pug">
b-dropdown(:variant="color", :size="size")
  template(#button-content) #[icon(name="bi:three-dots")] More
  b-dropdown-item(@click="copyBBox", href="#", :size="size") Copy BBox
  b-dropdown-item(@click="createBBox", href="#", :size="size") Add BBox as new shape
  b-dropdown-item(@click="convertToKml", href="#", :size="size") Convert to KML
  b-dropdown-item(@click="getRandom", href="#", :size="size") Get random points inside shape
</template>

<script setup lang="ts">
import { BBoxToGeoJSONFeature, getWKTBBox } from "bbox-helper-functions";
import tokml from "tokml";
import { parseFromWK } from "wkt-parser-helper";
import type { ColorVariant, Size } from "bootstrap-vue-next";
import { useMainStore } from "~/store/main";
import { useModalsStore } from "~/store/modals";

const props = withDefaults(
  defineProps<{
    color?: ColorVariant;
    wkt: string;
    size?: Size;
    name: string;
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
  copy(getWKTBBox(props.wkt).toString());
}

function createBBox() {
  store.addPolygon(
    BBoxToGeoJSONFeature(getWKTBBox(props.wkt)),
    `${props.name}_bbox`
  );
}

function convertToKml() {
  const asGeoJSON = parseFromWK(props.wkt);

  downloadFile(tokml(asGeoJSON), props.name);
}

const modalsStore = useModalsStore();

function getRandom() {
  modalsStore.randomPoints = true;
  modalsStore.randomPointsWkt = {
    name: props.name,
    wkt: props.wkt,
  };
}
</script>
