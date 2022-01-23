<template lang="pug">
c-card.mb-2(no-body)
  c-card-header.p-2
    .d-flex.justify-content-between.align-items-center(v-if="!isEditing")
      .hstack.gap-2
        icon-square(:style="iconStyle")
        .fw-bold {{polygon.id}}
      .hstack.gap-2
        button.btn.btn-outline-primary.btn-sm(
          @click="centerOnFeature"
        ) #[icon-geolocate] Go to
        button.btn.btn-outline-primary.btn-sm(
          @click="toggleEdit"
        ) #[icon-edit] Edit info
    .d-flex.align-items-center.justify-content-between(v-if="isEditing")
      .hstack.gap-2
        input.form-control.form-control-color(type="color", v-model="polygon.color")
        input.form-control(type="text", v-model="polygon.id")
      .ms-auto
        button.btn.btn-primary.btn-sm(@click="toggleEdit") Close
  c-card-body.p-0
    textarea.form-control.font-monospace.border-0(
      readonly,
      rows='4',
      max-rows='4',
      :value='text'
    )
  c-card-footer.p-2
    .d-flex.justify-content-between
      .hstack.gap-1
        clipboard-button(text="Copy", :value="text", size="sm")
        button.btn.btn-primary.btn-sm(
          @click='() => { downloadFile(text, polygon.id) }'
        ) #[icon-download] Download
      button.btn.btn-danger.btn-sm(@click='removePolygon') #[icon-trash] Remove
</template>

<script setup lang="ts">
import { computed, toRefs, ref } from 'vue';
import { parseFromWK } from 'wkt-parser-helper';
import { Formatter } from 'fracturedjsonjs';
import { storeToRefs } from 'pinia';
import {
  CCard, CCardHeader, CCardFooter, CCardBody,
} from '@coreui/bootstrap-vue';
import { getWKTBBox } from 'bbox-helper-functions';
import { useMainStore } from '../store/main';
import { StorePolygon } from '../models/StorePolygon';
import ClipboardButton from './ClipboardButton.vue';
import { useDownload } from '../composables/useDownload';
import IconDownload from '~icons/bi/download';
import IconTrash from '~icons/bi/trash';
import IconEdit from '~icons/bi/pencil-square';
import IconSquare from '~icons/bi/square-fill';
import IconGeolocate from '~icons/bi/geo-fill';
import mapEmitter from '../emitters/mapEmitter';

const props = defineProps<{
  polygon: StorePolygon
}>();

const store = useMainStore();

const { format } = storeToRefs(store);
const { polygon } = toRefs(props);

const text = computed(() => {
  if (format.value === 'geojson') {
    const formatter = new Formatter();

    return formatter.serialize(parseFromWK(props.polygon.wkt));
  }

  return props.polygon.wkt;
});

const iconStyle = computed(() => ({
  color: polygon.value.color,
}));

function removePolygon() {
  store.deletePolygon(props.polygon.id);
}

const { downloadFile } = useDownload(format);

const isEditing = ref(false);

function toggleEdit(): void {
  isEditing.value = !isEditing.value;
}

function centerOnFeature() {
  mapEmitter.emit('goTo', getWKTBBox(polygon.value.wkt));
}
</script>

<style scoped>
.form-control[readonly] {
  background: white;
}
</style>
