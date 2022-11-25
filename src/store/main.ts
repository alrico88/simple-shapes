import { defineStore } from 'pinia';
import { convertToWK, parseFromWK } from 'wkt-parser-helper';
import { useLocalStorage } from '@vueuse/core';
import { Formatter } from 'fracturedjsonjs';
import { getGeoJSONBBox } from 'bbox-helper-functions';
import { StorePolygon } from '../models/StorePolygon';
import { getBasicGeometriesToAdd } from '../helpers/validators';

const formatter = new Formatter();

export const useMainStore = defineStore('main', {
  state: () => ({
    polygons: useLocalStorage<StorePolygon[]>('polygons', []),
    format: useLocalStorage('format', 'wkt'),
    showLabels: useLocalStorage('showLabels', true),
    mapStyles: [
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
    ],
    selectedMapStyle: useLocalStorage('mapStyle', 'esri'),
  }),
  getters: {
    getPolygonIds(state) {
      return state.polygons.map((d) => d.id);
    },
    getAsGeometryCollection(state) {
      if (state.format === 'wkt') {
        return `GEOMETRYCOLLECTION(${state.polygons.map((d) => d.wkt).join(',')})`;
      }

      return formatter.Serialize({
        type: 'GeometryCollection',
        geometries: state.polygons.map(({ wkt }) => parseFromWK(wkt)),
      }) as string;
    },
    getAsFeatureCollection(state) {
      return formatter.Serialize({
        type: 'FeatureCollection',
        features: state.polygons.map((d) => parseFromWK(d.wkt, true, {
          id: d.id,
        })),
      }) as string;
    },
    tile(state) {
      const fallbackStyle = state.mapStyles[5];

      const info = state.mapStyles.find((d) => d.key === state.selectedMapStyle);

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
    },
    polygonsBBox() {
      return getGeoJSONBBox(JSON.parse(this.getAsFeatureCollection as any));
    },
  },
  actions: {
    addPolygon(geojson: any, id?: string): void {
      const wkt = convertToWK(geojson);
      const newPolygon = new StorePolygon(wkt);

      if (id) {
        newPolygon.id = id;
      }

      this.polygons.push(newPolygon);
    },
    addWkt(wkt: string): void {
      const newPolygon = new StorePolygon(wkt);

      this.polygons.push(newPolygon);
    },
    deletePolygon(id: string): void {
      const pos = this.getPolygonIds.indexOf(id);

      if (pos !== -1) {
        this.polygons.splice(pos, 1);
      }
    },
    addShapes(parsed: any): void {
      const geomsToAdd = getBasicGeometriesToAdd(parsed);

      geomsToAdd.forEach((geom) => {
        this.addPolygon(geom);
      });
    },
    clearPolygons(): void {
      this.polygons = [];
    },
    toggleVisibility() {
      this.polygons.forEach((poly) => {
        // eslint-disable-next-line no-param-reassign
        poly.visible = !poly.visible;
      });
    },
    turnVisibility(status: boolean) {
      this.polygons.forEach((poly) => {
        // eslint-disable-next-line no-param-reassign
        poly.visible = status;
      });
    },
  },
});
