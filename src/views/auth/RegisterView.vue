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
      <div class="container">
        <div class="row">
          <div class="col" lg="12">
            <div class="text-center mt-sm-5 mb-4 text-white-50">
              <div>
                <router-link :to="{ name: 'auth.login' }" class="d-inline-block auth-logo">
                  <img src="@/assets/images/logo-light.png" alt="" height="20" />
                </router-link>
              </div>
              <p class="mt-3 fs-15 fw-medium">Reset Password</p>
            </div>
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col" md="8" lg="6" xl="5">
            <BCard no-body class="mt-4">
              <BCardBody class="p-5">
                <div class="text-center mt-2">
                  <h4 id="divQuote" class="text-center text-dark mb-0">
                    "Alone we can do so little, together we can do so much."
                  </h4>
                  <div class="text-center">
                    <em id="divQuoter">- Helen Keller -</em>
                  </div>
                </div>
                <div class="p-2 mt-4">
                  <div v-if="error" class="alert alert-danger mt-3 alert-dismissible" role="alert">
                    {{ error }}
                  </div>

                  <div></div>

                  <form @submit.prevent="handleSubmit">
                    <div class="mb-3">
                      <label for="email" class="form-label">
                        <i class="ri-mail-line align-bottom me-1"></i>
                        Email</label
                      >
                      <input
                        type="email"
                        class="form-control"
                        id="email"
                        placeholder="Enter email"
                        v-model="email"
                      />
                      <div class="invalid-feedback">
                        <span></span>
                      </div>
                    </div>

                    <div class="mb-3">
                      <label class="form-label" for="password-input"
                        ><i class="ri-key-line align-bottom me-1"></i> Password</label
                      >
                      <div class="position-relative auth-pass-inputgroup mb-3">
                        <input
                          type="password"
                          v-model="password"
                          class="form-control pe-5"
                          placeholder="Enter password"
                          id="password-input"
                        />
                        <div class="invalid-feedback">
                          <span></span>
                        </div>
                      </div>
                    </div>

                    <div class="mb-3">
                      <label class="form-label" for="password-input"
                        ><i class="ri-lock-line align-bottom me-1"></i> Password Confirmation</label
                      >
                      <div class="position-relative auth-pass-inputgroup mb-3">
                        <input
                          type="password"
                          v-model="password_confirmation"
                          class="form-control pe-5"
                          placeholder="Enter password confirmation"
                          id="password-input"
                        />
                        <div class="invalid-feedback">
                          <span></span>
                        </div>
                      </div>
                    </div>

                    <div class="mt-4">
                      <button class="btn btn-success w-100" type="submit" id="login-button">
                        Reset
                      </button>

                      <!-- <BButton
                          variant="success"
                          class="w-100"
                          type="submit"
                        >
                        Log in
                        </BButton> -->
                    </div>
                  </form>
                </div>
              </BCardBody>
            </BCard>

            <div class="mt-4 text-center">
              <p class="mb-0"><i class="ri-copyright-line"></i> Arjuna Gawebecik 2023</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      token: '',
      email: '',
      password: '',
      password_confirmation: ''
    }
  },
  methods: {
    changePassword() {
      const token = this.$route.query.token

      if (!token) {
        console.error('Token tidak ditemukan.')
        return
      }

      const requestData = {
        token: token,
        email: this.email,
        password: this.password,
        password_confirmation: this.password_confirmation,
        token: token
      }

      axios
        .post('/reset-password', requestData)
        .then((response) => {
          const responseData = response.data
          if (responseData.data.token) {
            localStorage.setItem('token', responseData.data.token)
          }
          this.token = requestData.token
          this.email = ''
          this.password = ''
          this.password_confirmation = ''

          Swal.fire({
            title: 'Success',
            text: 'The password has been reset successfully.',
            icon: 'success'
          })
        })
        .catch((error) => {
          console.error('Error changing password:', error)

          Swal.fire({
            title: 'Error',
            text: 'Password gagal direset',
            icon: 'error'
          })
        })
    }
  }
}
</script>
