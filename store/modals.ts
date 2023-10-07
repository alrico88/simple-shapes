import { defineStore } from "pinia";

export const useModalsStore = defineStore("modals", {
  state: () => ({
    addModal: false,
    mapSettings: false,
    searchInterface: false,
  }),
});
