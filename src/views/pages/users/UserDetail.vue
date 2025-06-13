<script setup lang="ts">
import Layout from '@/layouts/MainLayout.vue'
import * as yup from "yup"
import Multiselect from '@vueform/multiselect';
import '@vueform/multiselect/themes/default.css'
import ModalBasic from '@/components/modals/ModalBasic.vue'
import BasicInput from '@/components/inputs/BasicInput.vue'
import Swal from 'sweetalert2'
import { onMounted, reactive } from 'vue'
import { userService } from '@/service'
import { useRoute, useRouter } from 'vue-router'
import checkRole from '../../../utils/adminActionButton'
import { getAvatar } from '../../../utils/assetsHelper'
import BaseCard from '@/components/cards/base-card.vue'
import { responseHelper } from '@/utils/responseHelper'
import type { User } from '@/interfaces/User'
import type { FormField, Option } from '@/interfaces/Utils'
import { useForm } from 'vee-validate';
import checkOwner from '@/utils/ownerActionButton';

const router = useRoute()
const route = useRouter()

const schema = yup.object().shape({
  firstname: yup.string().required('First name is required'),
  lastname: yup.string().required('Last name is required'),
  username: yup.string().required('Username is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string()
    .required('Phone number is required')
    .test('indonesian-phone', 'Please enter a valid Indonesian phone number (e.g., 08123456789, 628123456789, or +628123456789)',
      function (value) {
        if (!value) return false;
        return /^(?:\+62|62|0)8[1-9][0-9]{7,10}$/.test(value);
      }
    ),
  role: yup.string().required('Role is required'),
  isActive: yup.boolean().required('Status is required')
})

const { handleSubmit, resetForm, meta, defineField, errors, setValues } = useForm({
  validationSchema: schema,
  initialValues: {} as FormField
});

const state = reactive({
  user: {} as User,
  userId: router.params.id,
  userProfileFormField: {
    firstname: defineField('firstname'),
    lastname: defineField('lastname'),
    username: defineField('username'),
    email: defineField('email'),
    phone: defineField('phone'),
    role: defineField('role'),
    isActive: defineField('isActive')
  },
  profileModal: false,
  inputProfile: [
    {
      label: 'Username',
      name: 'username',
      inputType: 'text',
      required: true
    },
    {
      label: 'Email',
      name: 'email',
      inputType: 'email',
      required: true
    },
    {
      label: 'Phone',
      name: 'phone',
      inputType: 'tel', // Changed from 'phone' to 'tel' for better HTML semantics
      required: true,
      placeholder: 'e.g., 08123456789 or +628123456789'
    },
  ],
  checked: false,
  editParams: {
    status: [
      { value: true, label: 'Active' },
      { value: false, label: 'Suspended' }
    ] as Option[],
    role: [
      { value: 'STAKEHOLDER', label: 'Stake Holder' },
      { value: 'USER', label: 'User' }
    ] as Option[]
  }
})

const fetchstate = async () => {
  try {
    state.user = await userService.detail(String(state.userId))
  } catch (error: any) {
    responseHelper('error', error)
  }
}

// Function to format phone number to +62 format
function formatPhoneToInternational(phone: string): string {
  if (!phone) return phone;

  // Remove all non-digit characters first
  const cleanPhone = phone.replace(/\D/g, '');

  // Handle different formats
  if (cleanPhone.startsWith('628')) {
    // Already in 628 format, just add +
    return '+' + cleanPhone;
  } else if (cleanPhone.startsWith('62')) {
    // 62 format, just add +
    return '+' + cleanPhone;
  } else if (cleanPhone.startsWith('08')) {
    // 08 format, replace 0 with +62
    return '+62' + cleanPhone.substring(1);
  } else if (cleanPhone.startsWith('8')) {
    // 8 format, add +62
    return '+62' + cleanPhone;
  }

  return phone; // Return original if no pattern matches
}

const onSubmit = handleSubmit((values) => {
  let form = values
  if (values.phone) {
    form.phone = formatPhoneToInternational(String(values.phone));
  }
  userService
    .update(String(state.userId), form, () => {
      resetForm()
      fetchstate()
      state.checked = false
      state.profileModal = !state.profileModal
    }, {
      allowOutsideClick: false,
      allowEscapeKey: false
    })
})

function toggleProfileModal() {
  setValues({
    firstname: state.user.firstname,
    lastname: state.user.lastname,
    username: state.user.username,
    email: state.user.email,
    phone: state.user.phone,
    role: state.user.role,
    isActive: state.user.isActive
  })
  state.checked = false
  state.profileModal = !state.profileModal
}

function deleteUser() {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      userService.destroy(String(state.userId), () => {
        route.push({ name: 'user.index' })
      })
    }
  })
}

