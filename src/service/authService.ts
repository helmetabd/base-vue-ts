import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URL,
  timeout: 120000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})
const check = async (token: string) => {
  await apiClient
    .post(`/auth/check`, null, {
      headers: {
        Authorization: token
      }
    })
    .then((res) => {
      return res
    })
    .catch((e) => {
      throw e
    })
}
export { check }
