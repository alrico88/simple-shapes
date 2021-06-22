import Vue from 'vue';
import Vuex from 'vuex';
import {convertToWK, parseFromWK} from 'wkt-parser-helper';
import shortid from 'shortid';
import VuexPersistence from 'vuex-persist';
import area from '@turf/area';
import {processNumber} from 'number-helper-functions';

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
});

Vue.use(Vuex);

class WktItem {

  /**
   * Creates an instance of WktItem
   * @param {string} wkt
   */
  constructor(wkt) {
    this.id = shortid();
    this.wkt = wkt;
  }
}

export default new Vuex.Store({
  state: {
    polygons: [],
    format: 'wkt',
  },
  getters: {
    getPolygons(state) {
      return state.polygons;
    },
    getPolygonIds(state) {
      return state.polygons.map((d) => d.id);
    },
    getAsGeometryCollection(state) {
      const {format, polygons} = state;

      return format === 'wkt'
          ? `GEOMETRYCOLLECTION(${polygons
              .map((d) => d.wkt)
              .join(',')})`
          : JSON.stringify({
            type: 'GeometryCollection',
            geometries: polygons.map((d) => parseFromWK(d.wkt)),
          }, null, 2);
    },
    getPolygonArea: (state) => (id) => {
      const obj = state.polygons.find((d) => d.id === id);

      return processNumber(area(parseFromWK(obj.wkt)) / 1000000);
    },
  },
  mutations: {
    updatePolygons(state, polygons) {
      state.polygons = polygons;
    },
    addToPolygons(state, polygon) {
      state.polygons.push(polygon);
    },
    deleteFromPolygons(state, position) {
      state.polygons.splice(position, 1);
    },
    changeFormat(state, format) {
      state.format = format;
    },
  },
  actions: {
    addPolygon(context, GeoJSON) {
      const wkt = convertToWK(GeoJSON);
      const newPolygon = new WktItem(wkt);
      context.commit('addToPolygons', newPolygon);
    },
    addWkt(context, wkt) {
      const newPolygon = new WktItem(wkt);
      context.commit('addToPolygons', newPolygon);
    },
    deletePolygon(context, id) {
      const pos = context.getters.getPolygonIds.indexOf(id);
      if (pos !== -1) {
        context.commit('deleteFromPolygons', pos);
      }
    },
    deleteAllPolygons(context) {
      context.commit('updatePolygons', []);
    },
  },
  plugins: [vuexLocal.plugin],
});
