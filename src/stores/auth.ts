import apiClient from '../service/ApiClientService.js'

import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    permit_token: useStorage('permit_token', null, undefined, {
      serializer: {
        read: (v) => (v ? JSON.parse(v) : null),
        write: (v) => JSON.stringify(v)
      }
    }),
    token: useStorage('token', null, undefined, {
      serializer: {
        read: (v) => (v ? JSON.parse(v) : null),
        write: (v) => JSON.stringify(v)
      }
    }),
    user: useStorage('user', null, undefined, {
      serializer: {
        read: (v) => (v ? JSON.parse(v) : null),
        write: (v) => JSON.stringify(v)
      }
    }),
    role: useStorage('role', null, undefined, {
      serializer: {
        read: (v) => (v ? JSON.parse(v) : null),
        write: (v) => JSON.stringify(v)
      }
    }),
    permissions: useStorage('permissions', null, undefined, {
      serializer: {
        read: (v) => (v ? JSON.parse(v) : null),
        write: (v) => JSON.stringify(v)
      }
    }),
    loading: false,
    error: ''
  }),

  actions: {
    async signIn(payload: any) {
      try {
        this.loading = true
        await apiClient.post('/auth/login', payload).then((res) => {
          this.token = res.data.token
          this.role = res.data.role
          this.user = res.data.user
          this.permissions = res.data.permissions
          const settings = res.data.user.settings
          if (settings != null) {
            useStorage('layoutValue', settings)
          }
        })
      } catch (error: any) {
        if (error.response?.status == 503 && error.response.data.message == 'maintenance') {
          this.error = 'Yudhistira is under maintenance!'
        } else {
          this.error = error.response.data.message
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
    }
  }
})
