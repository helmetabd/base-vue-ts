<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps(['userId'])
const storageRole = localStorage.getItem('role')
const storageUser = localStorage.getItem('user')
const role = ref(storageRole ? JSON.parse(storageRole) : {})
function checkRole() {
  let arr = [{ name: 'super_admin' }, { name: 'admin' }]
  let checker = arr.filter((e) => e.name == role.value.name)
  return checker.length > 0 ? false : true
}
function checkAuth() {
  if (storageUser) {
    let user = JSON.parse(storageUser)
    return user.pandawa_user_id == props.userId ? true : false
  } else {
    return false
  }
}
</script>

<template>
  <slot v-if="checkAuth() && checkRole()" />
</template>