const avatar = (avatar: string | null) => getAvatar(avatar)

onMounted(() => {
  fetchstate()
})
</script>

<template>
  <Layout>
    <div class="profile-foreground position-relative mx-n4 mt-n4">
      <div class="profile-wid-bg">
        <img src="./../../../assets/images/login_bg_result.webp" class="profile-wid-img" />
      </div>
    </div>
    <div class="pt-4 mb-4 mb-lg-3 pb-lg-4">
      <div class="row g-4">
        <div class="col-auto">
          <div class="avatar-lg">
            <img :src="avatar(state.user.avatar)" class="img-thumbnail rounded-circle" />
          </div>
        </div>
        <!--end col-->
        <div class="col">
          <div class="p-2">
            <h3 class="text-white mb-1">{{ state.user.fullname }}</h3>
            <div class="hstack text-white-50 gap-1">{{ state.user.firstname }}</div>
          </div>
        </div>
        <!--end col-->
      </div>
      <!--end row-->
    </div>
    <div class="row">
      <BaseCard title="User" tableCard noFooter>
        <template #titleIcon>
          <i class="las la-user"></i>
        </template>
        <template #cardButton>
          <div class="btn-group"
            v-if="checkRole('user.users', 'update', true, state.user?.role) || checkOwner(String(state.userId))">
            <button type="button" class="btn btn-sm btn-primary m-1" @click="toggleProfileModal">
              <i class="ri-user-settings-line align-bottom me-1"></i>
              Edit Profile
            </button>
            <button v-if="checkRole('user.users', 'update', true, state.user?.role)" type="button"
              class="btn btn-sm btn-danger m-1" @click="deleteUser">
              <i class="ri-delete-bin-5-line align-bottom me-1"></i>
              Delete User
            </button>

            <!-- <router-link :to="{ name: 'user.privileges', params: { id: state.userId } }"
              class="btn btn-sm btn-success m-1">
              <i class="ri-shield-user-line align-bottom me-1"></i>
              Edit Privileges
            </router-link> -->
          </div>
        </template>
        <template #cardBody>
          <div class="row">
            <div class="col-md-4">
              <span class="text-muted text-uppercase fs-11">Name</span>
              <div class="fs-12 fw-semibold border-bottom pb-2 mb-3 text-uppercase">
                <i class="las la-braille me-1 text-info"></i>
                <strong>{{ state.user?.fullname }}</strong>
              </div>
            </div>
            <!--End Col-->

            <div class="col-md-4">
              <span class="text-muted text-uppercase fs-11">User Role</span>
              <div class="fs-12 border-bottom pb-2 mb-3 text-uppercase">
                <i class="las la-braille me-1 text-info"></i>
                {{ state.user?.role }}
              </div>
            </div>
            <!--End Col-->

            <div class="col-md-4">
              <span class="text-muted text-uppercase fs-11">Status</span>
              <div class="border-bottom pb-2 mb-3 text-uppercase">
                <i class="las la-braille me-1 text-info"></i>
                <span v-if="state.user?.isActive == true"
                  class="bg-success-subtle text-success rounded p-1 fs-10">Active</span>
                <span v-else-if="state.user?.isActive == false"
                  class="bg-danger-subtle text-danger rounded p-1 fs-10">Suspended</span>
                <span v-else class="bg-success-subtle text-success rounded p-1 fs-10">Suspended</span>
              </div>
            </div>
            <!--End Col-->
          </div>

          <div class="row">
            <!--End Col -->
            <div class="col-md-4">
              <span class="text-muted text-uppercase fs-11">Email</span>
              <div class="fs-12 border-bottom pb-2 mb-3 text-uppercase">
                <i class="las la-braille me-1 text-info"></i>
                {{ state.user?.email }}
              </div>
            </div>
            <!--End Col -->
            <div class="col-md-4">
              <span class="text-muted text-uppercase fs-11">Phone</span>
              <div class="fs-12 border-bottom pb-2 mb-3 text-uppercase">
                <i class="las la-braille me-1 text-info"></i>
                {{ state.user?.phone }}
              </div>
            </div>
            <!--End Col-->
            <div class="col-md-4">
              <span class="text-muted text-uppercase fs-11">Updated At</span>
              <div class="fs-12 border-bottom pb-2 mb-3 text-uppercase">
                <i class="las la-braille me-1 text-info"></i>
                {{ state.user?.updatedAt }}
              </div>
            </div>
            <!--End Col-->
          </div>
        </template>
        <template #customFooter>
          <div class="card-footer bg-light pt-2 pb-2">
            <div class="row">
              <div class="col-8">
                <nav aria-label="breadcrumb mb-0">
                  <ol class="breadcrumb text-uppercase mb-0 pt-1">
                    <li class="breadcrumb-item">
                      <i class="las la-map-marker me-1 text-muted"></i>
                      <router-link :to="{ name: 'user.index' }" class="text-info">
                        <strong>Users</strong>
                      </router-link>
                    </li>
                    <li class="breadcrumb-item active hide-xs" aria-current="page">
                      {{ state.user?.fullname }}
                    </li>
                  </ol>
                </nav>
              </div>
              <div class="col-4 text-end">&nbsp;</div>
            </div>
          </div>
        </template>
      </BaseCard>
    </div>
    <ModalBasic title="Update Profile" :modelValue="state.profileModal" @toggle="state.profileModal = $event">
      <template #modalBody>
        <form id="update_profile_form" @submit.prevent="onSubmit" class="needs-validation" novalidate>
          <div class="row g-3">
            <div class="col-md-6">
              <div class="mb-3">
                <label for="firstName" class="form-label">First Name <span class="text-danger">*</span></label>
                <input type="text" class="form-control" :class="{ 'is-invalid': errors.firstName }" id="firstName"
                  placeholder="Enter first name" v-model="state.userProfileFormField.firstname[0].value">
                <div v-if="errors.firstName" class="invalid-feedback">
                  {{ errors.firstName }}
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label for="lastName" class="form-label">Last Name <span class="text-danger">*</span></label>
                <input type="text" class="form-control" :class="{ 'is-invalid': errors.lastName }" id="lastName"
                  placeholder="Enter last name" v-model="state.userProfileFormField.lastname[0].value">
                <div v-if="errors.lastName" class="invalid-feedback">
                  {{ errors.lastName }}
                </div>
              </div>
            </div>
            <div v-for="input in state.inputProfile" :key="input.name" class="col-md-12">
              <BasicInput :label="input.label" :type="input.inputType" :name="input.name" :placeholder="input.label"
                v-model="(state.userProfileFormField as any)[input.name][0].value"
                :required="input.required ? true : false" />
            </div>
            <div class="col-md-12">
              <label for="role_select">Role</label>
              <MultiSelect id="role_select" placeholder="Select Roles"
                v-model="state.userProfileFormField.role[0].value" :options="state.editParams.role" :required="true" />
            </div>
            <div class="col-md-12">
              <label for="auth_select">Status</label>
              <Multiselect id="auth_select" v-model="state.userProfileFormField.isActive[0].value"
                placeholder="User Status" :options="state.editParams.status" />
            </div>
          </div>
        </form>
      </template>
      <template #modalFooter>
        <div class="col">
          <div class="row">
            <div class="col col-lg-5 mt-4">
              <input v-model="state.checked" type="checkbox" id="checkboxEditProfile" style="margin-right: 4px" />
              <label for="checkboxEditProfile">Confirm</label>
            </div>
            <div class="col col-lg-7 hstack justify-content-end">
              <button style="margin-right: 1em" type="button" class="btn btn-light" @click="state.profileModal = false">
                Close
              </button>
              <button form="update_profile_form" type="submit" variant="primary" class="btn btn-primary"
                :class="!state.checked ? 'disabled' : ''">
                Update
              </button>
            </div>
          </div>
        </div>
      </template>
    </ModalBasic>
  </Layout>
</template>
