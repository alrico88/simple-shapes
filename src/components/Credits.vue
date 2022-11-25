<template lang="pug">
.row
  .col
    .d-flex.justify-content-between.align-items-center
      div
        p.mb-0 #[icon-laptop] Made by #[a.font-weight-bold(href="https://alrico.es", target='_blank') Alberto Rico]
      div
        p.mb-0 Code on
          a.ms-2(href='https://github.com/alrico88/simple-shapes', target='_blank') #[icon-github] Github
</template>

<script setup lang="ts">
import IconLaptop from '~icons/bi/laptop';
import IconGithub from '~icons/bi/github';
</script>
