<script setup>
import router from '@/router'
import simplebar from 'simplebar-vue'
import { useLayoutStore } from '../stores/layout'
// import { storeToRefs } from 'pinia'

import NavBar from '../components/NavBar.vue'
import PageMenu from '../components/MenuComponent.vue'
import RightBar from '../components/RightBar.vue'
import PageFooter from '../components/FooterComponent.vue'
import { onUnmounted, provide, ref } from 'vue'
import { onMounted } from 'vue'
localStorage.setItem('hoverd', false)

/**
 * Vertical layout
 */

const layoutStore = useLayoutStore()
// const { layoutValue } = storeToRefs(layoutStore)
// const sidebarSize = layoutValue.value.sidebarSize

const isMenuCondensed = ref(false)

document.body.removeAttribute('data-layout', 'horizontal')
document.body.removeAttribute('data-topbar', 'dark')
document.body.removeAttribute('data-layout-size', 'boxed')

function updateSidebarSize() {
  // Check window.screen.width and update the data-sidebar-size attribute
  if (window.screen.width < 1025) {
    layoutStore.changeSidebarSize('sm')
  } else {
    layoutStore.changeSidebarSize('lg') // Reset sidebarSize if screen width is >= 1025
  }
}
function initActiveMenu() {
  if (layoutStore.layoutValue.sidebarSize === 'sm-hover') {
    localStorage.setItem('hoverd', true)
    layoutStore.changeSidebarSize('sm-hover-active')
  } else if (layoutStore.layoutValue.sidebarSize === 'sm-hover-active') {
    localStorage.setItem('hoverd', false)
    layoutStore.changeSidebarSize('sm-hover')
  } else {
    layoutStore.changeSidebarSize('sm-hover')
  }
}
function toggleMenu() {
  document.body.classList.toggle('sidebar-enable')
  if (window.screen.width >= 992) {
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    router.afterEach((_routeTo, _routeFrom) => {
      document.body.classList.remove('sidebar-enable')
      document.body.classList.remove('vertical-collpsed')
    })
    document.body.classList.toggle('vertical-collpsed')
  } else {
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    router.afterEach((_routeTo, _routeFrom) => {
      document.body.classList.remove('sidebar-enable')
    })
    document.body.classList.remove('vertical-collpsed')
  }
  isMenuCondensed.value = !isMenuCondensed.value
}
function toggleRightSidebar() {
  document.body.classList.toggle('right-bar-enabled')
}
function hideRightSidebar() {
  document.body.classList.remove('right-bar-enabled')
}
provide('toggleMenu', toggleMenu)
provide('toggleRightSidebar', toggleRightSidebar)
provide('hideRightSidebar', hideRightSidebar)
onMounted(() => {
  if (localStorage.getItem('hoverd') == 'true') {
    layoutStore.changeSidebarSize('sm-hover-active')
  }
  document.getElementById('overlay').addEventListener('click', () => {
    document.body.classList.remove('vertical-sidebar-enable')
  })
  if (window.screen.width < 1025 && window.screen.width > 767) {
    layoutStore.changeSidebarSize('sm')
  }

  window.addEventListener('resize', () => {
    document.body.classList.remove('vertical-sidebar-enable')
    if (window.screen.width < 767) {
      document.querySelector('.hamburger-icon').classList.add('open')
    }
    if (window.screen.width < 1025 && window.screen.width > 767) {
      document.querySelector('.hamburger-icon').classList.remove('open')
    }
    // updateSidebarSize()
  })
})
onUnmounted(() => {
  window.removeEventListener('resize', updateSidebarSize)
})
</script>

<template>
  <div id="layout-wrapper">
    <NavBar />
    <div>
      <!-- ========== Left Sidebar Start ========== -->
      <!-- ========== App Menu ========== -->
      <div class="app-menu navbar-menu">
        <!-- LOGO -->
        <div class="navbar-brand-box">
          <!-- Dark Logo-->
          <router-link :to="{ name: 'dashboard' }" class="logo logo-dark">
            <span class="logo-sm">
              <img src="@/assets/images/arjuna-sm.png" alt="" height="22" />
            </span>
            <span class="logo-lg">
              <img src="@/assets/images/logo-dark.png" alt="" height="17" />
            </span>
          </router-link>
          <!-- Light Logo-->
          <router-link :to="{ name: 'dashboard' }" class="logo logo-light">
            <span class="logo-sm">
              <img src="@/assets/images/arjuna-sm.png" alt="" height="22" />
            </span>
            <span class="logo-lg">
              <img src="@/assets/images/logo-light.png" alt="" height="17" />
            </span>
          </router-link>
          <button type="button" class="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover"
            id="vertical-hover" @click="initActiveMenu">
            <i class="ri-record-circle-line"></i>
          </button>
        </div>

        <simplebar id="scrollbar" class="h-100" ref="scrollbar">
          <PageMenu />
        </simplebar>
        <div class="sidebar-background"></div>
      </div>
      <!-- Left Sidebar End -->
      <!-- Vertical Overlay-->
      <div class="vertical-overlay" id="overlay"></div>
    </div>
    <!-- ============================================================== -->
    <!-- Start Page Content here -->
    <!-- ============================================================== -->

    <div class="main-content">
      <div class="page-content">
        <!-- Start Content-->
        <div class="container-fluid">
          <slot />
        </div>
      </div>
      <PageFooter />
    </div>
    <RightBar hidden />
  </div>
</template>
