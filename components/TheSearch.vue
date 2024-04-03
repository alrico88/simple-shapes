<template lang="pug">
.vstack.gap-2
  b-form-group.mb-0
    b-form-input(
      v-model="searchTerm",
      type="text",
      placeholder="Enter a search term"
    )
  b-list-group(v-if="showList")
    template(v-if="loading")
      b-list-group-item.text-center
        b-spinner
    template(v-else)
      b-list-group-item(
        v-for="place of suggestions",
        :key="place.properties.osm_id",
        button,
        @click="() => searchStore.selectSearch(place)"
      )
        .hstack.gap-2.justify-content-between
          .vstack.gap-1
            .fw-bold {{ place.properties.name }}
            div {{ place.properties.country }}
          .text-muted {{ place.properties.osm_value }}
  b-card(v-if="selectedSearch", no-body)
    b-card-header.fw-bold.text-uppercase Search result
    b-card-body.p-0
      search-details(:place="selectedSearch.properties")
    b-card-footer
      .vstack.gap-2
        .hstack.gap-2
          b-button.w-100(
            variant="primary",
            @click="addPoint",
            :disabled="addedPoint"
          )
            icon(name="gis:copy-point")
            |
            | {{ addedPoint ? "Added" : "Add as point" }}
          b-button.w-100(
            variant="primary",
            @click="addExtent",
            :disabled="!selectedSearch.properties.extent || addedBBox"
          )
            icon(name="gis:bbox-alt")
            |
            | {{ addedBBox ? "Added" : "Add as BBox" }}
        b-button.w-100(
          variant="secondary",
          @click="searchStore.removeSearchSelection"
        )
          icon(name="pixelarticons:remove-box")
          |
          | Remove search pin
</template>

<script setup lang="ts">
import { BBoxToGeoJSONPolygon } from "bbox-helper-functions";
import { search, asSimpleArray } from "photon-geocoder";
import { useMainStore } from "../store/main";
import { useSearchStore } from "../store/search";

const mainStore = useMainStore();

const searchStore = useSearchStore();
const { searchTerm, suggestions, loading, selectedSearch } =
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
