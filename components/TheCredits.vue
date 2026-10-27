<template lang="pug">
.flex.items-center.justify-between.gap-2
  div #[u-icon(name="bi:laptop")] Made by #[u-link.font-bold(:to="personalLink", target="_blank") Alberto Rico]
  div Code on #[u-link(:to="repoLink", target="_blank") #[u-icon(name="bi:github")] Github]
</template>

<script setup lang="ts">
const personalLink = "https://alrico.es";
const repoLink = "https://github.com/alrico88/simple-shapes";
</script>
