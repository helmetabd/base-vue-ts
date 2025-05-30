<script setup lang="ts">
import { useLayoutStore } from '../stores/layout'
import { getAvatar } from '../utils/assetsHelper'
import { onMounted, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'

const layoutStore = useLayoutStore()
const authStore = useAuthStore()
const { changeMode } = layoutStore
const data = reactive({
  text: null,
  flag: null,
  search: '',
  myVar: 1,
  display_name: authStore.role.display_name,
  name: authStore.user.name,
  avatar: getAvatar(authStore.user.avatar),
  options: []
})
const { loggingOut } = authStore
onMounted(() => {
  document.addEventListener('scroll', function () {
    var pageTopbar = document.getElementById('page-topbar')
    if (pageTopbar) {
      document.body.scrollTop >= 50 || document.documentElement.scrollTop >= 50
        ? pageTopbar.classList.add('topbar-shadow')
        : pageTopbar.classList.remove('topbar-shadow')
    }
  })
  // isCustomDropdown()
})
function signOut() {
  loggingOut()
}

function toggleHamburgerMenu() {
  var windowSize = document.documentElement.clientWidth
  let layoutType = layoutStore.layoutValue.layoutType

  layoutStore.changeVisibility({ visibility: 'show' })
  let visiblilityType = layoutStore.layoutValue.visibility

  if (windowSize > 767) {
    document.querySelector('.hamburger-icon')?.classList.toggle('open')
  }

  //For collapse horizontal menu (unused)
  if (layoutType === 'horizontal') {
    document.body.classList.contains('menu')
      ? document.body.classList.remove('menu')
      : document.body.classList.add('menu')
  }

  //For collapse vertical menu
  if (visiblilityType === 'show' && (layoutType === 'vertical' || layoutType === 'semibox')) {
    if (windowSize < 1025 && windowSize > 767) {
      document.body.classList.remove('vertical-sidebar-enable')
      layoutStore.layoutValue.sidebarSize == 'sm'
        ? layoutStore.changeSidebarSize({ sidebarSize: 'lg' })
        : layoutStore.changeSidebarSize({ sidebarSize: 'sm' })
    } else if (windowSize > 1025) {
      document.body.classList.remove('vertical-sidebar-enable')
      layoutStore.layoutValue.sidebarSize == 'lg'
        ? layoutStore.changeSidebarSize({ sidebarSize: 'sm' })
        : layoutStore.changeSidebarSize({ sidebarSize: 'lg' })
    } else if (windowSize <= 767) {
      document.body.classList.add('vertical-sidebar-enable')
      layoutStore.changeSidebarSize({ sidebarSize: 'lg' })
    }
  }
  //Two column menu
  if (layoutType == 'twocolumn') {
    document.body.classList.contains('twocolumn-panel')
      ? document.body.classList.remove('twocolumn-panel')
      : document.body.classList.add('twocolumn-panel')
  }
}
function initFullScreen() {
  document.body.classList.toggle('fullscreen-enable')
  if (!document.fullscreenElement) {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen()
    }
  }
  else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }
}
</script>

<template>
  <header id="page-topbar">
    <div class="layout-width">
      <div class="navbar-header">
        <div class="d-flex">
          <!-- LOGO -->
          <div class="navbar-brand-box horizontal-logo">
            <router-link :to="{ name: 'dashboard' }" class="logo logo-dark">
              <span class="logo-sm">
                <img src="@/assets/images/arjuna-sm.png" alt="" height="22" />
              </span>
              <span class="logo-lg">
                <img src="@/assets/images/logo-dark.png" alt="" height="17" />
              </span>
            </router-link>

            <router-link :to="{ name: 'dashboard' }" class="logo logo-light">
              <span class="logo-sm">´
                <img src="@/assets/images/arjuna-sm.png" alt="" height="22" />
              </span>
              <span class="logo-lg">
                <img src="@/assets/images/logo-light.png" alt="" height="17" />
              </span>
            </router-link>
          </div>

          <button type="button" class="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger shadow-none"
            id="topnav-hamburger-icon" @click="toggleHamburgerMenu">
            <span class="hamburger-icon">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>

        <div class="d-flex align-items-center">
          <div class="ms-1 header-item d-none d-sm-flex">
            <button type="button" class="btn btn-ghost-secondary btn-icon btn-topbar rounded-circle shadow-none"
              data-toggle="fullscreen" @click="initFullScreen">
              <i class="bx bx-fullscreen fs-22"></i>
            </button>
          </div>

          <div class="ms-1 header-item d-none d-sm-flex">
            <button type="button"
              class="btn btn-ghost-secondary btn-icon btn-topbar rounded-circle light-dark-mode shadow-none"
              @click="changeMode">
              <!-- @click="toggleDarkMode" -->
              <i class="bx bx-moon fs-22"></i>
            </button>
          </div>
          <div class="btn-group ms-sm-3 header-item topbar-user">
            <button id="profileButton" class="btn btn-md btn-link rounded-circle arrow-none shadow-none dropdown-toggle"
              aria-expanded="true" type="button" data-bs-toggle="dropdown" aria-haspopup="menu">
              <span class="d-flex align-items-center">
                <img class="rounded-circle header-profile-user" :src="data.avatar" alt="Header Avatar" />
                <span class="text-start ms-xl-2">
                  <span class="d-none d-xl-inline-block ms-1 fw-medium user-name-text">{{
                    data.name
                  }}</span>
                  <span class="d-none d-xl-block ms-1 fs-12 user-name-sub-text">{{
                    data.display_name
                  }}</span>
                </span>
              </span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end" role="menu" aria-labelledby="profileButton">
              <h6 class="dropdown-header">Welcome {{ data.name }}!</h6>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item" @click="signOut">
                <i class="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>
                <span class="align-middle" data-key="t-logout">Logout</span>
              </button>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
