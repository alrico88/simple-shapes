<template lang="pug">
.row
  .col
    .hstack.gap-2.justify-content-between.align-items-center
      div #[icon(name="bi:laptop")] Made by #[nuxt-link.font-weight-bold(:to="personalLink", target="_blank") Alberto Rico]
      div Code on #[nuxt-link(:to="repoLink", target="_blank") #[icon(name="bi:github")] Github]
</template>

<script setup lang="ts">
const personalLink = "https://alrico.es";
const repoLink = "https://github.com/alrico88/simple-shapes";
</script>
