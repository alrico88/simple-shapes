import { defineStore } from "pinia";
import { reactive, ref, shallowRef } from "vue";
import type { Feature, Point } from "photon-geocoder/dist/helpers/geojson";
import mapEmitter from "../emitters/mapEmitter";
import { parseCoordinatePair } from "../helpers/validators";

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

  const coords = reactive({ latitude: "", longitude: "" });
  const coordsError = ref("");

  function goToCoordinates(zoom?: number): void {
    try {
      const { latitude, longitude } = parseCoordinatePair(
        coords.latitude,
        coords.longitude
      );

      coordsError.value = "";
      mapEmitter.emit("goToCoords", { coords: [longitude, latitude], zoom });
    } catch (err) {
      coordsError.value = (err as Error).message;
    }
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
    coords,
    coordsError,
    goToCoordinates,
  };
});
