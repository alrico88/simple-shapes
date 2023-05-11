import { parseFromWK } from 'wkt-parser-helper';

export function validateWKT(string: string): void {
  const parsed = parseFromWK(string);

  if (!parsed) {
    throw new Error('invalid WKT');
  }
}

export function validateGeoJSON(string: string): void {
  JSON.parse(string);
}

export function getBasicGeometriesToAdd(parsed: any): any[] {
  const { type } = parsed;

  if (type === 'FeatureCollection') {
    return parsed.features.flatMap((d: any) => getBasicGeometriesToAdd(d));
  }
  if (type === 'Feature') {
    return [parsed.geometry];
  }
  if (type === 'GeometryCollection') {
    return parsed.geometries;
  }
  return [parsed];
}

export function validateTilenames(tilenames: string): void {
  tilenames.split('\n').forEach((tile) => {
    const parsed = JSON.parse(tile);

    if (parsed.length < 3) {
      throw new Error('invalid tilename length');
    }
  });
}

export function validateBBox(bboxStr: string): void {
  const parsed = JSON.parse(bboxStr);

  if (!Array.isArray(parsed)) {
    throw new Error('BBox should be an array');
  }

  if (parsed.length !== 4) {
    throw new Error('BBox should have 4 coordinates');
  }
}
