import shortid from "shortid";
import chroma from "chroma-js";

export class StorePolygon {
  public wkt: string;

  public id: string;

  public name: string;

  public color?: string;

  public visible: boolean;

  constructor(wkt: string) {
    const key = shortid();

    this.id = key;
    this.name = key;
    this.wkt = wkt;
    this.color = chroma.random().hex();
    this.visible = true;
  }
}
