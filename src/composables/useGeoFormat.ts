import { computed, Ref } from 'vue';

export function useGeoFormat(geoFormat: Ref<string>) {
  return computed(() => (geoFormat.value === 'wkt' ? 'txt' : 'geojson'));
}
