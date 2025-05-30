import axios from 'axios'

const pandawaClient = axios.create({
  baseURL: import.meta.env.VITE_APP_PANDAWA_API,
  timeout: 20000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
})

pandawaClient.interceptors.request.use(
  (config) => {
    config.params = { ...config.params, token: import.meta.env.VITE_APP_PANDAWA_API_TOKEN }
    config.params['token'] = import.meta.env.VITE_APP_PANDAWA_TOKEN
    config.params['su'] = 1
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default pandawaClient
