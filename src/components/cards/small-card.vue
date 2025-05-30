<script setup lang="ts">
defineProps({
  percentage: {
    type: Boolean,
    default: false
  },
  percentage_label: {},
  percentage_success: {
    type: Boolean
  },
  routeName: { type: String },
  customIcon: {
    type: Boolean,
    default: false
  }
})
</script>
<template>
  <div class="card">
    <div class="card-body">
      <component
        :is="routeName ? 'router-link' : 'div'"
        :to="routeName ? { name: routeName } : {}"
        class="d-flex align-items-center"
      >
        <div class="avatar-sm flex-shrink-0">
          <slot name="customCardIcon"></slot>
          <span class="avatar-title bg-light text-primary rounded-circle fs-3" v-if="!customIcon">
            <slot name="cardIcon"></slot>
          </span>
        </div>
        <div class="flex-grow-1 ms-3">
          <slot name="cardBody"></slot>
        </div>
        <div class="flex-shrink-0 align-self-end">
          <slot name="cardFooter"></slot>
          <span
            v-if="percentage"
            :class="`badge bg-${percentage_success ? 'success' : 'danger'}-subtle ${
              percentage_success ? 'text-success' : 'text-danger'
            } float-end`"
          >
            <i
              :class="`ri-arrow-${percentage_success ? 'up' : 'down'}-s-fill align-middle me-1`"
            ></i
            >{{ percentage_label }} %
          </span>
        </div>
      </component>
    </div>
    <!-- end card body -->
  </div>
  <!-- end card -->
</template>

<style></style>
