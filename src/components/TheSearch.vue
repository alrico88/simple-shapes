<template lang='pug'>
.vstack.gap-2
  .form-group.mb-0
    input.form-control(v-model="searchTerm", type="text", placeholder="Enter a search term")
  .list-group(v-if="showList")
    template(v-if="loading")
      .list-group-item.text-center
        .spinner.spinner-border
    template(v-else)
      button.list-group-item.list-group-item-action(
        v-for="place of suggestions",
        :key="place.properties.osm_id",
        @click="() => store.selectSearch(place)"
      )
        .hstack.gap-2.justify-content-between
          .vstack.gap-1
            .fw-bold {{ place.properties.name }}
            div {{ place.properties.country }}
          .text-muted {{ place.properties.osm_value }}
  .card(v-if="selectedSearch")
    .card-header.fw-bold.text-uppercase Search result
    .card-body.p-0
      search-details(:place="selectedSearch.properties")
    .card-footer
      button.btn.btn-secondary.w-100(@click="store.removeSearchSelection") Remove search pin
</template>

<script setup lang="ts">
import { debouncedWatch } from '@vueuse/core';
import { search, asSimpleArray } from 'photon-geocoder';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useSearchStore } from '../store/search';
import SearchDetails from './SearchDetails.vue';

const store = useSearchStore();
const {
  searchTerm, suggestions, loading, selectedSearch,
} = storeToRefs(store);

const showList = computed(() => loading.value || suggestions.value.length > 0);

debouncedWatch(searchTerm, async (val) => {
  try {
    if (val === '') {
      suggestions.value = [];

      return;
    }

    loading.value = true;

    const places = asSimpleArray(await search(val, {
      language: 'en',
    }));

    suggestions.value = places;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}, {
  debounce: 300,
});
</script>
