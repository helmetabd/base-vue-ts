<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { register } from '@/service/authService'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

// Types
interface RegisterForm {
  email: string
  username: string
  firstName: string
  lastName: string
  phone: string
  password: string
  confirmPassword: string
}

interface RegisterPayload {
  email: string
  username: string
  firstName: string
  lastName: string
  phone: string
  password: string
}

// Router
const router = useRouter()

// Reactive state
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const showPasswordHints = ref(false)
const isSubmitting = ref(false)
const particleConfig = ref({
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 1000
      }
    },
    color: {
      value: '#ffffff'
    },
    shape: {
      type: 'circle',
      stroke: {
        width: 0,
        color: '#000000'
      },
      polygon: {
        nb_sides: 5
      },
      image: {
        src: 'img/github.svg',
        width: 100,
        height: 100
      }
    },
    opacity: {
      value: 0.5,
      random: false,
      anim: {
        enable: false,
        speed: 1,
        opacity_min: 0.1,
        sync: false
      }
    },
    size: {
      value: 4,
      random: true,
      anim: {
        enable: false,
        speed: 40,
        size_min: 0.1,
        sync: false
      }
    },
    line_linked: {
      enable: true,
      distance: 130,
      color: '#ffffff',
      opacity: 0.4,
      width: 1
    },
    move: {
      enable: true,
      speed: 3,
      direction: 'top',
      random: true,
      straight: false,
      out_mode: 'out',
      bounce: false,
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200
      }
    }
  },
  interactivity: {
    detect_on: 'window',
    events: {
      onhover: {
        enable: true,
        mode: 'grab'
      },
      onclick: {
        enable: false,
        mode: 'push'
      },
      resize: true
    },
    modes: {
      grab: {
        distance: 400,
        line_linked: {
          opacity: 1
        }
      }
    }
  },
  retina_detect: true
})

// Validation schema
const validationSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  phone: yup.string()
    .required('Phone number is required')
    .test('indonesian-phone', 'Please enter a valid Indonesian phone number (e.g., 08123456789, 628123456789, or +628123456789)',
      function (value) {
        if (!value) return false;
        return /^(?:\+62|62|0)8[1-9][0-9]{7,10}$/.test(value);
      }
    ),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: yup
    .string()
    .required('Password confirmation is required')
    .oneOf([yup.ref('password')], 'Passwords must match')
})

// Form handling with vee-validate
const { handleSubmit, defineField, errors, values } = useForm<RegisterForm>({
  validationSchema
})

// Define form fields
const [email, emailAttrs] = defineField('email')
const [username, usernameAttrs] = defineField('username')
const [firstName, firstNameAttrs] = defineField('firstName')
const [lastName, lastNameAttrs] = defineField('lastName')
const [phone, phoneAttrs] = defineField('phone')
const [password, passwordAttrs] = defineField('password')
const [confirmPassword, confirmPasswordAttrs] = defineField('confirmPassword')

// Password validation helpers
const passwordValidation = computed(() => {
  const pwd = password.value || ''
  return {
    hasLowercase: /[a-z]/.test(pwd),
    hasUppercase: /[A-Z]/.test(pwd),
    hasNumber: /[0-9]/.test(pwd),
    hasMinLength: pwd.length >= 8
  }
})

// Toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

// Handle form submission
const onSubmit = handleSubmit(async (formData: RegisterForm) => {
  isSubmitting.value = true

  try {
    // Create payload without password confirmation
    const payload: RegisterPayload = {
      email: formData.email,
      username: formData.username,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      password: formData.password
    }

    // Use the auth service for registration
    const response = await register(payload)

    // Handle successful registration
    console.log('Registration successful:', response)

    // Show success message using SweetAlert2
    await Swal.fire({
      title: 'Registration Successful!',
      text: 'Your account has been created successfully. You can now sign in.',
      icon: 'success',
      confirmButtonText: 'Go to Sign In'
    })

    // Redirect to login page
    router.push({ name: 'auth.login' })

  } catch (error: any) {
    console.error('Registration failed:', error)

    // Handle registration errors with SweetAlert2
    let errorMessage = 'Registration failed. Please try again.'

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.response?.data?.errors) {
      // Handle validation errors from backend
      const errors = error.response.data.errors
      errorMessage = Object.values(errors).flat().join('\n')
    }

    await Swal.fire({
      title: 'Registration Failed',
      text: errorMessage,
      icon: 'error',
      confirmButtonText: 'Try Again'
    })
  } finally {
    isSubmitting.value = false
  }
})

