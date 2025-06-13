<script setup lang="ts">
import 'swiper/css'
import 'swiper/css/autoplay'
import 'swiper/css/mousewheel'
import { onMounted, reactive } from 'vue'
import { getAvatar } from '@/utils/assetsHelper'
import 'simplebar-vue/dist/simplebar.min.css'
import { useAuthStore } from '@/stores/auth'
import SmallCard from '@/components/cards/small-card.vue'
import checkPermission from '@/utils/checkPermission'
import menu from '@/config/menu'

const authStore = useAuthStore()
const avatar = (avatar: string | null | undefined) => getAvatar(avatar)
const state = reactive({
    menus: menu()
})
onMounted(() => {
})
</script>

<template>
    <div class="mb-2 mb-lg-2 pb-lg-1">
        <div class="row">
            <div class="col-md-4">
                <div class="row">
                    <div class="col-auto">
                        <div class="avatar-lg">
                            <img :src="avatar(authStore.user.avatar)" class="img-thumbnail rounded-circle" />
                        </div>
                    </div>
                    <div class="col">
                        <div class="p-2 pt-4 ps-0">
                            <h3 class="mb-1">{{ authStore.user.name }}</h3>
                            <span class="text-uppercase badge"
                                :class="authStore.role.name == 'super_admin' ? 'bg-danger' : 'bg-primary'">{{
                                    authStore.role.display_name }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-8 pt-2">&nbsp;</div>
        </div>
    </div>
    <div class="row">
        <div class="col-lg-12">
            <div class="card">
                <div class="card-body table-responsive">
                    <div>Welcome to <strong>Base VUE TS</strong> by helmetabd.</div>
                </div>
            </div>
        </div>
    </div>
    <div class="row mb-3">
        <div class="col-lg-3 col-md-6 max-xs" v-for="(item, index) in state.menus">
            <template v-if="item.icon">
                <SmallCard customIcon :routeName="item.name != 'settings' ? item.name + '.index' : item.name"
                    v-if="checkPermission(item.module, 'read')">
                    <template #customCardIcon>
                        <span class="avatar-title bg-info text-white rounded-circle fs-3">
                            <i :class="item.icon"></i>
                        </span>
                    </template>
                    <template #cardBody>
                        <h4 class="nowrap mb-0">{{ item.display_name }}</h4>
                        <div class="text-muted fs-11 mt-1">
                            <i class="las la-braille text-muted"></i> Module: {{ item.module }}
                        </div>
                    </template>
                </SmallCard>
            </template>
        </div>
    </div>
</template>

<style>
.text-white-75 {
    color: rgba(255, 255, 255, 0.75);
}
</style>
