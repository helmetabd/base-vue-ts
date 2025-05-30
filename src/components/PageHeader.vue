<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: ''
  },
  pageTitle: {
    type: Object,
    default: () => {}
  }
})
</script>

<template>
  <div class="row">
    <div class="col" cols="12">
      <div class="page-title-box d-sm-flex align-items-center justify-content-between">
        <h4 class="mb-sm-0">{{ title }}</h4>
        <div class="page-title-right">
          <ol class="breadcrumb m-0">
            <li class="breadcrumb-item" v-if="pageTitle">
              <router-link :to="{ name: pageTitle.routeName }">{{ pageTitle.title }}</router-link>
            </li>
            <li class="breadcrumb-item active">{{ title }}</li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>
