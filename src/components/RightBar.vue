<script setup>
localStorage.setItem('rightbar_isopen', false)
import { useStorage } from '@vueuse/core'
import { useLayoutStore } from '../stores/layout'
import simpleBar from 'simplebar-vue'
import { onMounted, watch } from 'vue'
import { reactive } from 'vue'
import { computed } from 'vue'
import apiClient from '@/service/ApiClientService'
import Swal from 'sweetalert2'
import { errorHelper } from '@/utils/alertHelper'

/**
 * Right sidebar component
 */
const layoutStore = useLayoutStore()
const layoutValue = reactive(layoutStore.layoutValue)
const data = reactive({
  show: false,
  showGradients: false,
  resetValue: {
    layoutType: 'vertical',
    layoutWidth: 'fluid',
    sidebarSize: 'lg',
    topbar: 'light',
    mode: 'light',
    position: 'fixed',
    sidebarView: 'default',
    sidebarColor: 'light',
    sidebarImage: 'none',
    preloader: 'disable',
    visibility: 'show'
  }
})

onMounted(() => {
  let backtoTop = document.getElementById('back-to-top')

  if (backtoTop) {
    backtoTop = document.getElementById('back-to-top')
    window.onscroll = function () {
      if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        backtoTop.style.display = 'block'
      } else {
        backtoTop.style.display = 'none'
      }
    }
  }
  var setpreloader = document.getElementById('preloader')
  if (useStorage('data-preloader').value && useStorage('data-preloader').value == 'enable') {
    document.documentElement.setAttribute('data-preloader', 'enable')
    if (setpreloader) {
      setTimeout(function () {
        setpreloader.style.opacity = '0'
        setpreloader.style.visibility = 'hidden'
      }, 1000)
    }
  } else {
    document.documentElement.setAttribute('data-preloader', 'disable')
    if (setpreloader) {
      setpreloader.style.opacity = '0'
      setpreloader.style.visibility = 'hidden'
    }
  }
  if (document.getElementById('collapseBgGradient')) {
    Array.from(document.querySelectorAll('#collapseBgGradient .form-check input')).forEach(
      function () {
        if (document.querySelector("[data-bs-target='#collapseBgGradient']")) {
          document
            .querySelector("[data-bs-target='#collapseBgGradient']")
            .addEventListener('click', function () {
              document.getElementById('sidebar-color-gradient').click()
            })
        }
      }
    )
    Array.from(document.querySelectorAll("[name='data-sidebar']")).forEach(function (elem) {
      if (document.querySelector("[data-bs-target='#collapseBgGradient']")) {
        if (document.querySelector('#collapseBgGradient .form-check input:checked')) {
          document.querySelector("[data-bs-target='#collapseBgGradient']").classList.add('active')
        } else {
          document
            .querySelector("[data-bs-target='#collapseBgGradient']")
            .classList.remove('active')
          document.getElementById('collapseBgGradient').classList.remove('show')
        }

        elem.addEventListener('change', function () {
          if (document.querySelector('#collapseBgGradient .form-check input:checked')) {
            document.querySelector("[data-bs-target='#collapseBgGradient']").classList.add('active')
          } else {
            document.getElementById('collapseBgGradient').classList.remove('show')
            document
              .querySelector("[data-bs-target='#collapseBgGradient']")
              .classList.remove('active')
          }
        })
      }
    })
  }
})

function click() {
  data.show = !data.show
}
function topFunction() {
  document.body.scrollTop = 0
  document.documentElement.scrollTop = 0
}

// function resizeWindow() {
//   var windowSize = document.documentElement.clientWidth
//   if (windowSize >= 1025) {
//     if (document.documentElement.getAttribute('data-layout') === 'vertical') {
//       document.documentElement.setAttribute('data-sidebar-size', this.sidebarSize)
//     }
//     if (document.documentElement.getAttribute('data-layout') === 'semibox') {
//       document.documentElement.setAttribute('data-sidebar-size', this.sidebarSize)
//     }
//     if (
//       document.documentElement.getAttribute('data-sidebar-visibility') === 'show' &&
//       document.querySelector('.hamburger-icon')
//     ) {
//       document.querySelector('.hamburger-icon').classList.remove('open')
//     }
//   } else if (windowSize < 1025 && windowSize > 767) {
//     document.body.classList.remove('twocolumn-panel')
//     if (document.documentElement.getAttribute('data-layout') === 'vertical') {
//       document.documentElement.setAttribute('data-sidebar-size', 'sm')
//     }
//     if (document.documentElement.getAttribute('data-layout') === 'semibox') {
//       document.documentElement.setAttribute('data-sidebar-size', 'sm')
//     }
//     if (document.querySelector('.hamburger-icon')) {
//       document.querySelector('.hamburger-icon').classList.add('open')
//     }
//   } else if (windowSize <= 767) {
//     document.body.classList.remove('vertical-sidebar-enable')
//     document.body.classList.add('twocolumn-panel')
//     if (document.documentElement.getAttribute('data-layout') !== 'horizontal') {
//       document.documentElement.setAttribute('data-sidebar-size', 'lg')
//     }
//     if (document.querySelector('.hamburger-icon')) {
//       document.querySelector('.hamburger-icon').classList.add('open')
//     }
//   }
// }

function applyLayout() {
  apiClient
    .post('/auth/update-settings', { settings: layoutStore.layoutValue })
    .then(Swal.fire('Success', 'Berhasil menyimpan pengaturan!', 'success'))
    .catch((e) => errorHelper(e))
}

