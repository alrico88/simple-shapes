import mitt from 'mitt';

type MapEmitterChannels = {
  goTo: number[],
  download: void
}

export default mitt<MapEmitterChannels>();
