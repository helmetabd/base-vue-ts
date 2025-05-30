<script setup lang="ts">
import { ref } from 'vue'

const storageRole = localStorage.getItem('role')

const role = ref(storageRole ? JSON.parse(storageRole) : {})

function checkRole() {
    let arr = [{ name: 'super_admin' }, { name: 'admin' }]
    let checker = arr.filter((e) => e.name == role.value.name)
    return checker.length > 0 ? true : false
}
</script>

<template>
    <slot v-if="checkRole()" />
</template>
