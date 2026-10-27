import { defineStore } from "pinia";
import { geojsonToWkt, wktToGeojson } from "wkt-parser-helper";
import { Formatter } from "fracturedjsonjs";
import { getGeoJSONBBox } from "bbox-helper-functions";
import { computed } from "vue";
import { StorePolygon } from "../models/StorePolygon";
import {
  getBasicGeometriesToAdd,
  validateTileUrl,
} from "../helpers/validators";
import { unparse } from "papaparse";
import shortid from "shortid";

type CustomMapStyle = { key: string; text: string; url: string };

const formatter = new Formatter();

export const useMainStore = defineStore("main", () => {
  const polygons = usePersistedRef<StorePolygon[]>("polygons", []);
  const format = usePersistedRef<"wkt" | "geojson">("format", "wkt");
  const showLabels = usePersistedRef("showLabels", true);

  const builtInMapStyles = [
    {
      key: "osm",
      text: "OpenStreetMap",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attr: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
    {
      key: "esriSat",
      text: "ESRI World Imagery",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attr: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
    {
      key: "esri",
      text: "ESRI WorldStreetMap",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
      attr: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    },
  ];

  const customMapStyles = useLocalStorage<CustomMapStyle[]>(
    "customMapStyles",
    []
  );

  const mapStyles = computed(() => [
    ...builtInMapStyles,
    ...customMapStyles.value.map((d) => ({
      key: d.key,
      text: d.text,
      url: d.url,
      attr: "",
      custom: true,
    })),
  ]);

  const selectedMapStyle = useLocalStorage("mapStyle", "esri");

  function addCustomMapStyle(text: string, url: string): void {
    const cleanUrl = url.trim();

    validateTileUrl(cleanUrl);

    const key = `custom-${shortid()}`;

    customMapStyles.value.push({ key, text: text.trim(), url: cleanUrl });
    selectedMapStyle.value = key;
  }

  function removeCustomMapStyle(key: string): void {
    customMapStyles.value = customMapStyles.value.filter((d) => d.key !== key);

    if (selectedMapStyle.value === key) {
      selectedMapStyle.value = "esri";
    }
  }

  const getPolygonIds = useArrayMap(polygons, (d) => d.id);

  const getAsGeometryCollection = computed(() => {
    if (format.value === "wkt") {
      return `GEOMETRYCOLLECTION(${polygons.value
        .map((d) => d.wkt)
        .join(",")})`;
    }
    return formatter.Serialize({
      type: "GeometryCollection",
      geometries: polygons.value.map(({ wkt }) => wktToGeojson(wkt)),
    }) as string;
  });

  const getAsFeatureCollection = computed(
    () =>
      formatter.Serialize({
        type: "FeatureCollection",
        features: polygons.value.map((d) =>
          wktToGeojson(d.wkt, true, {
            id: d.id,
            name: d.name,
            color: d.color,
          })
        ),
      }) as string
  );

  const getAsCsv = computed(() => {
    const featColl = polygons.value.map((d) => {
      return {
        id: d.id,
        name: d.name,
        geometry:
          format.value === "wkt" ? d.wkt : JSON.stringify(wktToGeojson(d.wkt)),
      };
    });

    return unparse(featColl, {
      header: true,
    });
  });

  const tile = computed(() => {
    const fallbackStyle = builtInMapStyles.find((d) => d.key === "esri")!;

    const info = mapStyles.value.find((d) => d.key === selectedMapStyle.value);

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

  function addPolygon(geojson: any, name?: string): void {
    const wkt = geojsonToWkt(geojson);
    const newPolygon = new StorePolygon(wkt);

    if (name) {
      newPolygon.name = name;
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
    const newPolygons = geomsToAdd.map(
      (geom) => new StorePolygon(geojsonToWkt(geom))
    );

    polygons.value = [...polygons.value, ...newPolygons];
  }

  function clearPolygons(): void {
    polygons.value = [];
  }

  function toggleVisibility() {
    polygons.value.forEach((poly) => {
       
      poly.visible = !poly.visible;
    });
  }

  function turnVisibility(status: boolean) {
    polygons.value.forEach((poly) => {
       
      poly.visible = status;
    });
  }

  return {
    polygons,
    format,
    showLabels,
    selectedMapStyle,
    mapStyles,
    customMapStyles,
    addCustomMapStyle,
    removeCustomMapStyle,
    getPolygonIds,
    getAsGeometryCollection,
    getAsFeatureCollection,
    getAsCsv,
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
