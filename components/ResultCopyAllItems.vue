<template lang="pug">
.row
  .col
    b-alert.border-primary.mb-2.auto-mb(:model-value="true", variant="primary")
      .row.mb-2
        .col
          justify-between(:gap="2")
            div Get all features as
            .flex-grow-1
              b-form-select.w-100(:options="options", v-model="collMode")
      .row
        .col
          .hstack.gap-2
            clipboard-button.w-100(size="sm", text="Copy", :value="toCopy")
            b-button.w-100.text-truncate(
              block,
              variant="primary",
              size="sm",
              @click="downloadAll"
            ) #[icon(name="bi:download")] Download
</template>

<script setup lang="ts">
import { useMainStore } from "../store/main";

enum CollMode {
  GeometryCollection = "geomColl",
  FeatureCollection = "featColl",
  Csv = "csv",
}

const store = useMainStore();

const { format } = storeToRefs(store);

const collMode = ref(CollMode.GeometryCollection);

const options = computed(() => {
  const baseOpts = [
    {
      text: "CSV",
      value: CollMode.Csv,
    },
    {
      text: "GeometryCollection",
      value: CollMode.GeometryCollection,
    },
  ];

  if (format.value === "geojson") {
    baseOpts.push({
      text: "FeatureCollection",
      value: CollMode.FeatureCollection,
    });
  }

  return baseOpts;
});

const toCopy = computed(() => {
  switch (collMode.value) {
    case CollMode.Csv:
      return store.getAsCsv;
    case CollMode.GeometryCollection:
      return store.getAsGeometryCollection;
    case CollMode.FeatureCollection:
      return store.getAsFeatureCollection;
    default:
      break;
  }
});

const extension = useGeoFormat(format);

const { downloadFile } = useDownload(extension);

function downloadAll() {
  downloadFile(toCopy.value as string, "allFeatures");
}
</script>
