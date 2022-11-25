<template lang='pug'>
.row
  .col
    label Actions
.row.g-2.row-cols-md-4.row-cols-2
  .col
    c-dropdown.w-100(color="secondary", variant="btn-group")
      c-button.text-truncate(
        size="sm",
        color="secondary",
        @click="toggleVisibility"
      ) Toggle visibility
      c-dropdown-toggle(split, color="secondary", size="sm")
      c-dropdown-menu
        c-dropdown-item(href="#", @click="() => store.turnVisibility(true)") Show all
        c-dropdown-item(href="#", @click="() => store.turnVisibility(false)") Hide all
  .col
    c-button.text-truncate.w-100(
      size="sm",
      color="secondary",
      @click="fitAllShapes"
    ) Fit all shapes
  .col
    c-button.text-truncate.w-100(
      size="sm",
      color="secondary",
      @click="downloadMap"
    ) Export map
  .col
    c-button.text-truncate.w-100(
      size="sm",
      color="danger",
      @click="deleteHandler"
      :disabled="polygons.length === 0"
    ) {{ deleteConfirmation ? 'Sure?' : 'Remove all' }}
</template>

<script setup lang="ts">
import {
  CButton, CDropdown, CDropdownMenu, CDropdownToggle, CDropdownItem,
} from '@coreui/bootstrap-vue';
import { storeToRefs } from 'pinia';
import { useDeleteConfirm } from '../composables/useDeleteConfirm';
import mapEmitter from '../emitters/mapEmitter';
import { useMainStore } from '../store/main';

const store = useMainStore();
const { polygons, polygonsBBox } = storeToRefs(store);

function toggleVisibility() {
  store.toggleVisibility();
}

function fitAllShapes() {
  mapEmitter.emit('goTo', polygonsBBox.value);
}

async function downloadMap() {
  mapEmitter.emit('download');
}

const { deleteConfirmation, deleteHandler } = useDeleteConfirm(() => {
  store.clearPolygons();
});
</script>
