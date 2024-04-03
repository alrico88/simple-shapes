<template lang="pug">
.row.mx-0.g-0
  .col-lg-8.col-md-7.col-6.vh-100
    the-map
  .col-lg-4.col-md-5.col-6.border-left.vh-100
    the-result
  b-modal(
    v-model="addModal",
    size="lg",
    @close="() => { addModal = false; }",
    title="Add manually",
    title-class="modal-title",
    hide-footer,
    lazy
  )
    add-manually(@done="() => { addModal = false; }")
  b-modal(
    v-model="mapSettings",
    @close="() => { mapSettings = false; }",
    title="Map Options",
    title-class="modal-title",
    hide-footer,
    lazy
  )
    map-options
  b-modal(
    v-model="randomPoints",
    @close="randomPointsWkt = null",
    title="Generate random points",
    title-class="modal-title",
    lazy,
    hide-footer
  )
    get-random(
      v-if="randomPointsWkt",
      :shape="randomPointsWkt.wkt",
      :name="randomPointsWkt.name"
    )
  b-offcanvas(
    v-model="searchInterface",
    placement="end",
    @hide="hideSearchInterface",
    title="Search"
  )
    .p-2.bg-white
      the-search
</template>

<script setup lang="ts">
import { useModalsStore } from "./store/modals";

const store = useModalsStore();
const {
  addModal,
  mapSettings,
  searchInterface,
  randomPoints,
  randomPointsWkt,
} = storeToRefs(store);

function hideSearchInterface() {
  searchInterface.value = false;
}
</script>
