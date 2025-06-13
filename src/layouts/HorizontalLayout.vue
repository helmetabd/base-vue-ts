<script setup lang="ts">
import router from '@/router'
import { watch, onMounted, onUnmounted, provide, ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from "@/components/NavBar.vue"
import RightBar from "@/components/RightBar.vue"
import Footer from "@/components/FooterComponent.vue"
import menu from '@/config/menu'
import { useAuthStore } from '@/stores/auth'
import type { Menu } from '@/interfaces/Utils'

/**
 * Horizontal layout
 */

const authStore = useAuthStore()
const permissions = authStore.permissions;
const route = useRoute()
const isMenuCondensed = ref(false)
const data = reactive({
  menus: menu() as Menu[],
})

const initActiveMenu = (path: string): void => {
  setTimeout(() => {
    const navbarNav = document.querySelector("#navbar-nav")
    if (navbarNav) {
      const activeLink = navbarNav.querySelector(`[href="${path}"]`) as HTMLElement

      if (activeLink) {
        activeLink.classList.add("active")
        const parentCollapseDiv = activeLink.closest(".collapse.menu-dropdown") as HTMLElement

        if (parentCollapseDiv) {
          parentCollapseDiv.classList.add("show")
          const parentFirstChild = parentCollapseDiv.parentElement?.children[0] as HTMLElement

          if (parentFirstChild) {
            parentFirstChild.classList.add("active")
            parentFirstChild.setAttribute("aria-expanded", "true")
          }

          const nestedParentCollapse = parentCollapseDiv.parentElement?.closest(".collapse.menu-dropdown") as HTMLElement
          if (nestedParentCollapse) {
            nestedParentCollapse.classList.add("show")
            const nestedPreviousSibling = nestedParentCollapse.previousElementSibling as HTMLElement
            if (nestedPreviousSibling) {
              nestedPreviousSibling.classList.add("active")
            }
          }
        }
      }
    }
  }, 1000)
}

const onRoutechange = (newRoute: typeof route): void => {
  initActiveMenu(newRoute.path)
}

// Set horizontal layout attributes
document.body.removeAttribute('data-layout')
document.body.removeAttribute('data-topbar')
document.body.removeAttribute('data-layout-size')
document.body.setAttribute('data-layout', 'horizontal')

function toggleRightSidebar(): void {
  document.body.classList.toggle('right-bar-enabled')
}

function hideRightSidebar(): void {
  document.body.classList.remove('right-bar-enabled')
}

// Provide functions for child components
provide('toggleRightSidebar', toggleRightSidebar)
provide('hideRightSidebar', hideRightSidebar)

// Watch for route changes
watch(
  () => route,
  (newRoute) => onRoutechange(newRoute),
  { immediate: true, deep: true }
)

const getSiblings = (elem: Element): Element[] => {
  const siblings: Element[] = []
  let sibling = elem.parentNode?.firstChild

  while (sibling) {
    if (sibling.nodeType === 1 && sibling !== elem) {
      siblings.push(sibling as Element)
    }
    sibling = sibling.nextSibling
  }
  return siblings
}

function checkSU() {
  return authStore.role.id == 1
}

function checkAuth(req: string) {

  let checker = permissions.filter((e: { module: string; read: number }) => {
    let res = e.module == req
    if (res == true) {
      return e.read == 1 ? true : false
    }
  })
  return checker.length > 0 ? true : false
}

onMounted(() => {
  const collapses = document.querySelectorAll(".navbar-nav .collapse")

  if (collapses.length > 0) {
    collapses.forEach((collapse) => {
      // Hide sibling collapses on `show.bs.collapse`
      collapse.addEventListener("show.bs.collapse", (e) => {
        e.stopPropagation()
        const closestCollapse = (collapse as Element).parentElement?.closest(".collapse") as HTMLElement

        if (closestCollapse) {
          const siblingCollapses = closestCollapse.querySelectorAll(".collapse")
          siblingCollapses.forEach((siblingCollapse) => {
            if (siblingCollapse.classList.contains("show")) {
              siblingCollapse.classList.remove("show")
              const firstChild = siblingCollapse.parentElement?.firstChild as HTMLElement
              if (firstChild) {
                firstChild.setAttribute("aria-expanded", "false")
              }
            }
          })
        } else {
          const siblings = getSiblings((collapse as Element).parentElement!)
          siblings.forEach((item) => {
            if (item.childNodes.length > 2) {
              const firstElementChild = (item as Element).firstElementChild as HTMLElement
              if (firstElementChild) {
                firstElementChild.setAttribute("aria-expanded", "false")
                firstElementChild.classList.remove("active")
              }
            }

            const ids = item.querySelectorAll("*[id]")
            ids.forEach((item1) => {
              item1.classList.remove("show")
              const parentFirstChild = item1.parentElement?.firstChild as HTMLElement
              if (parentFirstChild) {
                parentFirstChild.setAttribute("aria-expanded", "false")
                parentFirstChild.classList.remove("active")
              }

              if (item1.childNodes.length > 2) {
                const val = item1.querySelectorAll("ul li a")
                val.forEach((subitem) => {
                  if (subitem.hasAttribute("aria-expanded")) {
                    subitem.setAttribute("aria-expanded", "false")
                  }
                })
              }
            })
          })
        }
      })

      // Hide nested collapses on `hide.bs.collapse`
      collapse.addEventListener("hide.bs.collapse", (e) => {
        e.stopPropagation()
        const childCollapses = collapse.querySelectorAll(".collapse")
        childCollapses.forEach((childCollapse) => {
          childCollapse.classList.remove("show")
          const parentFirstChild = childCollapse.parentElement?.firstChild as HTMLElement
          if (parentFirstChild) {
            parentFirstChild.setAttribute("aria-expanded", "false")
          }
        })
      })
    })
  }
})

onUnmounted(() => {
  // Clean up layout attributes when component unmounts
  document.body.removeAttribute('data-layout')
})
</script>

<template>
  <div id="layout-wrapper">
    <NavBar />
    <!-- ========== App Menu ========== -->
    <div class="app-menu navbar-menu">
      <!-- LOGO -->
      <div class="navbar-brand-box">
        <!-- Dark Logo-->
        <router-link to="/" class="logo logo-dark">
          <span class="logo-sm">
            <img src="@/assets/images/arjuna-sm.png" alt="" height="22" />
          </span>
          <span class="logo-lg">
            <img src="@/assets/images/logo-light.png" alt="" height="50" />
          </span>
        </router-link>
        <!-- Light Logo-->
        <router-link to="/" class="logo logo-light">
          <span class="logo-sm">
            <img src="@/assets/images/arjuna-sm.png" alt="" height="22" />
          </span>
          <span class="logo-lg">
            <img src="@/assets/images/logo-light.png" alt="" height="50" />
          </span>
        </router-link>
        <button type="button" class="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover"
          id="vertical-hover">
          <i class="ri-record-circle-line"></i>
        </button>
      </div>

      <div id="scrollbar">
        <div class="container-fluid">
          <ul class="navbar-nav h-100" id="navbar-nav">
            <li class="menu-title">
              <span>Menu</span>
            </li>
            <li class="nav-item">
              <router-link class="nav-link menu-link" :to="{ name: 'dashboard' }">
                <i class="ri-dashboard-2-line"></i>
                <span>Dashboard</span>
              </router-link>
            </li>
            <!-- end Dashboard Menu -->
            <li v-for="menu in data.menus" :key="menu.name" class="nav-item">
              <a v-if="menu.caret" v-show="checkAuth(menu.module)" class="nav-link menu-link" :href="`#${menu.name}`"
                data-bs-toggle="collapse" role="button" aria-expanded="false" :aria-controls="menu.name">
                <i :class="menu.icon"></i>
                <span>{{ menu.display_name }}</span>
              </a>
              <router-link v-if="!menu.caret" v-show="checkAuth(menu.module)" :to="{ name: menu.route ?? '' }"
                class="nav-link" data-key="t-simple-page">
                {{ menu.display_name }}
              </router-link>
              <div v-if="menu.caret" class="collapse menu-dropdown" :id="menu.name" v-show="checkAuth(menu.module)">
                <ul class="nav nav-sm flex-column">
                  <li v-for="child in menu.childs" :key="child.name" class="nav-item">
                    <a v-if="child.caret" v-show="checkAuth(child.module)" class="nav-link menu-link"
                      :href="`#${child.name}`" data-bs-toggle="collapse" role="button" aria-expanded="false"
                      :aria-controls="child.name">
                      <span>{{ child.display_name }}</span>
                    </a>
                    <router-link v-if="!child.caret" v-show="checkAuth(child.module)" :to="{ name: child.route ?? '' }"
                      class="nav-link" data-key="t-simple-page">
                      {{ child.display_name }}
                    </router-link>
                    <div v-if="child.caret" v-show="checkAuth(child.module)" class="collapse menu-dropdown"
                      :id="child.name">
                      <ul class="nav nav-sm flex-column">
                        <li v-if="child?.childs" v-for="grandChild in child.childs" :key="grandChild.name"
                          class="nav-item">
                          <router-link :to="{ name: grandChild.route ?? '' }" v-show="checkAuth(grandChild.module)"
                            class="nav-link" data-key="t-simple-page">
                            {{ grandChild.display_name }}
                          </router-link>
                        </li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
            </li>

            <li class="menu-title" v-if="checkSU()">
              <i class="ri-more-fill"></i>
              <span>SYSTEMS</span>
            </li>
            <li v-for="menu in data.menus" :key="menu.name" class="nav-item">
              <router-link v-if="menu.type == 'system' && menu.auth_level_min == 1" v-show="checkSU()"
                :to="{ name: menu.route ?? '' }" class="nav-link" data-key="t-simple-page" activeClass="text-primary">
                <i :class="menu.icon"></i>
                <span>{{ menu.display_name }}</span>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
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
      <Footer />
    </div>
    <RightBar />
  </div>
</template>
