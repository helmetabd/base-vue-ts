<script setup lang="ts">
defineProps({
  label: {
    type: Number || String
  },
  status: {
    type: String
  },
  arrow: {
    type: String
  }
})
</script>
<template>
  <span :class="`badge bg-${status}-subtle text-${status} float-end`">
    <i v-if="arrow" :class="`ri-arrow-${arrow}-s-fill align-middle me-1`"></i>{{ label }} %
  </span>
</template>
<style></style>
