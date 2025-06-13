import apiClient from '../service/ApiClientService.js'

import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import permissionSuper from '@/config/permissionSuper.json'

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
          console.log(res.data)
          this.token = res.data.accessToken
          this.role = res.data.user.role
          this.user = res.data.user
          if(res.data.user.role !== 'USER'){
            this.permissions = permissionSuper
          } else {
            this.permissions = []
          }
        })
      } catch (error: any) {
        if (error.response?.status == 503 && error.response.data.message == 'maintenance') {
          this.error = 'Siwa Manager is under maintenance!'
        } else {
          console.log(error)
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
