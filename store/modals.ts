import { defineStore } from "pinia";

export const useModalsStore = defineStore("modals", () => {
  const addModal = ref(false);
  const mapSettingsModal = ref(false);
  const searchInterfaceModal = ref(false);
  const randomPointsModal = reactive<{
    modal: boolean;
    wkt: null | { name: string; wkt: string };
  }>({
    modal: false,
    wkt: null,
  });
  const applyBufferModal = reactive({
    modal: false,
    id: "",
    wkt: "",
  });
  const geohashesModal = reactive({
    modal: false,
    name: "",
    wkt: "",
  });

  return {
    addModal,
    mapSettingsModal,
    searchInterfaceModal,
    randomPointsModal,
    applyBufferModal,
    geohashesModal,
  };
});
