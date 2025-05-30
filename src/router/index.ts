import {
  createWebHistory,
  createRouter,
  type RouteRecordRaw,
  type NavigationGuardNext
} from 'vue-router'
import routes from './routes'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import Swal from 'sweetalert2'
import { type RouteLocationNormalized } from 'vue-router'
import { check } from '@/service/authService'

const router = createRouter({
  history: createWebHistory('/'),
  routes: routes as RouteRecordRaw[],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, left: 0 }
    }
  }
})

function authCheck(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore()
  const { token, permissions } = storeToRefs(authStore)
  const authRequired = to.matched.some((route) => route.meta.authRequired as boolean)
  const permissionRequired = to.matched.some((route) => route.meta.permissionRequired as string)
  if (token.value) {
    if (authRequired && to.name !== 'index') {
      if (permissionRequired) {
        const matching = permissions.value.filter(
          (val: { module: unknown }) => val.module === to.meta.permissionRequired
        )
        if (matching.length < 1) {
          console.error("You don't have permission!")
          Swal.fire(
            'Back off!!!',
            "Seems like you don't have permission to access this module!",
            'error'
          ).then(() => next(from)) // Ensure next is called after the alert
        }
      }
    }

    if (to.name !== 'auth.login' && from.name !== undefined) {
      return next()
    }

    if (to.name === undefined) {
      return next()
    }

    if (to.name === 'auth.login' && token.value) {
      return next({ name: 'dashboard', replace: true })
    }

    if (to.name === 'index') {
      return next({ name: 'dashboard' })
    }
    return next()
  } else {
    if (authRequired) {
      return next({ name: 'auth.login' })
    }
    next()
  }
}

function tokenValidityChecker(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  if (from.path == '/') {
    const authStore = useAuthStore()
    if (to.name == 'auth.login') {
      if (authStore.token) {
        check(authStore.token)
          .then(() => {
            return next({ name: 'dashboard', replace: true })
          })
          .catch((e) => {
            if (e.response.data.message == 'Token expired!') {
              Swal.fire({
                title: 'Your session has ended!',
                text: 'Please login again with your account!',
                icon: 'error',
                allowOutsideClick: false
              }).then((event) => {
                if (event.isConfirmed) {
                  return next(to)
                }
              })
            }
            return next(to)
          })
      }
    }
  }
}

router.beforeEach(
  async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    tokenValidityChecker(to, from, next)
    authCheck(to, from, next)
  }
)

export default router
