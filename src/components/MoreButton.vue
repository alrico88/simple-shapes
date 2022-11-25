<template lang='pug'>
c-dropdown
  c-dropdown-toggle(:color="color", :size="size") #[icon-three-dots] More
  c-dropdown-menu
    c-dropdown-item(@click="copyBBox", href="#", :size="size") Copy BBox
    c-dropdown-item(@click="createBBox", href="#", :size="size") Add BBox as new shape
    c-dropdown-item(@click="convertToKml", href="#", :size="size") Convert to KML
</template>

<script setup lang="ts">
import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/bootstrap-vue';
import { useClipboard } from '@vueuse/core';
import { BBoxToGeoJSONFeature, getWKTBBox } from 'bbox-helper-functions';
import tokml from 'tokml';
import { parseFromWK } from 'wkt-parser-helper';
import { useDownload } from '../composables/useDownload';
import IconThreeDots from '~icons/bi/three-dots';
import { useMainStore } from '../store/main';

const props = withDefaults(defineProps<{
  color?: string,
  wkt: string,
  size?: string,
  id: string
}>(), {
  size: 'md',
  color: 'primary',
});

const { copy } = useClipboard();
const { downloadFile } = useDownload('kml');

const store = useMainStore();

function copyBBox() {
  copy(getWKTBBox(props.wkt).toString());
}

function createBBox() {
  store.addPolygon(BBoxToGeoJSONFeature(getWKTBBox(props.wkt)), `${props.id}_bbox`);
}

function convertToKml() {
  const asGeoJSON = parseFromWK(props.wkt);

  downloadFile(tokml(asGeoJSON), props.id);
}
</script>
