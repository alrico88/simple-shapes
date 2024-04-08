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
    v-model="mapSettingsModal",
    title="Map Options",
    title-class="modal-title",
    hide-footer,
    lazy
  )
    map-options
  b-modal(
    v-model="randomPointsModal.modal",
    @close="randomPointsModal.wkt = null",
    title="Generate random points",
    title-class="modal-title",
    lazy,
    hide-footer
  )
    get-random(
      v-if="randomPointsModal.wkt",
      :shape="randomPointsModal.wkt.wkt",
      :name="randomPointsModal.wkt.name",
      @close="randomPointsModal.modal = false"
    )
  b-modal(
    v-model="geohashesModal.modal",
    @close="geohashesModal.modal = false",
    title="Find geohashes inside",
    title-class="modal-title",
    lazy,
    hide-footer
  )
    get-geohashes(
      v-if="geohashesModal.wkt",
      :shape="geohashesModal.wkt",
      :name="geohashesModal.name",
      @close="geohashesModal.modal = false"
    )
  b-modal(
    v-model="applyBufferModal.modal",
    @close="applyBufferModal.modal = false",
    title="Apply buffer to shape",
    title-class="modal-title",
    lazy,
    hide-footer
  )
    apply-buffer(
      :id="applyBufferModal.id",
      :shape="applyBufferModal.wkt",
      @close="applyBufferModal.modal = false"
    )
  b-offcanvas(
    v-model="searchInterfaceModal",
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
  mapSettingsModal,
  searchInterfaceModal,
  randomPointsModal,
  applyBufferModal,
  geohashesModal,
} = storeToRefs(store);

function hideSearchInterface() {
  searchInterfaceModal.value = false;
}
</script>
