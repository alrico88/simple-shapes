<template lang="pug">
.row
  .col
    label Actions
.row.g-2.row-cols-md-4.row-cols-2
  .col
    b-dropdown.w-100(variant="secondary", size="sm")
      template(#button-content) Visibility
      b-dropdown-item(href="#", @click.prevent="toggleVisibility") Toggle visibility
      b-dropdown-divider
      b-dropdown-item(href="#", @click.prevent="store.turnVisibility(true)") Show all
      b-dropdown-item(href="#", @click.prevent="store.turnVisibility(false)") Hide all
  .col
    b-button.text-truncate.w-100(
      size="sm",
      variant="secondary",
      @click="fitAllShapes"
    ) Fit all shapes
  .col
    b-button.text-truncate.w-100(
      size="sm",
      variant="secondary",
      @click="downloadMap"
    ) Export map
  .col
    b-button.text-truncate.w-100(
      size="sm",
      variant="danger",
      @click="deleteHandler",
      :disabled="polygons.length === 0"
    ) {{ deleteConfirmation ? "Sure?" : "Remove all" }}
</template>

<script setup lang="ts">
import { useDeleteConfirm } from "../composables/useDeleteConfirm";
import mapEmitter from "../emitters/mapEmitter";
import { useMainStore } from "../store/main";

const store = useMainStore();
const { polygons, polygonsBBox } = storeToRefs(store);

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
