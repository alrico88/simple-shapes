<template lang="pug">
.row
  .col
    .alert.alert-primary.border-primary.mb-2.auto-mb
      .row.mb-2
        .col
          justify-between(:gap="2")
            div Get all features as
            .flex-grow-1
              b-form-select.w-100(:options="options", v-model="collMode")
      .row
        .col
          .hstack.gap-2
            clipboard-button.w-100(
              size="sm",
              text="Copy",
              :value="toCopy"
            )
            button.btn.btn-primary.btn-sm.w-100(
              @click='downloadAll'
            ) #[icon(name="bi:download")] Download
</template>

<script setup lang="ts">
import { useMainStore } from "../store/main";

enum CollMode {
  GeometryCollection = "geomColl",
  FeatureCollection = "featColl",
}

const store = useMainStore();

const { format, getAsGeometryCollection, getAsFeatureCollection } =
  storeToRefs(store);

const collMode = ref(CollMode.GeometryCollection);

const options = computed(() => {
  const baseOpts = [
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
  if (collMode.value === CollMode.GeometryCollection) {
    return getAsGeometryCollection.value;
  }
  return getAsFeatureCollection.value;
});

const extension = useGeoFormat(format);

const { downloadFile } = useDownload(extension);

function downloadAll() {
  downloadFile(toCopy.value as string, "allFeatures");
}
</script>
