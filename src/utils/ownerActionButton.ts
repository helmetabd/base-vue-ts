import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const checkOwner = (ownerId: number | string) => {
  if (ownerId == authStore.user.id) {
    return true
  }
  return false
}

export default checkOwner
