import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

interface LayoutValue {
  layoutType: string
  layoutWidth: string
  sidebarSize: string
  topbar: string
  mode: string
  position: string
  sidebarView: string
  sidebarColor: string
  sidebarImage: string
  preloader: string
  visibility: string
}

export const useLayoutStore = defineStore('layout', {
  state: () => ({
    layoutValue: useStorage<LayoutValue>('layoutValue', {
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
    })
  }),
  getters: {
    getLayoutValue: (state) => () => {
      state.layoutValue.layoutType = state.layoutValue.layoutType || 'vertical'
      return { ...state }
    }
  },
  actions: {
    changeLayoutType({ layoutType }: { layoutType: string }) {
      this.layoutValue.layoutType = layoutType
      switch (layoutType) {
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
      document.body.removeAttribute('style')
    },

    changeLayoutWidth({ layoutWidth }: { layoutWidth: string }) {
      this.layoutValue.layoutWidth = layoutWidth
      switch (layoutWidth) {
        case 'fluid':
          document.documentElement.setAttribute('data-layout-width', 'fluid')
          break
        case 'boxed':
          document.documentElement.setAttribute('data-layout-width', 'boxed')
          break
      }
    },

    changeSidebarSize({ sidebarSize }: { sidebarSize: string }) {
      this.layoutValue.sidebarSize = sidebarSize
      switch (sidebarSize) {
        case '':
          document.documentElement.setAttribute('data-sidebar-size', '')
          break
        case 'sm-hover-active':
          document.documentElement.setAttribute('data-sidebar-size', 'sm-hover-active')
          break
        case 'sm-hover':
          document.documentElement.setAttribute('data-sidebar-size', 'sm-hover')
          break
        case 'sm':
          document.documentElement.setAttribute('data-sidebar-size', 'sm')
          break
        case 'md':
          document.documentElement.setAttribute('data-sidebar-size', 'md')
          break
        case 'lg':
          document.documentElement.setAttribute('data-sidebar-size', 'lg')
          break
      }
    },

    changeTopbar() {
      const documentMode = document.documentElement.getAttribute('data-topbar')
      if (documentMode === 'dark') {
        document.documentElement.setAttribute('data-topbar', 'light')
      } else {
        document.documentElement.setAttribute('data-topbar', 'dark')
      }
      this.layoutValue.topbar = document.documentElement.getAttribute('data-topbar') || 'light'
    },

    changeMode() {
      const documentMode = document.documentElement.getAttribute('data-bs-theme')
      if (documentMode === 'dark') {
        document.documentElement.setAttribute('data-bs-theme', 'light')
        document.documentElement.setAttribute('data-sidebar', 'light')
        this.layoutValue.sidebarColor = 'light'
      } else {
        document.documentElement.setAttribute('data-bs-theme', 'dark')
        document.documentElement.setAttribute('data-sidebar', 'dark')
        this.layoutValue.sidebarColor = 'dark'
      }
      this.layoutValue.mode = document.documentElement.getAttribute('data-bs-theme') || 'light'
    },

    changePosition({ position }: { position: string }) {
      this.layoutValue.position = position
      switch (position) {
        case 'fixed':
          document.documentElement.setAttribute('data-layout-position', 'fixed')
          break
        case 'scrollable':
          document.documentElement.setAttribute('data-layout-position', 'scrollable')
          break
      }
    },

    changeSidebarView({ sidebarView }: { sidebarView: string }) {
      this.layoutValue.sidebarView = sidebarView
      switch (sidebarView) {
        case 'detached':
          document.documentElement.setAttribute('data-layout-style', 'detached')
          break
        case 'default':
          document.documentElement.setAttribute('data-layout-style', 'default')
          break
      }
    },

    changeSidebarColor({ sidebarColor }: { sidebarColor: string }) {
      this.layoutValue.sidebarColor = sidebarColor
      switch (sidebarColor) {
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
    },

    changeSidebarImage({ sidebarImage }: { sidebarImage: string }) {
      this.layoutValue.sidebarImage = sidebarImage
      switch (sidebarImage) {
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
    },

    changePreloader() {
      const documentMode = document.documentElement.getAttribute('data-preloader')
      if (documentMode === 'disable') {
        document.documentElement.setAttribute('data-preloader', 'enable')
      } else {
        document.documentElement.setAttribute('data-preloader', 'disable')
      }
      this.layoutValue.preloader =
        document.documentElement.getAttribute('data-preloader') || 'disable'
      useStorage('data-preloader', this.layoutValue.preloader)
    },

    changeVisibility({ visibility }: { visibility: string }) {
      this.layoutValue.visibility = visibility
      switch (visibility) {
        case 'show':
          document.documentElement.setAttribute('data-sidebar-visibility', 'show')
          break
        case 'hidden':
          document.documentElement.setAttribute('data-sidebar-visibility', 'hidden')
          break
      }
    }
  }
})
