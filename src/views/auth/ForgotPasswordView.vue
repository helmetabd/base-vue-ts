<script>
import Lottie from '@/components/widgets/lottie.vue'
import animationData from '@/components/widgets/rhvddzym.json'
import apiClient from '../../service/ApiClientService'
import Swal from 'sweetalert2'
export default {
  components: { lottie: Lottie },
  data() {
    return {
      email: '',
      submitted: false,
      error: null,
      tryingToReset: false,
      isResetError: false,
      processing: false,
      defaultOptions: { animationData: animationData }
    }
  },
  methods: {
    async handleResetLink() {
      this.processing = true
      apiClient
        .post('/forgot-password', { email: this.email })
        .then(() => {
          Swal.fire({
            text: 'Berhasil Mengirim Link Reset Password, Sialahkan Periksa Email Anda!',
            icon: 'info'
          })
        })
        .catch((e) => {
          if (e.response) {
            Swal.fire('Error', e.response?.data?.message, 'error')
          }
        })
        .finally(() => (this.processing = false))
    }
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
              <p class="mt-3 fs-15 fw-medium">Forgot Password</p>
            </div>
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <BCard no-body class="mt-4">
              <BCardBody class="p-4">
                <div class="text-center mt-2">
                  <h5 class="text-primary">Forgot Password?</h5>
                  <p class="text-muted">Fill this form to receiver reset link</p>

                  <lottie
                    class="avatar-xl"
                    colors="primary:#0ab39c,secondary:#405189"
                    :options="defaultOptions"
                    :height="120"
                    :width="120"
                  />
                </div>

                <div class="p-2">
                  <BAlert v-model="isResetError" class="mb-4" variant="danger" dismissible>{{
                    error
                  }}</BAlert>
                  <form @submit.prevent="handleResetLink">
                    <div class="mb-4">
                      <label class="form-label">
                        <i class="ri-mail-line align-bottom me-1"></i>
                        Email</label
                      >
                      <input
                        type="email"
                        v-model="email"
                        class="form-control"
                        id="email"
                        placeholder="Enter Email"
                        required
                      />
                    </div>

                    <div class="text-center mt-4">
                      <button type="submit" class="w-100 btn btn-success" :disabled="processing">
                        {{ processing ? 'Please wait' : 'Send Reset Link' }}
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
