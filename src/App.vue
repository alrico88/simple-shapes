<template lang="pug">
#app.container-fluid
  .row
    map-component
    result
</template>

<script>
import MapComponent from './components/Map.vue';
import Result from './components/Result.vue';

export default {
  name: 'App',
  components: {
    MapComponent,
    Result,
  },
  metaInfo: {
    title: 'Simple Shapes',
    description: 'Web app where you can draw any geographical shape and get its representation in WKT or GeoJSON',
    author: 'Alberto Rico',
  },
};
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
