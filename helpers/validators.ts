import { parseFromWK } from "wkt-parser-helper";

export function validateWKT(string: string): void {
  const parsed = parseFromWK(string);

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

    if (elements.length !== 2) {
      throw new Error("only latitude,longitude are supported");
    }

    const [latitude, longitude] = elements.map(Number);

    if (latitude < -90 || latitude > 90) {
      throw new Error(
        `invalid latitude ${latitude}. should be between -90 and 90`,
      );
    }

    if (longitude < -180 || longitude > 180) {
      throw new Error(
        `invalid longitude ${longitude}. should be between -180 and 180`,
      );
    }
  });
}
