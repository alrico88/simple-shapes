import mitt from 'mitt';

type MapEmitterChannels = {
  goTo: number[],
  focusOn: [number, number],
  download: void
}

export default mitt<MapEmitterChannels>();
