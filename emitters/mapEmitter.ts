import mitt from "mitt";

type MapEmitterChannels = {
  goTo: number[];
  focusOn: [number, number];
  goToCoords: { coords: [number, number]; zoom?: number };
  download: undefined;
};

export default mitt<MapEmitterChannels>();
