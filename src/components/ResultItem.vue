<template lang="pug">
c-card.mb-2(no-body)
  c-card-header.p-2
    justify-between(:gap="2", v-if="!isEditing")
      .hstack.gap-2.align-items-center
        color-preview(:color="polygon.color")
        .vstack.gap-0
          .fw-bold {{polygon.id}}
          .small {{ polygonArea }} km²
      .hstack.gap-2
        button.btn.btn-outline-primary.btn-sm(
          @click="centerOnFeature"
        ) #[icon-geolocate] Go to
        button.btn.btn-outline-primary.btn-sm(
          @click="toggleEdit"
        ) #[icon-edit] Edit info
    justify-between(:gap="2", v-if="isEditing")
      .hstack.gap-2
        input.form-control.form-control-color(type="color", v-model="polygon.color")
        input.form-control(type="text", v-model="polygon.id", @keydown.enter="toggleEdit")
      button.btn.btn-primary.btn-sm(@click="toggleEdit") Close
  c-card-body.p-0
    .max-editor-height
      prism-editor.py-2.px-3(
        v-model="text",
        :highlight="highlighter",
        readonly
      )
  c-card-footer.p-2
    justify-between(:gap="2")
      .hstack.gap-2
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
import area from '@turf/area';
import { processNumber } from 'number-helper-functions';
import { highlight, languages } from 'prismjs';
import { PrismEditor } from 'vue-prism-editor';
import { useMainStore } from '../store/main';
import { StorePolygon } from '../models/StorePolygon';
import ClipboardButton from './ClipboardButton.vue';
import { useDownload } from '../composables/useDownload';
import IconDownload from '~icons/bi/download';
import IconTrash from '~icons/bi/trash';
import IconEdit from '~icons/bi/pencil-square';
import IconGeolocate from '~icons/bi/geo-fill';
import mapEmitter from '../emitters/mapEmitter';
import JustifyBetween from './JustifyBetween.vue';
import ColorPreview from './ColorPreview.vue';
import 'prismjs/components/prism-json';

const props = defineProps<{
  polygon: StorePolygon
}>();

const store = useMainStore();

const { format } = storeToRefs(store);
const { polygon } = toRefs(props);

const text = computed(() => {
  if (format.value === 'geojson') {
    const formatter = new Formatter();

    return formatter.Serialize(parseFromWK(props.polygon.wkt)) as string;
  }

  return props.polygon.wkt;
});

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

const polygonArea = computed(() => processNumber(area(
  parseFromWK(props.polygon.wkt) as any,
) / 1000000));

function highlighter(code: string): string {
  return highlight(code, languages.json, 'json');
}
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
