import shortid from "shortid";
import chroma from "chroma-js";
import { uniqueId } from "lodash-es";

export class StorePolygon {
  public wkt: string;

  public id: string;

  public name: string;

  public color?: string;

  public visible: boolean;

  constructor(wkt: string) {
    this.id = shortid();
    this.name = uniqueId("polygon_");
    this.wkt = wkt;
    this.color = chroma.random().hex();
    this.visible = true;
  }
}
