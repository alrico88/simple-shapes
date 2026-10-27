<template lang="pug">
.mb-3.grid.grid-cols-1.gap-3(class="md:grid-cols-2")
  u-form-field(label="Shape format")
    u-tabs(
      v-model="format",
      :items="formats",
      :content="false",
      variant="pill",
      color="primary",
      :ui="{ root: 'w-full', list: 'w-full' }"
    )
  u-form-field(label="Map options")
    u-popover(:ui="{ content: 'w-80 p-4' }")
      u-button(
        block,
        color="neutral",
        variant="subtle",
        icon="i-lucide-sliders-horizontal",
        label="Show options"
      )
      template(#content)
        map-options
</template>

<script setup lang="ts">
import { useMainStore } from "../store/main";

const store = useMainStore();

const { format } = storeToRefs(store);

const formats = [
  { label: "WKT", value: "wkt" },
  { label: "GeoJSON", value: "geojson" },
];
</script>
