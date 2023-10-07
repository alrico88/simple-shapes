import { defineStore } from "pinia";
import { ref, shallowRef } from "vue";
import type { Feature, Point } from "photon-geocoder/dist/helpers/geojson";
import mapEmitter from "../emitters/mapEmitter";

export const useSearchStore = defineStore("search", () => {
  const suggestions = shallowRef<Feature<Point>[]>([]);

  const loading = ref(false);

  const searchTerm = ref("");

  const selectedSearch = ref<Feature<Point> | null>(null);

  function selectSearch(feature: Feature<Point>): void {
    selectedSearch.value = feature;

    suggestions.value = [];
    searchTerm.value = "";

    mapEmitter.emit("focusOn", feature.geometry.coordinates);
  }

  function removeSearchSelection() {
    selectedSearch.value = null;
  }

  return {
    searchTerm,
    suggestions,
    loading,
    selectSearch,
    selectedSearch,
    removeSearchSelection,
  };
});
