<script setup lang="ts">
import animationData from '@/components/widgets/rhvddzym.json'
import apiClient from '@/service/ApiClientService'
import BasicInput from '@/components/inputs/BasicInput.vue'
import Swal from 'sweetalert2'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const token = ref(route.query.token as string | undefined)
const email = ref(route.query.email as string | undefined)
const password = ref('')
const password_confirmation = ref('')
const processing = ref(false)
const defaultOptions = { animationData }

const resetPassword = async () => {
  processing.value = true
  const resetData = {
    token: token.value,
    email: email.value,
    password: password.value,
    password_confirmation: password_confirmation.value
  }
  try {
    await apiClient.post('/reset-password', resetData)
    const res = await Swal.fire({
      title: 'Password Has Been Reset!',
      text: 'You may allow to loggin with new credentail',
      icon: 'success',
      allowEscapeKey: false,
      allowOutsideClick: false
    })
    if (res.isConfirmed) router.push({ name: 'auth.login' })
  } catch (e: any) {
    if (e.response) Swal.fire('Error', e.response?.data?.message, 'error')
  } finally {
    processing.value = false
  }
}
</script>

<template>
  <div class="auth-page-wrapper pt-5">
    <div class="auth-one-bg-position auth-one-bg" id="auth-particles">
      <div class="bg-overlay"></div>
      <div class="shape">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 1440 120"
        >
          <path
            d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z"
          ></path>
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
                  <img src="@/assets/images/logo-light.png" alt="" height="60" />
                </router-link>
              </div>
              <p class="mt-3 fs-15 fw-medium">Reset Password</p>
            </div>
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <BCard no-body class="mt-4">
              <BCardBody class="p-4">
                <div class="text-center mt-2">
                  <h5 class="text-primary">You can reset your password now</h5>
                  <p class="text-muted">Fill this form to create new password!</p>
                </div>
                <div class="p-2">
                  <form @submit.prevent="resetPassword">
                    <BasicInput
                      name="email"
                      type="email"
                      label="Email"
                      v-model="email"
                      placeholder="Email"
                      disabled
                    />
                    <BasicInput
                      name="password"
                      type="password"
                      label="Password"
                      v-model="password"
                      placeholder="Enter New Password"
                      required
                    />
                    <BasicInput
                      name="password_confirmation"
                      type="password"
                      label="Password Confirmation"
                      v-model="password_confirmation"
                      placeholder="Re-type your password"
                      required
                    />

                    <div class="text-center mt-4">
                      <button type="submit" class="w-100 btn btn-success" :disabled="processing">
                        {{ processing ? 'Please wait' : 'Set New Password!' }}
                      </button>
                    </div>
                  </form>
                </div>
              </BCardBody>
            </BCard>

            <div class="mt-4 text-center">
              <p class="mb-0">
                Wait, I remember my password...
                <router-link
                  :to="{ name: 'auth.login' }"
                  class="fw-semibold text-primary text-decoration-underline"
                >
                  Click here
                </router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
