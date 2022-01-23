import shortid from 'shortid';
import chroma from 'chroma-js';

export class StorePolygon {
  public wkt: string;

  public id: string;

  public color?: string;

  constructor(wkt: string) {
    this.id = shortid();
    this.wkt = wkt;
    this.color = chroma.random().hex();
  }
}
