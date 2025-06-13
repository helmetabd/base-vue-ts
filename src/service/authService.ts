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
  try {
    // Remove 'Bearer ' prefix if present
    const cleanToken = token.replace(/^Bearer\s+/i, '')
    
    // Decode JWT payload
    const payload = JSON.parse(atob(cleanToken.split('.')[1]))
    
    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < currentTime) {
      throw new Error('Token expired!')
    }
    
    return { valid: true }
  } catch (error) {
    if (error instanceof Error && error.message === 'Token expired!') {
      throw { response: { data: { message: 'Token expired!' } } }
    }
    throw { response: { data: { message: 'Invalid token' } } }
  }
}

const register = async (userData: { email: string; username: string; password: string }) => {
  try {
    const response = await apiClient.post('/auth/register', userData)
    return response.data
  } catch (error) {
    throw error
  }
}

export { check, register }
