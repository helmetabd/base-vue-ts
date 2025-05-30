<script setup lang="ts">
import { RouterView } from 'vue-router'
import router from './router';
</script>

<template>
  <RouterView :key="router.currentRoute.value.path"/>
</template>

<style>
@import '/src/assets/custom-css/dataTables.bootstrap5.min.css';
@import '/src/assets/custom-css/responsive.bootstrap.min.css';
@import '/src/assets/custom-css/buttons.dataTables.min.css';
@import '/src/assets/custom-css/buttons.bootstrap5.min.css';
</style>