function resetLayoutValue() {
  document.documentElement.setAttribute('data-sidebar-size', 'lg')
  layoutStore.changeMode({ mode: data.resetValue.mode })
  layoutStore.changeSidebarColor({ sidebarColor: data.resetValue.sidebarColor })
  layoutStore.changeLayoutType({ layoutType: data.resetValue.layoutType })
  layoutStore.changeTopbar({ topbar: data.resetValue.topbar })
  layoutStore.changeLayoutWidth({ layoutWidth: data.resetValue.layoutWidth })
  layoutStore.changeSidebarSize({ sidebarSize: data.resetValue.sidebarSize })
  layoutStore.changeSidebarImage({ sidebarImage: data.resetValue.sidebarImage })
  layoutStore.changeSidebarColor({ sidebarColor: data.resetValue.sidebarColor })
  layoutStore.changePreloader({ preloader: data.resetValue.preloader })
  layoutStore.changeSidebarView({ sidebarView: data.resetValue.sidebarView })
  layoutStore.changeVisibility({ visibility: data.resetValue.visibility })
  layoutStore.changePosition({ position: data.resetValue.position })
}

function resetLayout() {
  resetLayoutValue()
}

function gradiantColor() {
  layoutStore.changeSidebarColor({ sidebarColor: 'gradient' })
}

function onSideBarColorClick(color) {
  if (color !== 'gradient') {
    data.showGradients = false
  } else {
    data.showGradients = true
    gradiantColor()
  }
}

const layoutType = computed({
  get() {
    return layoutValue.layoutType
  },
  set(layout) {
    localStorage.setItem('rightbar_isopen', true)
    layoutStore.changeLayoutType({ layoutType: layout })
    document.querySelector('.hamburger-icon').classList.remove('open')
  }
})
const preloader = computed({
  get() {
    return layoutValue.preloader
  },
  set() {
    return layoutStore.changePreloader()
  }
})
const mode = computed({
  get() {
    return layoutValue.mode
  },
  set() {
    layoutStore.changeMode()
    // layoutStore.changeTopbar()
  }
})
const sidebarSize = computed({
  get() {
    return layoutValue.sidebarSize
  },
  set(sidebarSize) {
    return layoutStore.changeSidebarSize({ sidebarSize: sidebarSize })
  }
})
const layoutWidth = computed({
  get() {
    return layoutValue.layoutWidth
  },
  set(width) {
    if (width == 'boxed') {
      layoutStore.changeLayoutWidth({ layoutWidth: width })
      layoutStore.changeSidebarSize({ sidebarSize: 'sm-hover' })
    } else {
      layoutStore.changeLayoutWidth({ layoutWidth: width })
      layoutStore.changeSidebarSize({ sidebarSize: 'lg' })
    }
  }
})
const position = computed({
  get() {
    return layoutValue.position
  },
  set(position) {
    return layoutStore.changePosition({
      position: position
    })
  }
})
const topbar = computed({
  get() {
    return layoutValue.topbar
  },
  set() {
    layoutStore.changeTopbar()
  }
})
const sidebarView = computed({
  get() {
    return layoutValue.sidebarView
  },
  set(sidebarView) {
    return layoutStore.changeSidebarView({
      sidebarView: sidebarView
    })
  }
})
const sidebarColor = computed({
  get() {
    return layoutValue.sidebarColor
  },
  set(sidebarColor) {
    return layoutStore.changeSidebarColor({
      sidebarColor: sidebarColor
    })
  }
})
const sidebarImage = computed({
  get() {
    return layoutValue.sidebarImage
  },
  set(sidebarImage) {
    return layoutStore.changeSidebarImage({
      sidebarImage: sidebarImage
    })
  }
})
const visibility = computed({
  get() {
    return layoutValue.visibility
  },
  set(visibility) {
    if (visibility == 'hidden') {
      document.querySelector('.hamburger-icon').classList.add('open')
    } else {
      document.querySelector('.hamburger-icon').classList.remove('open')
    }
    layoutStore.changeVisibility({
      visibility: visibility
    })
  }
})

watch(preloader, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    switch (newVal) {
      case 'enable':
        document.documentElement.setAttribute('data-preloader', 'enable')
        break
      case 'disable':
        document.documentElement.setAttribute('data-preloader', 'disable')
        break
    }
    localStorage.setItem('data-preloader', newVal)
  }
})
watch(
  layoutType,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      switch (newVal) {
        case 'horizontal':
          document.documentElement.setAttribute('data-layout', 'horizontal')
          break
        case 'vertical':
          document.documentElement.setAttribute('data-layout', 'vertical')
          break
        case 'twocolumn':
          document.documentElement.setAttribute('data-layout', 'twocolumn')
          break
        case 'semibox':
          document.documentElement.setAttribute('data-layout', 'semibox')
          break
      }
    }
  },
  { deep: true, immediate: true }
)
watch(
  layoutWidth,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      switch (newVal) {
        case 'fluid':
          document.documentElement.setAttribute('data-layout-width', 'fluid')
          break
        case 'boxed':
          document.documentElement.setAttribute('data-layout-width', 'boxed')
          break
      }
    }
  },
  { deep: true, immediate: true }
)
watch(
  position,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      switch (newVal) {
        case 'fixed':
          document.documentElement.setAttribute('data-layout-position', 'fixed')
          break
        case 'scrollable':
          document.documentElement.setAttribute('data-layout-position', 'scrollable')
          break
      }
    }
  },
  { deep: true, immediate: true }
)
watch(
  topbar,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      switch (newVal) {
        case 'light':
          document.documentElement.setAttribute('data-topbar', 'light')
          break
        case 'dark':
          document.documentElement.setAttribute('data-topbar', 'dark')
          break
      }
    }
  },
  { deep: true, immediate: true }
)
watch(
  sidebarSize,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      switch (newVal) {
        case 'lg':
          document.documentElement.setAttribute('data-sidebar-size', 'lg')
          break
        case 'sm':
          document.documentElement.setAttribute('data-sidebar-size', 'sm')
          break
        case 'md':
          document.documentElement.setAttribute('data-sidebar-size', 'md')
          break
        case 'sm-hover':
          document.documentElement.setAttribute('data-sidebar-size', 'sm-hover')
          break
      }
    }
  },
  { deep: true, immediate: true }
)
watch(
  sidebarView,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      switch (newVal) {
        case 'detached':
          document.documentElement.setAttribute('data-layout-style', 'detached')
          break
        case 'default':
          document.documentElement.setAttribute('data-layout-style', 'default')
          break
      }
    }
  },
  { deep: true, immediate: true }
)
watch(
  sidebarColor,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      switch (newVal) {
        case 'dark':
          document.documentElement.setAttribute('data-sidebar', 'dark')
          break
        case 'light':
          document.documentElement.setAttribute('data-sidebar', 'light')
          break
        case 'gradient':
          document.documentElement.setAttribute('data-sidebar', 'gradient')
          break
        case 'gradient-2':
          document.documentElement.setAttribute('data-sidebar', 'gradient-2')
          break
        case 'gradient-3':
          document.documentElement.setAttribute('data-sidebar', 'gradient-3')
          break
        case 'gradient-4':
          document.documentElement.setAttribute('data-sidebar', 'gradient-4')
          break
      }
    }
  },
  { deep: true, immediate: true }
)
watch(
  sidebarImage,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      switch (newVal) {
        case 'img-1':
          document.documentElement.setAttribute('data-sidebar-image', 'img-1')
          break
        case 'img-2':
          document.documentElement.setAttribute('data-sidebar-image', 'img-2')
          break
        case 'img-3':
          document.documentElement.setAttribute('data-sidebar-image', 'img-3')
          break
        case 'img-4':
          document.documentElement.setAttribute('data-sidebar-image', 'img-4')
          break
        case 'none':
          document.documentElement.setAttribute('data-sidebar-image', 'none')
          break
      }
    }
  },
  { deep: true, immediate: true }
)
watch(
  visibility,
  (newVal, oldVal) => {
    if (newVal != oldVal) {
      switch (newVal) {
        case 'show':
          document.documentElement.setAttribute('data-sidebar-visibility', 'show')
          break
        case 'hidden':
          document.documentElement.setAttribute('data-sidebar-visibility', 'hidden')
          break
      }
    }
  },
  { deep: true, immediate: true }
)
</script>

