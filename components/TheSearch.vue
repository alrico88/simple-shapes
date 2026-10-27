<template lang="pug">
.flex.flex-col.gap-2
  u-form-field(
    label="Go to coordinates",
    :error="coordsError || undefined"
  )
    .flex.gap-2
      u-input.w-full(
        v-model="coords.latitude",
        placeholder="Latitude",
        @keydown.enter="searchStore.goToCoordinates()"
      )
      u-input.w-full(
        v-model="coords.longitude",
        placeholder="Longitude",
        @keydown.enter="searchStore.goToCoordinates()"
      )
      u-button(
        icon="i-lucide-locate-fixed",
        aria-label="Go to coordinates",
        @click="searchStore.goToCoordinates()"
      )
  u-input.w-full(v-model="searchTerm", placeholder="Enter a search term")
  .divide-y.divide-default.rounded-md.border.border-default.bg-default(
    v-if="showList"
  )
    .p-3.text-center(v-if="loading")
      u-icon.size-5.animate-spin(name="i-lucide-loader-circle")
    template(v-else)
      button.block.w-full.p-3.text-left.cursor-pointer(
        v-for="place of suggestions",
        :key="place.properties.osm_id",
        type="button",
        class="hover:bg-elevated",
        @click="() => searchStore.selectSearch(place)"
      )
        .flex.items-center.justify-between.gap-2
          .flex.flex-col.gap-1
            .font-bold {{ place.properties.name }}
            div {{ place.properties.country }}
          .text-muted {{ place.properties.osm_value }}
  u-card(
    v-if="selectedSearch",
    :ui="{ header: 'p-3 sm:p-3', body: 'p-0 sm:p-0', footer: 'p-3 sm:p-3' }"
  )
    template(#header)
      .font-bold.uppercase Search result
    search-details(:place="selectedSearch.properties")
    template(#footer)
      .flex.flex-col.gap-2
        .flex.gap-2
          u-button(
            block,
            icon="gis:copy-point",
            :label="addedPoint ? 'Added' : 'Add as point'",
            :disabled="addedPoint",
            @click="addPoint"
          )
          u-button(
            block,
            icon="gis:bbox-alt",
            :label="addedBBox ? 'Added' : 'Add as BBox'",
            :disabled="!selectedSearch.properties.extent || addedBBox",
            @click="addExtent"
          )
        u-button(
          block,
          color="neutral",
          icon="pixelarticons:remove-box",
          label="Remove search pin",
          @click="searchStore.removeSearchSelection"
        )
</template>

<script setup lang="ts">
import { BBoxToGeoJSONPolygon } from "bbox-helper-functions";
import { search, asSimpleArray } from "photon-geocoder";
import { useMainStore } from "../store/main";
import { useSearchStore } from "../store/search";

const mainStore = useMainStore();

const searchStore = useSearchStore();
const {
  searchTerm,
  suggestions,
  loading,
  selectedSearch,
  coords,
  coordsError,
} =
  storeToRefs(searchStore);

const showList = computed(() => loading.value || suggestions.value.length > 0);

const refReset = 2000;

const addedPoint = refAutoReset(false, refReset);
const addedBBox = refAutoReset(false, refReset);

debouncedWatch(
  searchTerm,
  async (val) => {
    try {
      if (val === "") {
        suggestions.value = [];

        return;
      }

      loading.value = true;

      const places = asSimpleArray(
        await search(val, {
          language: "en",
        })
      );

      suggestions.value = places;
    } catch (err) {
      console.error(err);
    } finally {
      loading.value = false;
    }
  },
  {
    debounce: 300,
  }
);

function addPoint() {
  mainStore.addPolygon(
    selectedSearch.value,
    selectedSearch.value?.properties.name
  );

  addedPoint.value = true;
}

function addExtent() {
  mainStore.addPolygon(
    BBoxToGeoJSONPolygon(selectedSearch.value?.properties.extent),
    `${selectedSearch.value?.properties.name}_extent`
  );

  addedBBox.value = true;
}
</script>
