<template lang="pug">
.mb-2.flex.flex-col.gap-2.rounded-md.border.bg-brand-100.p-3(class="border-brand-300")
  .flex.items-center.justify-between.gap-2
    div Get all features as
    .flex-1
      u-select.w-full(v-model="collMode", :items="options")
  .flex.gap-2
    clipboard-button.w-full.justify-center(text="Copy", :value="toCopy")
    u-button.w-full.justify-center.truncate(
      icon="bi:download",
      label="Download",
      @click="downloadAll"
    )
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
      label: "CSV",
      value: CollMode.Csv,
    },
    {
      label: "GeometryCollection",
      value: CollMode.GeometryCollection,
    },
  ];

  if (format.value === "geojson") {
    baseOpts.push({
      label: "FeatureCollection",
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
      return "";
  }
});

const extension = useGeoFormat(format);

const { downloadFile } = useDownload(extension);

function downloadAll() {
  downloadFile(toCopy.value as string, "allFeatures");
}
</script>
