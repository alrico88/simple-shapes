<template lang="pug">
.vstack.gap-2
  b-form-group(label="Map Style")
    b-form-select(v-model="selectedMapStyle" :options="mapStyleOptions")
  b-form-group(label="Other")
    b-form-checkbox(
      v-model="showLabels",
      switch
      id="showLabelsSwitch"
    ) Show Labels in map
</template>
<script setup lang="ts">
import { useMainStore } from "../store/main";

const store = useMainStore();
const { showLabels, selectedMapStyle } = storeToRefs(store);

const mapStyleOptions = store.mapStyles.map((d) => ({
  text: d.text,
  value: d.key,
}));
</script>
