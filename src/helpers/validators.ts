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
  } if (type === 'Feature') {
    return [parsed.geometry];
  } if (type === 'GeometryCollection') {
    return parsed.geometries;
  }
  return [parsed];
}