// Handle password field focus/blur
const onPasswordFocus = () => {
  showPasswordHints.value = true
}

const onPasswordBlur = () => {
  showPasswordHints.value = false
}

// Mount lifecycle - setup password toggle functionality
onMounted(() => {
  // This is handled by the togglePasswordVisibility function now
})
</script>

<template>
  <div class="auth-page-wrapper">
    <div class="auth-one-bg-position auth-one-bg" id="auth-particles">
      <vue-particles id="tsparticles" class="bg-overlay" :options="particleConfig" />
      <div class="shape">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 1440 120">
          <path d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z"></path>
        </svg>
      </div>
    </div>

    <div class="auth-page-content">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="text-center mt-sm-5 mb-4 text-white-50">
              <div>
                <router-link to="/" class="d-inline-block auth-logo">
                  <img src="@/assets/images/logo-light.png" alt="" height="60">
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col-md-8 col-lg-6 col-xl-5">
            <div class="card mt-4">
              <div class="card-body p-4">
                <div class="text-center mt-2">
                  <h5 class="text-primary">Create New Account</h5>
                </div>
                <div class="p-2 mt-4">
                  <form @submit.prevent="onSubmit" class="needs-validation" novalidate>
                    <!-- Email -->
                    <div class="mb-3">
                      <label for="useremail" class="form-label">Email <span class="text-danger">*</span></label>
                      <input type="email" class="form-control" :class="{ 'is-invalid': errors.email }" id="useremail"
                        placeholder="Enter email address" v-model="email" v-bind="emailAttrs">
                      <div v-if="errors.email" class="invalid-feedback">
                        {{ errors.email }}
                      </div>
                    </div>

                    <!-- Username -->
                    <div class="mb-3">
                      <label for="username" class="form-label">Username <span class="text-danger">*</span></label>
                      <input type="text" class="form-control" :class="{ 'is-invalid': errors.username }" id="username"
                        placeholder="Enter username" v-model="username" v-bind="usernameAttrs">
                      <div v-if="errors.username" class="invalid-feedback">
                        {{ errors.username }}
                      </div>
                    </div>

                    <!-- First Name and Last Name Row -->
                    <div class="row">
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label for="firstName" class="form-label">First Name <span
                              class="text-danger">*</span></label>
                          <input type="text" class="form-control" :class="{ 'is-invalid': errors.firstName }"
                            id="firstName" placeholder="Enter first name" v-model="firstName" v-bind="firstNameAttrs">
                          <div v-if="errors.firstName" class="invalid-feedback">
                            {{ errors.firstName }}
                          </div>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label for="lastName" class="form-label">Last Name <span class="text-danger">*</span></label>
                          <input type="text" class="form-control" :class="{ 'is-invalid': errors.lastName }"
                            id="lastName" placeholder="Enter last name" v-model="lastName" v-bind="lastNameAttrs">
                          <div v-if="errors.lastName" class="invalid-feedback">
                            {{ errors.lastName }}
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Phone -->
                    <div class="mb-3">
                      <label for="phone" class="form-label">Phone Number <span class="text-danger">*</span></label>
                      <input type="tel" class="form-control" :class="{ 'is-invalid': errors.phone }" id="phone"
                        placeholder="Enter phone number" v-model="phone" v-bind="phoneAttrs">
                      <div v-if="errors.phone" class="invalid-feedback">
                        {{ errors.phone }}
                      </div>
                    </div>

                    <!-- Password -->
                    <div class="mb-3">
                      <label class="form-label" for="password-input">Password <span class="text-danger">*</span></label>
                      <div class="position-relative auth-pass-inputgroup">
                        <input :type="showPassword ? 'text' : 'password'" class="form-control pe-5 password-input"
                          :class="{ 'is-invalid': errors.password }" @paste.prevent placeholder="Enter password"
                          id="password-input" aria-describedby="passwordInput" v-model="password" v-bind="passwordAttrs"
                          @focus="onPasswordFocus" @blur="onPasswordBlur">
                        <button
                          class="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                          type="button" @click="togglePasswordVisibility">
                          <i :class="showPassword ? 'ri-eye-off-fill' : 'ri-eye-fill'" class="align-middle"></i>
                        </button>
                        <div v-if="errors.password" class="invalid-feedback">
                          {{ errors.password }}
                        </div>
                      </div>
                    </div>

                    <!-- Password Confirmation -->
                    <div class="mb-3">
                      <label class="form-label" for="confirm-password-input">Confirm Password <span
                          class="text-danger">*</span></label>
                      <div class="position-relative auth-pass-inputgroup">
                        <input :type="showConfirmPassword ? 'text' : 'password'"
                          class="form-control pe-5 password-input" :class="{ 'is-invalid': errors.confirmPassword }"
                          @paste.prevent placeholder="Confirm your password" id="confirm-password-input"
                          v-model="confirmPassword" v-bind="confirmPasswordAttrs">
                        <button
                          class="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                          type="button" @click="toggleConfirmPasswordVisibility">
                          <i :class="showConfirmPassword ? 'ri-eye-off-fill' : 'ri-eye-fill'" class="align-middle"></i>
                        </button>
                        <div v-if="errors.confirmPassword" class="invalid-feedback">
                          {{ errors.confirmPassword }}
                        </div>
                      </div>
                    </div>

                    <!-- Password Requirements -->
                    <div v-show="showPasswordHints || password" id="password-contain" class="p-3 bg-light mb-2 rounded">
                      <h5 class="fs-13 fw-semibold">Password must contain:</h5>
                      <p :class="passwordValidation.hasMinLength ? 'valid' : 'invalid'" class="fs-12 mb-2">
                        Minimum <b>8 characters</b>
                      </p>
                      <p :class="passwordValidation.hasLowercase ? 'valid' : 'invalid'" class="fs-12 mb-2">
                        At least one <b>lowercase</b> letter (a-z)
                      </p>
                      <p :class="passwordValidation.hasUppercase ? 'valid' : 'invalid'" class="fs-12 mb-2">
                        At least one <b>uppercase</b> letter (A-Z)
                      </p>
                      <p :class="passwordValidation.hasNumber ? 'valid' : 'invalid'" class="fs-12 mb-0">
                        At least one <b>number</b> (0-9)
                      </p>
                    </div>

                    <!-- Terms and Conditions -->
                    <div class="mb-4">
                      <p class="mb-0 fs-12 text-muted fst-italic">By registering you agree to the
                        Velzon <a href="#" class="text-primary text-decoration-underline fst-normal fw-medium">
                          Terms of Use</a>
                      </p>
                    </div>

                    <!-- Submit Button -->
                    <div class="mt-4">
                      <button class="btn btn-success w-100" type="submit" :disabled="isSubmitting">
                        <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status"
                          aria-hidden="true"></span>
                        {{ isSubmitting ? 'Signing Up...' : 'Sign Up' }}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div class="mt-4 text-center">
              <p class="mb-0">Already have an account ? <router-link :to="{ name: 'auth.login' }"
                  class="fw-semibold text-primary text-decoration-underline"> Signin </router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="footer">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="text-center">
              <p class="mb-0 text-muted">&copy; {{ new Date().getFullYear() }} Siwa Manager. by IT GBNA</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.valid {
  color: #28a745 !important;
}

.valid::before {
  content: "✓ ";
  font-weight: bold;
}

.invalid {
  color: #dc3545 !important;
}

.invalid::before {
  content: "✗ ";
  font-weight: bold;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}
</style>