<script setup lang="ts">
import { getAvatar } from '../../utils/assetsHelper'
import PercentageBadge from './percentage-badge.vue'

defineProps({
  title: {
    type: String,
    default: ''
  },
  badge: {
    type: Boolean,
    default: false
  },
  badge_label: {
    type: Number || String
  },
  badge_arrow: {
    type: String
  },
  badge_success: {
    type: String
  },
  icon: {
    type: Object
  },
  image: {
    type: String
  }
})
const avatar = (avatar: string | null | undefined) => getAvatar(avatar)
</script>
<template>
  <div class="col project-stat-box">
    <div class="py-4 px-3">
      <h5 class="text-muted text-uppercase fs-13 project-stat-title" v-if="!image">
        {{ title }}
        <PercentageBadge
          v-if="badge"
          :label="badge_label"
          :status="badge_success"
          :arrow="badge_arrow"
        ></PercentageBadge>
      </h5>
      <div class="d-flex align-items-center">
        <div class="flex-shrink-0">
          <i v-if="icon" :class="icon.className" :style="{ color: icon.color }"></i>
          <img
            v-if="image || image === null"
            :src="avatar(image)"
            class="avatar-sm rounded-circle mt-2"
          />
        </div>
        <div :class="'flex-grow-1 ' + (image ? 'ms-3' : 'ms-2')">
          <slot name="boxCardBody"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<style></style>
