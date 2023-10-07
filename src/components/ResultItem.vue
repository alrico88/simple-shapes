<template lang="pug">
b-card.mb-2(no-body)
  b-card-header.p-2
    justify-between(:gap="2", v-if="!isEditing")
      .hstack.gap-2.align-items-center
        color-preview(:color="polygon.color")
        .vstack.gap-0
          .fw-bold.cursor-pointer.text-break(@click="centerOnFeature") {{polygon.id}}
          .small {{ polygonArea }} km²
      .hstack.gap-2
        form-check(v-model="polygon.visible", label="Visible")
        b-button.text-nowrap(
          variant="outline-primary",
          size="sm",
          @click="toggleEdit"
        ) #[icon-edit] Edit name
    justify-between(:gap="2", v-if="isEditing")
      .hstack.gap-2
        input.form-control.form-control-color(type="color", v-model="polygon.color")
        input.form-control(type="text", v-model="polygon.id", @keydown.enter="toggleEdit")
      button.btn.btn-primary.btn-sm(@click="toggleEdit") Close
  b-card-body.p-0
    .max-editor-height
      prism-editor.bg-white.py-2.px-3(
        v-model="text",
        :highlight="highlighter",
        readonly
      )
  b-card-footer.p-2
    justify-between(:gap="2")
      .hstack.gap-2
        clipboard-button(text="Copy", :value="text", size="sm")
        b-button(
          variant="primary",
          size="sm",
          @click='() => { downloadFile(text, polygon.id) }'
        ) #[icon-download] Download
        more-button(color="secondary", :wkt="polygon.wkt", size="sm", :id="polygon.id")
      b-button(
        variant="danger",
        size="sm",
        @click='deleteHandler'
      ) #[icon-trash] {{ deleteConfirmation ? 'Sure?' : 'Remove' }}
</template>

<script setup lang="ts">
import { computed, toRefs, ref } from 'vue';
import { parseFromWK } from 'wkt-parser-helper';
import { Formatter } from 'fracturedjsonjs';
import { storeToRefs } from 'pinia';
import { getWKTBBox } from 'bbox-helper-functions';
import area from '@turf/area';
import { processNumber } from 'number-helper-functions';
import { highlight, languages } from 'prismjs';
import { PrismEditor } from 'vue-prism-editor';
import FormCheck from './FormCheck.vue';
import { useMainStore } from '../store/main';
import { StorePolygon } from '../models/StorePolygon';
import ClipboardButton from './ClipboardButton.vue';
import { useDownload } from '../composables/useDownload';
import IconDownload from '~icons/bi/download';
import IconTrash from '~icons/bi/trash';
import IconEdit from '~icons/bi/pencil-square';
import mapEmitter from '../emitters/mapEmitter';
import JustifyBetween from './JustifyBetween.vue';
import ColorPreview from './ColorPreview.vue';
import 'prismjs/components/prism-json';
import MoreButton from './MoreButton.vue';
import { useGeoFormat } from '../composables/useGeoFormat';
import { useDeleteConfirm } from '../composables/useDeleteConfirm';

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
  mapEmitter.emit('goTo', getWKTBBox(polygon.value.wkt));
}

const polygonArea = computed(() => {
  const calcArea = area(
    parseFromWK(props.polygon.wkt) as any,
  ) / 1000000;

  const rounded = processNumber(calcArea);

  return rounded === 0 ? processNumber(calcArea, 4) : rounded;
});

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
