<template lang="pug">
.row.mb-2
  .col
    b-form(@submit.prevent)
      .row.row-cols-1.row-cols-md-2.gx-2
        .col
          .form-group.mb-0(label="Format")
            label Shape format
            b-button-group.d-flex(size="sm", role="group")
              b-button.w-100(
                v-for="item of formats"
                :key="item.value",
                @click="() => format = item.value"
                variant="secondary",
                :class="{active: format === item.value}"
              ) {{ item.text }}
        .col
          .form-group.mb-0
            label.w-100 Map options
            button.btn.btn-secondary.btn-sm.w-100(
              @click="openMapSettings"
            ) Show options
</template>

<script setup lang="ts">
import { useMainStore } from "../store/main";
import { useModalsStore } from "../store/modals";

const store = useMainStore();
const modalsStore = useModalsStore();

const { format } = storeToRefs(store);
const { mapSettings } = storeToRefs(modalsStore);

function openMapSettings() {
  mapSettings.value = true;
}

enum Format {
  wkt = "wkt",
  geojson = "geojson",
}

const formats = [
  {
    text: "WKT",
    value: Format.wkt,
  },
  {
    text: "GeoJSON",
    value: Format.geojson,
  },
];
</script>
