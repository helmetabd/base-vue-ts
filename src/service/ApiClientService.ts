import axios from 'axios'
import router from '../router'
import { format } from '@redtea/format-axios-error'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'
import type { Dashboard, ResponseRaw, ResponseUtils } from '@/interfaces/Utils'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URL,
  timeout: 120000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

function isResponseUtils(obj: any): obj is ResponseUtils {
  return obj && obj.meta && obj.meta.current_page !== undefined && obj.links !== undefined
}

function isDashboard(obj: any): obj is Dashboard {
  return obj && obj.total_employees && obj.average_age && obj.annual_growth
}

function isImageUpload(obj: any): obj is { url: string; uploaded: number; fileName: string } {
  return (
    obj &&
    typeof obj.url === 'string' &&
    typeof obj.uploaded === 'number' &&
    typeof obj.fileName === 'string'
  )
}

function isEditMode(url: string): boolean {
  return url.includes('/edit')
}

apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (!config.headers.Authorization && authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => {
    const responseData = response.data
    if (isResponseUtils(responseData)) {
      return responseData as ResponseUtils // Return as ResponseUtils if it matches
    } else if (isDashboard(responseData)) {
      return responseData as Dashboard // Return the raw Axios data if it doesn't match
    } else if (isImageUpload(responseData)) {
      return responseData as { url: string; uploaded: number; fileName: string }
    } else if (isEditMode(response.config.url || '')) {
      return response
    } else {
      return responseData // Return the raw Axios data if it doesn't match
    }
  },
  (error) => {
    if (import.meta.env.VITE_NODE_NV !== 'production') {
      console.error(JSON.stringify(format(error), null, 2))
    }

    const status = error.response?.status

    if (status === 401) {
      localStorage.clear()
      return Swal.fire(
        'Session invalid',
        'Sesi anda telah berahir / Anda login di perangkat lain!',
        'error'
      ).then((e) => {
        if (e.isConfirmed) {
          router.push('/auth/login')
        }
      })
    }

    if (status === 403) {
      return Swal.fire(
        'Back off!!!',
        "Seems like you don't have permit to access this module!",
        'error'
      ).then((e) => {
        if (e.isConfirmed) {
          router.push({ name: 'dashboard' })
        }
      })
    }

    if (status === 406) {
      return Swal.fire('Not Acceptable', error.response?.data?.message, 'error').then((e) => {
        if (e.isConfirmed) {
          router.push('/auth/login')
        }
      })
    }

    // if (status === 409) {
    //   console.log("i'm called")
    //   Swal.fire(error.response?.errors, error.response?.message, 'error').then((e) => {
    //     if (e.isConfirmed) {
    //       router.push({ name: 'dashboard' })
    //     }
    //   })
    //   return false // Stop promise chain like the second snippet
    // }

    // Handle other errors
    return Promise.reject(error) // Still propagate the error for other cases
  }
)

export default apiClient
