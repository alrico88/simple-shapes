import { defineStore } from 'pinia';
import { convertToWK, parseFromWK } from 'wkt-parser-helper';
import { useArrayMap, useLocalStorage } from '@vueuse/core';
import { Formatter } from 'fracturedjsonjs';
import { getGeoJSONBBox } from 'bbox-helper-functions';
import { computed, ref } from 'vue';
import { StorePolygon } from '../models/StorePolygon';
import { getBasicGeometriesToAdd } from '../helpers/validators';

const formatter = new Formatter();

export const useMainStore = defineStore('main', () => {
  const polygons = useLocalStorage<StorePolygon[]>('polygons', []);
  const format = useLocalStorage<'wkt'|'geojson'>('format', 'wkt');
  const showLabels = useLocalStorage('showLabels', true);

  const mapStyles = [
    {
      key: 'osm',
      text: 'OpenStreetMap',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attr: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
    {
      key: 'cartoLight',
      text: 'CartoDB Positron',
      url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      attr: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
    {
      key: 'cartoDark',
      text: 'CartoDB Dark Matter',
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attr: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
    {
      key: 'cartoVoyager',
      text: 'CartoDB Voyager',
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      attr: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
    {
      key: 'esriSat',
      text: 'ESRI World Imagery',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attr: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
    {
      key: 'esri',
      text: 'ESRI WorldStreetMap',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      attr: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    },
  ];

  const selectedMapStyle = useLocalStorage('mapStyle', 'esri');

  const getPolygonIds = useArrayMap(polygons, (d) => d.id);

  const getAsGeometryCollection = computed(() => {
    if (format.value === 'wkt') {
      return `GEOMETRYCOLLECTION(${polygons.value.map((d) => d.wkt).join(',')})`;
    }
    return formatter.Serialize({
      type: 'GeometryCollection',
      geometries: polygons.value.map(({ wkt }) => parseFromWK(wkt)),
    }) as string;
  });

  const getAsFeatureCollection = computed(() => formatter.Serialize({
    type: 'FeatureCollection',
    features: polygons.value.map((d) => parseFromWK(d.wkt, true, {
      id: d.id,
    })),
  }) as string);

  const tile = computed(() => {
    const fallbackStyle = mapStyles[5];

    const info = mapStyles.find((d) => d.key === selectedMapStyle.value);

    if (!info) {
      return {
        url: fallbackStyle.url,
        attribution: fallbackStyle.attr,
      };
    }

    return {
      url: info.url,
      attribution: info.attr,
    };
  });

  const polygonsBBox = computed(() => {
    const parsed = JSON.parse(getAsFeatureCollection.value as any);

    return getGeoJSONBBox(parsed);
  });

  function addPolygon(geojson: any, id?: string): void {
    const wkt = convertToWK(geojson);
    const newPolygon = new StorePolygon(wkt);

    if (id) {
      newPolygon.id = id;
    }

    polygons.value.push(newPolygon);
  }

  function addWkt(wkt: string): void {
    const newPolygon = new StorePolygon(wkt);

    polygons.value.push(newPolygon);
  }

  function deletePolygon(id: string): void {
    const pos = getPolygonIds.value.indexOf(id);

    if (pos !== -1) {
      polygons.value.splice(pos, 1);
    }
  }

  function addShapes(parsed: any): void {
    const geomsToAdd = getBasicGeometriesToAdd(parsed);

    geomsToAdd.forEach((geom) => {
      addPolygon(geom);
    });
  }

  function clearPolygons(): void {
    polygons.value = [];
  }

  function toggleVisibility() {
    polygons.value.forEach((poly) => {
      // eslint-disable-next-line no-param-reassign
      poly.visible = !poly.visible;
    });
  }

  function turnVisibility(status: boolean) {
    polygons.value.forEach((poly) => {
      // eslint-disable-next-line no-param-reassign
      poly.visible = status;
    });
  }

  return {
    polygons,
    format,
    showLabels,
    selectedMapStyle,
    mapStyles,
    getPolygonIds,
    getAsGeometryCollection,
    getAsFeatureCollection,
    tile,
    polygonsBBox,
    addPolygon,
    deletePolygon,
    addShapes,
    addWkt,
    clearPolygons,
    toggleVisibility,
    turnVisibility,
  };
});
