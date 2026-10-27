<template lang="pug">
.flex.flex-col.gap-4
  u-form-field(label="Map Style")
    u-select.w-full(v-model="selectedMapStyle", :items="mapStyleOptions")
  u-form-field(label="Other")
    u-switch(v-model="showLabels", label="Show Labels in map")
  u-separator
  form.flex.flex-col.gap-3(@submit.prevent="addCustom")
    u-form-field(
      label="Custom tile layer",
      description="Slippy map tiles URL. Use {x}, {y} and {z}, and optionally {s} and {r}.",
      :error="error || undefined"
    )
      .flex.flex-col.gap-2
        u-input.w-full(v-model="customName", placeholder="Name")
        u-input.w-full(
          v-model="customUrl",
          placeholder="https://example.com/{z}/{x}/{y}.png"
        )
    u-button(
      type="submit",
      block,
      color="neutral",
      variant="subtle",
      icon="i-lucide-plus",
      label="Add layer",
      :disabled="!canAdd"
    )
  .flex.flex-col.gap-1(v-if="customMapStyles.length > 0")
    .flex.items-center.justify-between.gap-2(
      v-for="style of customMapStyles",
      :key="style.key"
    )
      span.truncate.text-sm {{ style.text }}
      u-button(
        color="error",
        variant="ghost",
        icon="i-lucide-trash-2",
        aria-label="Remove layer",
        @click="removeCustomMapStyle(style.key)"
      )
</template>

<script setup lang="ts">
import { useMainStore } from "../store/main";

const store = useMainStore();
const { showLabels, selectedMapStyle, mapStyles, customMapStyles } =
  storeToRefs(store);
const { removeCustomMapStyle } = store;

const customName = ref("");
const customUrl = ref("");
const error = ref("");

const mapStyleOptions = computed(() =>
  mapStyles.value.map((d) => ({
    label: d.text,
    value: d.key,
  }))
);

const canAdd = computed(
  () => customName.value.trim() !== "" && customUrl.value.trim() !== ""
);

function addCustom() {
  try {
    store.addCustomMapStyle(customName.value, customUrl.value);
    customName.value = "";
    customUrl.value = "";
    error.value = "";
  } catch (err) {
    error.value = (err as Error).message;
  }
}
</script>
