import Formatter from "string-object-formatter";
import { wktToGeojson } from "wkt-parser-helper";

const tileFormatter = new Formatter();

export function validateWKT(string: string): void {
  const parsed = wktToGeojson(string);

  if (!parsed) {
    throw new Error("invalid WKT");
  }
}

export function validateGeoJSON(string: string): void {
  JSON.parse(string);
}

export function getBasicGeometriesToAdd(parsed: any): any[] {
  const { type } = parsed;

  if (type === "FeatureCollection") {
    return parsed.features.flatMap((d: any) => getBasicGeometriesToAdd(d));
  }
  if (type === "Feature") {
    return [parsed.geometry];
  }
  if (type === "GeometryCollection") {
    return parsed.geometries;
  }
  return [parsed];
}

export function validateTilenames(tilenames: string): void {
  tilenames.split("\n").forEach((tile) => {
    const parsed = JSON.parse(tile);

    if (parsed.length < 3) {
      throw new Error("invalid tilename length");
    }
  });
}

export function validateBBox(bboxStr: string): void {
  const parsed = JSON.parse(bboxStr);

  if (!Array.isArray(parsed)) {
    throw new Error("BBox should be an array");
  }

  if (parsed.length !== 4) {
    throw new Error("BBox should have 4 coordinates");
  }
}

export function validateCoordinates(coordinates: string): void {
  coordinates.split("\n").forEach((coord) => {
    const elements = coord.split(",");
    const len = elements.length;

    if (len < 2 || len > 3) {
      throw new Error(
        "only latitude,longitude and optionally radius are supported"
      );
    }

    const [latitude, longitude] = elements.map(Number) as [number, number];

    if (latitude < -90 || latitude > 90) {
      throw new Error(
        `invalid latitude ${latitude}. should be between -90 and 90`
      );
    }

    if (longitude < -180 || longitude > 180) {
      throw new Error(
        `invalid longitude ${longitude}. should be between -180 and 180`
      );
    }
  });
}

export function parseCoordinatePair(
  latitude: string | number,
  longitude: string | number
): { latitude: number; longitude: number } {
  const lat = Number(String(latitude).trim());
  const lon = Number(String(longitude).trim());

  if (
    String(latitude).trim() === "" ||
    String(longitude).trim() === "" ||
    Number.isNaN(lat) ||
    Number.isNaN(lon)
  ) {
    throw new Error("Latitude and longitude must be numbers");
  }

  if (lat < -90 || lat > 90) {
    throw new Error("Latitude must be between -90 and 90");
  }

  if (lon < -180 || lon > 180) {
    throw new Error("Longitude must be between -180 and 180");
  }

  return { latitude: lat, longitude: lon };
}

export function validateTileUrl(url: string): void {
  if (!/^https?:\/\//i.test(url)) {
    throw new Error("The URL must start with http:// or https://");
  }

  const missing = ["{x}", "{y}", "{z}"].filter((d) => !url.includes(d));

  if (missing.length > 0) {
    throw new Error(`The URL is missing ${missing.join(", ")}`);
  }

  const [unknown] =
    tileFormatter
      .format(url, { x: "0", y: "0", z: "0", s: "a", r: "" })
      .match(/\{[^}]*\}/g) ?? [];

  if (unknown) {
    throw new Error(`Unknown placeholder ${unknown}`);
  }
}
