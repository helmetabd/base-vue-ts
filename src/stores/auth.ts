import apiClient from '../service/ApiClientService.js'

import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { authApiClient } from '@/service/authService.js'
import type { UserStore } from '@/interfaces/User.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    permit_token: useStorage('permit_token', null, undefined, {
      serializer: { read: (v) => (v ? JSON.parse(v) : null), write: (v) => JSON.stringify(v) }
    }),
    token: useStorage('token', null, undefined, {
      serializer: { read: (v) => (v ? JSON.parse(v) : null), write: (v) => JSON.stringify(v) }
    }),
    user: useStorage('user', null, undefined, {
      serializer: { read: (v) => (v ? JSON.parse(v) : null), write: (v) => JSON.stringify(v) }
    }),
    role: useStorage('role', null, undefined, {
      serializer: { read: (v) => (v ? JSON.parse(v) : null), write: (v) => JSON.stringify(v) }
    }),
    permissions: useStorage('permissions', null, undefined, {
      serializer: { read: (v) => (v ? JSON.parse(v) : null), write: (v) => JSON.stringify(v) }
    }),
    loading: false,
    error: ''
  }),

  actions: {
    async signIn(payload: any) {
      try {
        this.loading = true
        await authApiClient.post('/auth/login', payload).then((res) => {
          const response = res.data.data
          this.token = response.token
          this.role = response.role
          this.user = response.user
          this.permissions = response.permissions
          let settings = response.user.settings
          if (settings != null) {
            useStorage('layoutValue', settings)
          }
        })
      } catch (error: any) {
        if (error.response?.status == 503 && error.response.data.message == 'maintenance') {
          this.error = 'Brama is under maintenance!'
        } else {
          this.error = error.response?.data?.message || error.message || 'Login failed'
        }
      } finally {
        this.loading = false
      }
    },
    async loggingOut() {
      await apiClient.post('/auth/logout').finally(async () => {
        localStorage.clear()
        history.go()
      })
    },
    setUser(user: UserStore) {
      this.user = user
    }
  }
})
