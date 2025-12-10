
import { useAuthStore } from '@/stores/auth'

const checkOwner = (ownerId: number) => {
  const authStore = useAuthStore()
  if (ownerId == authStore.user.id) {
    return true
  }
  return false
}

export default checkOwner
