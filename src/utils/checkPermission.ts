import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()

function checkPermission(requiredPermission: any, mode: string) {
  const arr = authStore.permissions

  const checker = arr.filter((e: { module: any }) => e.module == requiredPermission)

  if (authStore.role.id == 1 || authStore.role.id == 2) {
    return true
  }

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

export default checkPermission
