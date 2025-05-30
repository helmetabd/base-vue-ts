import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'
const authStore = useAuthStore()

function checkRole(
  requiredPermission: any,
  mode: string,
  suRestriction = false,
  targetRole: number | null = null
) {
  const router = useRoute()

  const arr = authStore.permissions
  if (targetRole != null) {
    if (authStore.role.id < targetRole) {
      return true
    } else {
      if (targetRole == 1 && authStore.role.id == targetRole) {
        if (router.params.id == authStore.user.id) {
          return true
        } else {
          if (suRestriction) {
            return false
          } else {
            return true
          }
        }
      }
      return false
    }
  } else {
    const checker = arr.filter((e: { module: any }) => e.module == requiredPermission)

    if (checker.length > 0) {
      if (requiredPermission == checker[0].module) {
        if (mode == 'create') {
          return checker[0].create == 1
        }
        if (mode == 'read') {
          return checker[0].read == 1
        }
        if (mode == 'update') {
          return checker[0].update == 1
        }
      }
    }
    return false
  }
}

export default checkRole
