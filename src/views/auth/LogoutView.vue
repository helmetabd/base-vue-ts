<script setup>
import animationData from '@/components/widgets/hzomhqxz.json'
import Lottie from '@/components/widgets/lottie.vue'
import BaseCard from '@/components/cards/base-card.vue'
import { useAuthStore } from '../../stores/auth'
import { onMounted, reactive } from 'vue'
const data = reactive({
  defaultOptions: {
    animationData: animationData
  }
})
const authStore = useAuthStore()
const { loggingOut } = authStore
onMounted(() => {
  loggingOut()
})
</script>

<template>
  <div class="auth-page-wrapper pt-5">
    <div class="auth-one-bg-position auth-one-bg" id="auth-particles">
      <div class="bg-overlay"></div>
      <div class="shape">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 1440 120">
          <path d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z"></path>
        </svg>
      </div>
    </div>
    <div class="auth-page-content">
      <div class="container-sm">
        <div class="row justify-content-center">
          <div class="col col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <div class="text-center mt-sm-5 mb-4 text-white-50">
              <div>
                <router-link :to="{ name: 'auth.login' }" class="d-inline-block auth-logo">
                  <img src="@/assets/images/logo-light.png" alt="" height="20" />
                </router-link>
              </div>
              <p class="mt-3 fs-15 fw-medium">Team Login</p>
            </div>
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <BaseCard noHeader noFooter wrapperClass="mt-4" bodyClass="p-4 text-center">
              <template #cardBody>
                <lottie colors="primary:#4b38b3,secondary:#08a88a" :options="data.defaultOptions" :height="180"
                  :width="180" />
                <div class="mt-4 pt-2">
                  <h5>Logging You Out, please wait...</h5>
                </div>
              </template>
            </BaseCard>
          </div>
        </div>
      </div>
    </div>

    <footer class="footer">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <div class="text-center"><i class="ri-copyright-line"></i> Yushitira Gawebecik 2024</div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
