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
function validateJWT(token: string) {
  // Check if token is a string and not empty
  if (!token || typeof token !== 'string') {
    return { isValid: false, isExpired: null, error: 'Invalid token format' }
  }

  // Split JWT into parts
  const parts = token.split('.')

  // JWT must have exactly 3 parts (header.payload.signature)
  if (parts.length !== 3) {
    return { isValid: false, isExpired: null, error: 'Invalid JWT structure' }
  }

  try {
    // Decode the payload (second part)
    const payloadPart = parts[1]
    if (!payloadPart) {
      return { isValid: false, isExpired: null, error: 'Invalid JWT payload' }
    }
    const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = atob(base64)
    const payload = JSON.parse(decoded)

    // Check if payload has required structure
    if (typeof payload !== 'object' || payload === null) {
      return { isValid: false, isExpired: null, error: 'Invalid payload' }
    }

    // Check expiration if 'exp' claim exists
    const currentTime = Math.floor(Date.now() / 1000) // Current time in seconds
    const isExpired = payload.exp ? currentTime > payload.exp : false

    return {
      isValid: true,
      isExpired: isExpired,
      payload: payload,
      expiresAt: payload.exp ? new Date(payload.exp * 1000) : null
    }
  } catch (error) {
    console.error('Error decoding JWT:', error)
    return {
      isValid: false,
      isExpired: null,
      error: 'Failed to decode JWT payload'
    }
  }
}
function isValidAndActive(token: string): boolean {
  const result = validateJWT(token)
  return result.isValid && !result.isExpired
}
function register(formData: any) {
  return apiClient.post('/auth/register', formData)
}
export { check, isValidAndActive, apiClient as authApiClient, register }
