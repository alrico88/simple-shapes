<template lang="pug">
div
  label.mb-1.block.text-sm.font-medium Actions
  .grid.grid-cols-2.gap-2(class="xl:grid-cols-4")
    u-dropdown-menu(:items="visibilityItems")
      u-button(
        block,
        color="neutral",
        variant="subtle",
        icon="i-lucide-eye",
        label="Visibility",
        trailing-icon="i-lucide-chevron-down"
      )
    u-button(
      block,
      color="neutral",
      variant="subtle",
      icon="i-lucide-maximize",
      label="Fit all",
      @click="fitAllShapes"
    )
    u-button(
      block,
      color="neutral",
      variant="subtle",
      icon="i-lucide-image-down",
      label="Export",
      @click="downloadMap"
    )
    u-button(
      block,
      color="error",
      variant="soft",
      icon="i-lucide-trash-2",
      :label="deleteConfirmation ? 'Sure?' : 'Remove all'",
      :disabled="polygons.length === 0",
      @click="deleteHandler"
    )
</template>

<script setup lang="ts">
import { useDeleteConfirm } from "../composables/useDeleteConfirm";
import mapEmitter from "../emitters/mapEmitter";
import { useMainStore } from "../store/main";

const store = useMainStore();
const { polygons, polygonsBBox } = storeToRefs(store);

const visibilityItems = [
  [{ label: "Toggle visibility", onSelect: toggleVisibility }],
  [
    { label: "Show all", onSelect: () => store.turnVisibility(true) },
    { label: "Hide all", onSelect: () => store.turnVisibility(false) },
  ],
];

function toggleVisibility() {
  store.toggleVisibility();
}

function fitAllShapes() {
  mapEmitter.emit("goTo", polygonsBBox.value);
}

async function downloadMap() {
  mapEmitter.emit("download");
}

const { deleteConfirmation, deleteHandler } = useDeleteConfirm(() => {
  store.clearPolygons();
});
</script>
