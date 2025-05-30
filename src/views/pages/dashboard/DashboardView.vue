<script setup lang="ts">
import 'swiper/css'
import 'swiper/css/autoplay'
import 'swiper/css/mousewheel'
import Layout from '@/layouts/MainLayout.vue'
import 'simplebar-vue/dist/simplebar.min.css'
import { useAuthStore } from '@/stores/auth'
import AdminDashboard from './AdminDashboard.vue'
import SimpleDashboard from './SimpleDashboard.vue'
import { reactive } from 'vue'

const authStore = useAuthStore()
const state = reactive({
  dashboard_permission: false,
  admin_dashboard_permission: false
})
const checkAuth = () => {
  state.dashboard_permission = authStore.permissions.some((item: any) => item.module === 'dashboards' && item.read === 1);
  state.admin_dashboard_permission = authStore.permissions.some((item: any) => item.module === 'dashboards.admin-dashboard' && item.read === 1);
}
checkAuth()
</script>

<template>
  <Layout>
    <template v-if="authStore.role.id < 3 || state.admin_dashboard_permission">
      <!-- <AdminDashboard /> -->
      <SimpleDashboard />
    </template>
    <template v-else>
      <SimpleDashboard />
    </template>
  </Layout>
</template>

<style>
.text-white-75 {
  color: rgba(255, 255, 255, 0.75);
}
</style>
