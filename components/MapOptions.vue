<template lang="pug">
.flex.flex-col.gap-4
  u-form-field(label="Map Style")
    u-select.w-full(v-model="selectedMapStyle", :items="mapStyleOptions")
  u-form-field(label="Other")
    u-switch(v-model="showLabels", label="Show Labels in map")
</template>
<script setup lang="ts">
import { useMainStore } from "../store/main";

const store = useMainStore();
const { showLabels, selectedMapStyle } = storeToRefs(store);

const mapStyleOptions = store.mapStyles.map((d) => ({
  label: d.text,
  value: d.key,
}));
</script>