<template>
  <div>
    <div id="preloader">
      <div id="status">
        <div class="spinner-border text-primary avatar-sm" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>

    <button @click="topFunction" class="btn btn-sm btn-danger btn-icon" id="back-to-top">
      <i class="ri-arrow-up-line"></i>
    </button>

    <div class="customizer-setting d-none d-md-block" @click="click">
      <div class="btn-info rounded-pill shadow-lg btn btn-icon btn-lg p-2" data-bs-toggle="offcanvas"
        data-bs-target="#theme-settings-offcanvas" aria-controls="theme-settings-offcanvas" id="mdi-cog">
        <i class="mdi mdi-spin mdi-cog-outline fs-22"></i>
      </div>
    </div>
    <div class="offcanvas offcanvas-end border-0" id="theme-settings-offcanvas" tabindex="-1">
      <div class="offcanvas-header d-flex align-items-center bg-primary bg-gradient p-3">
        <div class="me-2">
          <h5 class="m-0 me-2 text-white">Theme Customizer</h5>
        </div>
        <button type="button" class="btn-close btn-close-white ms-auto" id="customizerclose-btn"
          data-bs-toggle="offcanvas" data-bs-target="#theme-settings-offcanvas" aria-controls="theme-settings-offcanvas"
          @click="click"></button>
      </div>
      <div class="offcanvas-body p-0">
        <simpleBar class="h-100">
          <div class="p-4">
            <h6 class="mb-0 fw-semibold text-uppercase fs-12">Layout</h6>
            <p class="text-muted">Choose your layout</p>

            <div class="row gy-3">
              <div class="col" cols="4">
                <div class="form-check card-radio">
                  <input id="customizer-layout01" name="data-layout" type="radio" value="vertical"
                    class="form-check-input" v-model="layoutType" />
                  <label class="form-check-label p-0 avatar-md w-100 shadow-sm" for="customizer-layout01">
                    <span class="d-flex gap-1 h-100">
                      <span class="flex-shrink-0">
                        <span class="bg-light d-flex h-100 flex-column gap-1 p-1">
                          <span class="d-block p-1 px-2 bg-primary-subtle rounded mb-2"></span>
                          <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                          <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                          <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                        </span>
                      </span>
                      <span class="flex-grow-1">
                        <span class="d-flex h-100 flex-column">
                          <span class="bg-light d-block p-1"></span>
                          <span class="bg-light d-block p-1 mt-auto"></span>
                        </span>
                      </span>
                    </span>
                  </label>
                </div>
                <h5 class="fs-13 text-center mt-2">Vertical</h5>
              </div>
              <div class="col col-4">
                <div class="form-check card-radio">
                  <input id="customizer-layout02" name="data-layout" type="radio" value="horizontal"
                    class="form-check-input" v-model="layoutType" />
                  <label class="form-check-label p-0 avatar-md w-100" for="customizer-layout02">
                    <span class="d-flex h-100 flex-column gap-1">
                      <span class="bg-light d-flex p-1 gap-1 align-items-center">
                        <span class="d-block p-1 bg-primary-subtle rounded me-1"></span>
                        <span class="d-block p-1 pb-0 px-2 bg-primary-subtle ms-auto"></span>
                        <span class="d-block p-1 pb-0 px-2 bg-primary-subtle"></span>
                      </span>
                      <span class="bg-light d-block p-1"></span>
                      <span class="bg-light d-block p-1 mt-auto"></span>
                    </span>
                  </label>
                </div>
                <h5 class="fs-13 text-center mt-2">Horizontal</h5>
              </div>
              <div class="col" cols="4">
                <div class="form-check card-radio">
                  <input id="customizer-layout04" name="data-layout" type="radio" value="semibox"
                    class="form-check-input" v-model="layoutType" />
                  <label class="form-check-label p-0 avatar-md w-100 shadow-sm" for="customizer-layout04">
                    <span class="d-flex gap-1 h-100">
                      <span class="flex-shrink-0 p-1">
                        <span class="bg-light d-flex h-100 flex-column gap-1 p-1">
                          <span class="d-block p-1 px-2 bg-primary-subtle rounded mb-2"></span>
                          <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                          <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                          <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                        </span>
                      </span>
                      <span class="flex-grow-1">
                        <span class="d-flex h-100 flex-column pt-1 pe-2">
                          <span class="bg-light d-block p-1"></span>
                          <span class="bg-light d-block p-1 mt-auto"></span>
                        </span>
                      </span>
                    </span>
                  </label>
                </div>
                <h5 class="fs-13 text-center mt-2">Semi Box</h5>
              </div>
            </div>

            <h6 class="mt-4 mb-0 fw-semibold text-uppercase fs-12">Color Scheme</h6>
            <p class="text-muted">Choose Light or Dark Scheme.</p>

            <div class="colorscheme-cardradio">
              <div class="row">
                <div class="col" cols="4">
                  <div class="form-check card-radio">
                    <input class="form-check-input" type="radio" name="data-bs-theme" id="layout-mode-light"
                      value="light" v-model="mode" />
                    <label class="form-check-label p-0 avatar-md w-100 shadow-sm" for="layout-mode-light">
                      <span class="d-flex gap-1 h-100">
                        <span class="flex-shrink-0">
                          <span class="bg-light d-flex h-100 flex-column gap-1 p-1">
                            <span class="d-block p-1 px-2 bg-primary-subtle rounded mb-2"></span>
                            <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                            <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                            <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                          </span>
                        </span>
                        <span class="flex-grow-1">
                          <span class="d-flex h-100 flex-column">
                            <span class="bg-light d-block p-1"></span>
                            <span class="bg-light d-block p-1 mt-auto"></span>
                          </span>
                        </span>
                      </span>
                    </label>
                  </div>
                  <h5 class="fs-13 text-center mt-2">Light</h5>
                </div>

                <div class="col" cols="4">
                  <div class="form-check card-radio dark">
                    <input class="form-check-input" v-model="mode" type="radio" name="data-bs-theme"
                      id="layout-mode-dark" value="dark" />
                    <label class="form-check-label p-0 avatar-md w-100 shadow-sm bg-dark" for="layout-mode-dark">
                      <span class="d-flex gap-1 h-100">
                        <span class="flex-shrink-0">
                          <span class="bg-white bg-opacity-10 d-flex h-100 flex-column gap-1 p-1">
                            <span class="d-block p-1 px-2 bg-white bg-opacity-10 rounded mb-2"></span>
                            <span class="d-block p-1 px-2 pb-0 bg-white bg-opacity-10"></span>
                            <span class="d-block p-1 px-2 pb-0 bg-white bg-opacity-10"></span>
                            <span class="d-block p-1 px-2 pb-0 bg-white bg-opacity-10"></span>
                          </span>
                        </span>
                        <span class="flex-grow-1">
                          <span class="d-flex h-100 flex-column">
                            <span class="bg-white bg-opacity-10 d-block p-1"></span>
                            <span class="bg-white bg-opacity-10 d-block p-1 mt-auto"></span>
                          </span>
                        </span>
                      </span>
                    </label>
                  </div>
                  <h5 class="fs-13 text-center mt-2">Dark</h5>
                </div>
              </div>
            </div>
            <div id="sidebar-visibility" v-if="layoutType == 'semibox'">
              <h6 class="mt-4 mb-0 fw-semibold text-uppercase fs-12">Sidebar Visibility</h6>
              <p class="text-muted">Choose show or Hidden sidebar.</p>

              <div class="row">
                <div class="col" cols="4">
                  <div class="form-check card-radio">
                    <input class="form-check-input" type="radio" name="data-sidebar-visibility"
                      id="sidebar-visibility-show" value="show" v-model="visibility" />
                    <label class="form-check-label p-0 avatar-md w-100 shadow-sm" for="sidebar-visibility-show">
                      <span class="d-flex gap-1 h-100">
                        <span class="flex-shrink-0 p-1">
                          <span class="bg-light d-flex h-100 flex-column gap-1 p-1">
                            <span class="d-block p-1 px-2 bg-primary-subtle rounded mb-2"></span>
                            <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                            <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                            <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                          </span>
                        </span>
                        <span class="flex-grow-1">
                          <span class="d-flex h-100 flex-column pt-1 pe-2">
                            <span class="bg-light d-block p-1"></span>
                            <span class="bg-light d-block p-1 mt-auto"></span>
                          </span>
                        </span>
                      </span>
                    </label>
                  </div>
                  <h5 class="fs-13 text-center mt-2">Show</h5>
                </div>
                <div class="col" cols="4">
                  <div class="form-check card-radio">
                    <input class="form-check-input" type="radio" name="data-sidebar-visibility"
                      id="sidebar-visibility-hidden" value="hidden" v-model="visibility" />
                    <label class="form-check-label p-0 avatar-md w-100 px-2 shadow-sm" for="sidebar-visibility-hidden">
                      <span class="d-flex gap-1 h-100">
                        <span class="flex-grow-1">
                          <span class="d-flex h-100 flex-column pt-1 px-2">
                            <span class="bg-light d-block p-1"></span>
                            <span class="bg-light d-block p-1 mt-auto"></span>
                          </span>
                        </span>
                      </span>
                    </label>
                  </div>
                  <h5 class="fs-13 text-center mt-2">Hidden</h5>
                </div>
              </div>
            </div>

            <div v-if="layoutType == 'vertical' || layoutType == 'horizontal'" id="layout-width">
              <h6 class="mt-4 mb-0 fw-semibold text-uppercase fs-12">Layout Width</h6>
              <p class="text-muted">Choose Fluid or Boxed layout.</p>

              <div class="row">
                <div class="col" cols="4">
                  <div class="form-check card-radio">
                    <input class="form-check-input" type="radio" v-model="layoutWidth" name="data-layout-width"
                      id="layout-width-fluid" value="fluid" />
                    <label class="form-check-label p-0 avatar-md w-100 shadow-sm" for="layout-width-fluid">
                      <span class="d-flex gap-1 h-100">
                        <span class="flex-shrink-0">
                          <span class="bg-light d-flex h-100 flex-column gap-1 p-1">
                            <span class="d-block p-1 px-2 bg-primary-subtle rounded mb-2"></span>
                            <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                            <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                            <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                          </span>
                        </span>
                        <span class="flex-grow-1">
                          <span class="d-flex h-100 flex-column">
                            <span class="bg-light d-block p-1"></span>
                            <span class="bg-light d-block p-1 mt-auto"></span>
                          </span>
                        </span>
                      </span>
                    </label>
                  </div>
                  <h5 class="fs-13 text-center mt-2">Fluid</h5>
                </div>
                <div class="col" cols="4">
                  <div class="form-check card-radio">
                    <input class="form-check-input" type="radio" v-model="layoutWidth" name="data-layout-width"
                      id="layout-width-boxed" value="boxed" />
                    <label class="form-check-label p-0 avatar-md w-100 px-2 shadow-sm" for="layout-width-boxed">
                      <span class="d-flex gap-1 h-100 border-start border-end">
                        <span class="flex-shrink-0">
                          <span class="bg-light d-flex h-100 flex-column gap-1 p-1">
                            <span class="d-block p-1 px-2 bg-primary-subtle rounded mb-2"></span>
                            <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                            <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                            <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                          </span>
                        </span>
                        <span class="flex-grow-1">
                          <span class="d-flex h-100 flex-column">
                            <span class="bg-light d-block p-1"></span>
                            <span class="bg-light d-block p-1 mt-auto"></span>
                          </span>
                        </span>
                      </span>
                    </label>
                  </div>
                  <h5 class="fs-13 text-center mt-2">Boxed</h5>
                </div>
              </div>
            </div>

            <div v-if="layoutType != 'twocolumn'" id="layout-position">
              <h6 class="mt-4 mb-0 fw-semibold text-uppercase fs-12">Layout Position</h6>
              <p class="text-muted">Choose Fixed or Scrollable Layout Position.</p>

              <div class="btn-group radio" role="group">
                <input type="radio" class="btn-check" name="data-layout-position" id="layout-position-fixed"
                  value="fixed" v-model="position" />
                <label class="btn btn-light w-sm" for="layout-position-fixed">Fixed</label>

                <input type="radio" class="btn-check" name="data-layout-position" id="layout-position-scrollable"
                  value="scrollable" v-model="position" />
                <label class="btn btn-light w-sm ms-0" for="layout-position-scrollable">Scrollable</label>
              </div>
            </div>

            <h6 class="mt-4 mb-0 fw-semibold text-uppercase fs-12">Topbar Color</h6>
            <p class="text-muted">Choose Light or Dark Topbar Color.</p>

            <div class="row">
              <div class="col" cols="4">
                <div class="form-check card-radio">
                  <input class="form-check-input" type="radio" name="data-topbar" id="topbar-color-light" value="light"
                    v-model="topbar" />
                  <label class="form-check-label p-0 avatar-md w-100 shadow-sm" for="topbar-color-light">
                    <span class="d-flex gap-1 h-100">
                      <span class="flex-shrink-0">
                        <span class="bg-light d-flex h-100 flex-column gap-1 p-1">
                          <span class="d-block p-1 px-2 bg-primary-subtle rounded mb-2"></span>

                          <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                          <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                          <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                        </span>
                      </span>
                      <span class="flex-grow-1">
                        <span class="d-flex h-100 flex-column">
                          <span class="bg-light d-block p-1"></span>
                          <span class="bg-light d-block p-1 mt-auto"></span>
                        </span>
                      </span>
                    </span>
                  </label>
                </div>
                <h5 class="fs-13 text-center mt-2">Light</h5>
              </div>
              <div class="col" cols="4">
                <div class="form-check card-radio">
                  <input class="form-check-input" type="radio" name="data-topbar" id="topbar-color-dark" value="dark"
                    v-model="topbar" />
                  <label class="form-check-label p-0 avatar-md w-100 shadow-sm" for="topbar-color-dark">
                    <span class="d-flex gap-1 h-100">
                      <span class="flex-shrink-0">
                        <span class="bg-light d-flex h-100 flex-column gap-1 p-1">
                          <span class="d-block p-1 px-2 bg-primary-subtle rounded mb-2"></span>

                          <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                          <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                          <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                        </span>
                      </span>
                      <span class="flex-grow-1">
                        <span class="d-flex h-100 flex-column">
                          <span class="bg-dark d-block p-1"></span>
                          <span class="bg-light d-block p-1 mt-auto"></span>
                        </span>
                      </span>
                    </span>
                  </label>
                </div>
                <h5 class="fs-13 text-center mt-2">Dark</h5>
              </div>
            </div>
            <div v-if="layoutType == 'vertical' || (layoutType == 'semibox' && visibility == 'show')" id="sidebar-size">
              <h6 class="mt-4 mb-0 fw-semibold text-uppercase fs-12">Sidebar Size</h6>
              <p class="text-muted">Choose a size of Sidebar.</p>

              <div class="row">
                <div class="col" cols="4">
                  <div class="form-check sidebar-setting card-radio">
                    <input class="form-check-input" type="radio" name="data-sidebar-size" id="sidebar-size-default"
                      v-model="sidebarSize" value="lg" />
                    <label class="form-check-label p-0 avatar-md w-100 shadow-sm" for="sidebar-size-default">
                      <span class="d-flex gap-1 h-100">
                        <span class="flex-shrink-0">
                          <span class="bg-light d-flex h-100 flex-column gap-1 p-1">
                            <span class="d-block p-1 px-2 bg-primary-subtle rounded mb-2"></span>

                            <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                            <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                            <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                          </span>
                        </span>
                        <span class="flex-grow-1">
                          <span class="d-flex h-100 flex-column">
                            <span class="bg-light d-block p-1"></span>
                            <span class="bg-light d-block p-1 mt-auto"></span>
                          </span>
                        </span>
                      </span>
                    </label>
                  </div>
                  <h5 class="fs-13 text-center mt-2">Default</h5>
                </div>

                <div class="col" cols="4">
                  <div class="form-check sidebar-setting card-radio">
                    <input class="form-check-input" type="radio" name="data-sidebar-size" id="sidebar-size-compact"
                      v-model="sidebarSize" value="md" />
                    <label class="form-check-label p-0 avatar-md w-100 shadow-sm" for="sidebar-size-compact">
                      <span class="d-flex gap-1 h-100">
                        <span class="flex-shrink-0">
                          <span class="bg-light d-flex h-100 flex-column gap-1 p-1">
                            <span class="d-block p-1 bg-primary-subtle rounded mb-2"></span>
                            <span class="d-block p-1 pb-0 bg-primary-subtle"></span>
                            <span class="d-block p-1 pb-0 bg-primary-subtle"></span>
                            <span class="d-block p-1 pb-0 bg-primary-subtle"></span>
                          </span>
                        </span>
                        <span class="flex-grow-1">
                          <span class="d-flex h-100 flex-column">
                            <span class="bg-light d-block p-1"></span>
                            <span class="bg-light d-block p-1 mt-auto"></span>
                          </span>
                        </span>
                      </span>
                    </label>
                  </div>
                  <h5 class="fs-13 text-center mt-2">Compact</h5>
                </div>

                <div class="col" cols="4">
                  <div class="form-check sidebar-setting card-radio">
                    <input class="form-check-input" v-model="sidebarSize" type="radio" name="data-sidebar-size"
                      id="sidebar-size-small" value="sm" />
                    <label class="form-check-label p-0 avatar-md w-100 shadow-sm" for="sidebar-size-small">
                      <span class="d-flex gap-1 h-100">
                        <span class="flex-shrink-0">
                          <span class="bg-light d-flex h-100 flex-column gap-1">
                            <span class="d-block p-1 bg-primary-subtle mb-2"></span>
                            <span class="d-block p-1 pb-0 bg-primary-subtle"></span>
                            <span class="d-block p-1 pb-0 bg-primary-subtle"></span>
                            <span class="d-block p-1 pb-0 bg-primary-subtle"></span>
                          </span>
                        </span>
                        <span class="flex-grow-1">
                          <span class="d-flex h-100 flex-column">
                            <span class="bg-light d-block p-1"></span>
                            <span class="bg-light d-block p-1 mt-auto"></span>
                          </span>
                        </span>
                      </span>
                    </label>
                  </div>
                  <h5 class="fs-13 text-center mt-2">Small (Icon View)</h5>
                </div>

                <div class="col" cols="4">
                  <div class="form-check sidebar-setting card-radio">
                    <input class="form-check-input" v-model="sidebarSize" type="radio" name="data-sidebar-size"
                      id="sidebar-size-small-hover" value="sm-hover" />
                    <label class="form-check-label p-0 avatar-md w-100 shadow-sm" for="sidebar-size-small-hover">
                      <span class="d-flex gap-1 h-100">
                        <span class="flex-shrink-0">
                          <span class="bg-light d-flex h-100 flex-column gap-1">
                            <span class="d-block p-1 bg-primary-subtle mb-2"></span>
                            <span class="d-block p-1 pb-0 bg-primary-subtle"></span>
                            <span class="d-block p-1 pb-0 bg-primary-subtle"></span>
                            <span class="d-block p-1 pb-0 bg-primary-subtle"></span>
                          </span>
                        </span>
                        <span class="flex-grow-1">
                          <span class="d-flex h-100 flex-column">
                            <span class="bg-light d-block p-1"></span>
                            <span class="bg-light d-block p-1 mt-auto"></span>
                          </span>
                        </span>
                      </span>
                    </label>
                  </div>
                  <h5 class="fs-13 text-center mt-2">Small Hover View</h5>
                </div>
              </div>
            </div>

            <div v-if="layoutType == 'vertical'" id="sidebar-view">
              <h6 class="mt-4 mb-0 fw-semibold text-uppercase fs-12">Sidebar View</h6>
              <p class="text-muted">Choose Default or Detached Sidebar view.</p>

              <div class="row">
                <div class="col" cols="4">
                  <div class="form-check sidebar-setting card-radio">
                    <input class="form-check-input" v-model="sidebarView" type="radio" name="data-layout-style"
                      id="sidebar-view-default" value="default" />
                    <label class="form-check-label p-0 avatar-md w-100 shadow-sm" for="sidebar-view-default">
                      <span class="d-flex gap-1 h-100">
                        <span class="flex-shrink-0">
                          <span class="bg-light d-flex h-100 flex-column gap-1 p-1">
                            <span class="d-block p-1 px-2 bg-primary-subtle rounded mb-2"></span>

                            <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                            <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                            <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                          </span>
                        </span>
                        <span class="flex-grow-1">
                          <span class="d-flex h-100 flex-column">
                            <span class="bg-light d-block p-1"></span>
                            <span class="bg-light d-block p-1 mt-auto"></span>
                          </span>
                        </span>
                      </span>
                    </label>
                  </div>
                  <h5 class="fs-13 text-center mt-2">Default</h5>
                </div>
                <div class="col" cols="4">
                  <div class="form-check sidebar-setting card-radio">
                    <input class="form-check-input" v-model="sidebarView" type="radio" name="data-layout-style"
                      id="sidebar-view-detached" value="detached" />
                    <label class="form-check-label p-0 avatar-md w-100 shadow-sm" for="sidebar-view-detached">
                      <span class="d-flex h-100 flex-column">
                        <span class="bg-light d-flex p-1 gap-1 align-items-center px-2">
                          <span class="d-block p-1 bg-primary-subtle rounded me-1"></span>
                          <span class="d-block p-1 pb-0 px-2 bg-primary-subtle ms-auto"></span>

                          <span class="d-block p-1 pb-0 px-2 bg-primary-subtle"></span>
                        </span>
                        <span class="d-flex gap-1 h-100 p-1 px-2">
                          <span class="flex-shrink-0">
                            <span class="bg-light d-flex h-100 flex-column gap-1 p-1">
                              <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                              <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                              <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                            </span>
                          </span>
                        </span>
                        <span class="bg-light d-block p-1 mt-auto px-2"></span>
                      </span>
                    </label>
                  </div>
                  <h5 class="fs-13 text-center mt-2">Detached</h5>
                </div>
              </div>
            </div>

            <div v-if="
              layoutType == 'vertical' ||
              layoutType === 'twocolumn' ||
              (layoutType === 'semibox' && visibility === 'show')
            " id="sidebar-color">
              <h6 class="mt-4 mb-0 fw-semibold text-uppercase fs-12">Sidebar Color</h6>
              <p class="text-muted">Choose Ligth or Dark Sidebar Color.</p>

              <div class="row">
                <div class="col" cols="4">
                  <div class="form-check sidebar-setting card-radio">
                    <input class="form-check-input" v-model="sidebarColor" type="radio" name="data-sidebar"
                      id="sidebar-color-light" value="light" @click="onSideBarColorClick('light')" />
                    <label class="form-check-label p-0 avatar-md w-100" for="sidebar-color-light">
                      <span class="d-flex gap-1 h-100">
                        <span class="flex-shrink-0">
                          <span class="bg-white border-end d-flex h-100 flex-column gap-1 p-1">
                            <span class="d-block p-1 px-2 bg-primary-subtle rounded mb-2"></span>

                            <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                            <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                            <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                          </span>
                        </span>
                        <span class="flex-grow-1">
                          <span class="d-flex h-100 flex-column">
                            <span class="bg-light d-block p-1"></span>
                            <span class="bg-light d-block p-1 mt-auto"></span>
                          </span>
                        </span>
                      </span>
                    </label>
                  </div>
                  <h5 class="fs-13 text-center mt-2">Light</h5>
                </div>
                <div class="col" cols="4">
                  <div class="form-check sidebar-setting card-radio">
                    <input class="form-check-input" v-model="sidebarColor" type="radio" name="data-sidebar"
                      id="sidebar-color-dark" value="dark" @click="onSideBarColorClick('dark')" />
                    <label class="form-check-label p-0 avatar-md w-100" for="sidebar-color-dark">
                      <span class="d-flex gap-1 h-100">
                        <span class="flex-shrink-0">
                          <span class="bg-primary d-flex h-100 flex-column gap-1 p-1">
                            <span class="d-block p-1 px-2 bg-white bg-opacity-10 rounded mb-2"></span>
                            <span class="d-block p-1 px-2 pb-0 bg-white bg-opacity-10"></span>
                            <span class="d-block p-1 px-2 pb-0 bg-white bg-opacity-10"></span>
                            <span class="d-block p-1 px-2 pb-0 bg-white bg-opacity-10"></span>
                          </span>
                        </span>
                        <span class="flex-grow-1">
                          <span class="d-flex h-100 flex-column">
                            <span class="bg-light d-block p-1"></span>
                            <span class="bg-light d-block p-1 mt-auto"></span>
                          </span>
                        </span>
                      </span>
                    </label>
                  </div>
                  <h5 class="fs-13 text-center mt-2">Dark</h5>
                </div>
                <div class="col" cols="4">
                  <button class="btn btn-link avatar-md w-100 p-0 overflow-hidden border collapsed" type="button"
                    data-bs-target="#collapseBgGradient" data-bs-toggle="#collapseBgGradient"
                    @click="onSideBarColorClick('gradient')">
                    <!-- v-b-target.collapseBgGradient
                    v-b-toggle.collapseBgGradient -->
                    <span class="d-flex gap-1 h-100">
                      <span class="flex-shrink-0">
                        <span class="bg-vertical-gradient d-flex h-100 flex-column gap-1 p-1">
                          <span class="d-block p-1 px-2 bg-white bg-opacity-10 rounded mb-2"></span>
                          <span class="d-block p-1 px-2 pb-0 bg-white bg-opacity-10"></span>
                          <span class="d-block p-1 px-2 pb-0 bg-white bg-opacity-10"></span>
                          <span class="d-block p-1 px-2 pb-0 bg-white bg-opacity-10"></span>
                        </span>
                      </span>
                      <span class="flex-grow-1">
                        <span class="d-flex h-100 flex-column">
                          <span class="bg-light d-block p-1"></span>
                          <span class="bg-light d-block p-1 mt-auto"></span>
                        </span>
                      </span>
                    </span>
                  </button>
                  <h5 class="fs-13 text-center mt-2">Gradient</h5>
                </div>
              </div>
              <div class="collapse" v-if="data.showGradients" id="collapseBgGradient">
                <div class="d-flex gap-2 flex-wrap img-switch p-2 px-3 bg-light rounded">
                  <div class="form-check sidebar-setting card-radio">
                    <input class="form-check-input" type="radio" v-model="sidebarColor" name="data-sidebar"
                      id="sidebar-color-gradient" value="gradient" />
                    <label class="form-check-label p-0 avatar-xs rounded-circle" for="sidebar-color-gradient">
                      <span class="avatar-title rounded-circle bg-vertical-gradient"></span>
                    </label>
                  </div>
                  <div class="form-check sidebar-setting card-radio">
                    <input class="form-check-input" type="radio" v-model="sidebarColor" name="data-sidebar"
                      id="sidebar-color-gradient-2" value="gradient-2" />
                    <label class="form-check-label p-0 avatar-xs rounded-circle" for="sidebar-color-gradient-2">
                      <span class="avatar-title rounded-circle bg-vertical-gradient-2"></span>
                    </label>
                  </div>
                  <div class="form-check sidebar-setting card-radio">
                    <input class="form-check-input" type="radio" v-model="sidebarColor" name="data-sidebar"
                      id="sidebar-color-gradient-3" value="gradient-3" />
                    <label class="form-check-label p-0 avatar-xs rounded-circle" for="sidebar-color-gradient-3">
                      <span class="avatar-title rounded-circle bg-vertical-gradient-3"></span>
                    </label>
                  </div>
                  <div class="form-check sidebar-setting card-radio">
                    <input class="form-check-input" type="radio" v-model="sidebarColor" name="data-sidebar"
                      id="sidebar-color-gradient-4" value="gradient-4" />
                    <label class="form-check-label p-0 avatar-xs rounded-circle" for="sidebar-color-gradient-4">
                      <span class="avatar-title rounded-circle bg-vertical-gradient-4"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="
              layoutType == 'vertical' ||
              layoutType === 'twocolumn' ||
              (layoutType === 'semibox' && visibility === 'show')
            " id="sidebar-img">
              <h6 class="mt-4 mb-0 fw-semibold text-uppercase fs-12">Sidebar Images</h6>
              <p class="text-muted">Choose a image of Sidebar.</p>

              <div class="d-flex gap-2 flex-wrap img-switch">
                <div class="form-check sidebar-setting card-radio">
                  <input class="form-check-input" v-model="sidebarImage" type="radio" name="data-sidebar-img"
                    id="sidebarimg-none" value="none" />
                  <label class="form-check-label p-0 avatar-sm h-auto" for="sidebarimg-none">
                    <span class="avatar-md w-auto bg-light d-flex align-items-center justify-content-center">
                      <i class="ri-close-fill fs-20"></i>
                    </span>
                  </label>
                </div>

                <div class="form-check sidebar-setting card-radio">
                  <input class="form-check-input" v-model="sidebarImage" type="radio" name="data-sidebar-img"
                    id="sidebarimg-01" value="img-1" />
                  <label class="form-check-label p-0 avatar-sm h-auto" for="sidebarimg-01">
                    <img src="@/assets/images/sidebar/img-1.jpg" alt="" class="avatar-md w-auto object-fit-cover" />
                  </label>
                </div>

                <div class="form-check sidebar-setting card-radio">
                  <input class="form-check-input" v-model="sidebarImage" type="radio" name="data-sidebar-img"
                    id="sidebarimg-02" value="img-2" />
                  <label class="form-check-label p-0 avatar-sm h-auto" for="sidebarimg-02">
                    <img src="@/assets/images/sidebar/img-2.jpg" alt="" class="avatar-md w-auto object-fit-cover" />
                  </label>
                </div>
                <div class="form-check sidebar-setting card-radio">
                  <input class="form-check-input" v-model="sidebarImage" type="radio" name="data-sidebar-img"
                    id="sidebarimg-03" value="img-3" />
                  <label class="form-check-label p-0 avatar-sm h-auto" for="sidebarimg-03">
                    <img src="@/assets/images/sidebar/img-3.jpg" alt="" class="avatar-md w-auto object-fit-cover" />
                  </label>
                </div>
                <div class="form-check sidebar-setting card-radio">
                  <input class="form-check-input" v-model="sidebarImage" type="radio" name="data-sidebar-img"
                    id="sidebarimg-04" value="img-4" />
                  <label class="form-check-label p-0 avatar-sm h-auto" for="sidebarimg-04">
                    <img src="@/assets/images/sidebar/img-4.jpg" alt="" class="avatar-md w-auto object-fit-cover" />
                  </label>
                </div>
              </div>
            </div>

            <div id="preloader-menu">
              <h6 class="mt-4 mb-0 fw-semibold text-uppercase fs-12">Preloader</h6>
              <p class="text-muted">Choose a preloader.</p>

              <div class="row">
                <div class="col" cols="4">
                  <div class="form-check sidebar-setting card-radio">
                    <input class="form-check-input" v-model="preloader" type="radio" name="data-preloader"
                      id="preloader-view-custom" value="enable" />
                    <label class="form-check-label p-0 avatar-md w-100" for="preloader-view-custom">
                      <span class="d-flex gap-1 h-100">
                        <span class="flex-shrink-0">
                          <span class="bg-light d-flex h-100 flex-column gap-1 p-1">
                            <span class="d-block p-1 px-2 bg-primary-subtle rounded mb-2"></span>
                            <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                            <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                            <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                          </span>
                        </span>
                        <span class="flex-grow-1">
                          <span class="d-flex h-100 flex-column">
                            <span class="bg-light d-block p-1"></span>
                            <span class="bg-light d-block p-1 mt-auto"></span>
                          </span>
                        </span>
                      </span>
                      <div id="status" class="d-flex align-items-center justify-content-center">
                        <div class="spinner-border text-primary avatar-xxs m-auto" role="status">
                          <span class="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    </label>
                  </div>
                  <h5 class="fs-13 text-center mt-2">Enable</h5>
                </div>
                <div class="col" cols="4">
                  <div class="form-check sidebar-setting card-radio">
                    <input class="form-check-input" v-model="preloader" type="radio" name="data-preloader"
                      id="preloader-view-none" value="disable" />
                    <label class="form-check-label p-0 avatar-md w-100" for="preloader-view-none">
                      <span class="d-flex gap-1 h-100">
                        <span class="flex-shrink-0">
                          <span class="bg-light d-flex h-100 flex-column gap-1 p-1">
                            <span class="d-block p-1 px-2 bg-primary-subtle rounded mb-2"></span>
                            <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                            <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                            <span class="d-block p-1 px-2 pb-0 bg-primary-subtle"></span>
                          </span>
                        </span>
                        <span class="flex-grow-1">
                          <span class="d-flex h-100 flex-column">
                            <span class="bg-light d-block p-1"></span>
                            <span class="bg-light d-block p-1 mt-auto"></span>
                          </span>
                        </span>
                      </span>
                    </label>
                  </div>
                  <h5 class="fs-13 text-center mt-2">Disable</h5>
                </div>
              </div>
            </div>
          </div>
        </simpleBar>
      </div>
      <div class="offcanvas-footer border-top p-3 text-center">
        <div class="row">
          <div class="col" cols="6">
            <button type="button" class="w-100 btn btn-light" id="reset-layout" @click="resetLayout">
              Reset
            </button>
          </div>
          <div class="col" cols="6">
            <button target="_blank" class="w-100 btn btn-primary" @click="applyLayout">
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.b-overlay-wrap {
  .b-overlay {
    z-index: 1005 !important;
  }
}
</style>
