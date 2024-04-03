import { defineStore } from "pinia";

export const useModalsStore = defineStore("modals", () => {
  const addModal = ref(false);
  const mapSettings = ref(false);
  const searchInterface = ref(false);
  const randomPoints = ref(false);
  const randomPointsWkt = ref<null | { name: string; wkt: string }>(null);

  return {
    addModal,
    mapSettings,
    searchInterface,
    randomPoints,
    randomPointsWkt,
  };
});
