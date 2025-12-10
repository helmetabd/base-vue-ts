<script setup lang="ts">
import Layout from '@/layouts/MainLayout.vue'
import 'moment'
import ModalBasic from '@/components/modals/ModalBasic.vue'
import BasicInput from '@/components/inputs/BasicInput.vue'
import Swal from 'sweetalert2'
import { onMounted, reactive } from 'vue'
import { userService } from '@/service'
import { useRoute } from 'vue-router'
import { getAvatar } from '../../../utils/assetsHelper'
import BaseCard from '@/components/cards/base-card.vue'
import { responseHelper } from '@/utils/responseHelper'
import type { User } from '@/interfaces/User'
import type { Option, Param } from '@/interfaces/Utils'

// vee-validate + yup
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { formatDate } from '@/utils/calculationHelper'
import { useForm as usePasswordForm, useField as useFieldPassword } from 'vee-validate';
import ImageCropper from '@/components/utils/ImageCropper.vue'
import TrackerCard from '@/components/cards/tracker-card.vue'
import { useAuthStore } from '@/stores/auth'
import DatatableServer from '@/components/datatables/DatatableServer.vue'
import { phoneValidation } from '@/validator/rules'
import checkRole from '@/utils/adminActionButton'
import checkOwner from '@/utils/ownerActionButton'

const router = useRoute()
const authStore = useAuthStore()

const state = reactive({
  user: {} as User,
  userId: router.params.id,
  isImageSelected: false as boolean,
  profileModal: false,
  checked: false,
  checkedReset: false,
  userLogsColumns: [
    { label: 'Activity', name: 'activity', class: 'text-start', customizeRow: true },
    {
      label: 'Time Stamp',
      name: 'created_at',
      class: 'text-center',
      dateConfig: {
        icon: true,
        before: 'YYYY-MM-DD HH:mm:ss',
        after: 'DD MMM YYYY - HH:mm'
      },
      sortable: true
    }
  ],
  editParams: {
    status: [] as Option[],
    role: [] as Option[]
  },
  userLogParams: {
    order_by: 'created_at',
    sort: 'desc',
    perpage: 5
  } as Param,
  cropperModal: false,
  resetPasswordModal: false,
  showPassword: false,
  showConfirmPassword: false,
})

// Validation schema: Name, Email (login), Phone, Nickname (optional), Role, Status
const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Must be a valid email').required('Email is required'),
  phone: yup.string().required('Phone is required').concat(phoneValidation),
  nickname: yup.string().nullable(),
  role: yup.number().required('Role is required'),
  status: yup.number().required('Status is required')
})

const schemaPassword = yup.object().shape({
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number'),
  password_confirmation: yup
    .string()
    .required('Password confirmation is required')
    .oneOf([yup.ref('password')], 'Password must match')
})

interface ProfileForm {
  name: string
  email: string
  phone: string | null
  nickname?: string | null
  role: number | null
  status: number | null
}

const { handleSubmit, setValues, resetForm, errors } = useForm({
  validationSchema: schema,
  initialValues: {} as ProfileForm
})

// expose individual fields to template if needed (optional)
const { value: name } = useField<string>('name')
const { value: email } = useField<string>('email')
const { value: phone } = useField<string | null>('phone')
const { value: nickname } = useField<string | null>('nickname')
const { value: role } = useField<number | null>('role')
const { value: status } = useField<number | null>('status')

// Password reset form
const { handleSubmit: handlePasswordSubmit, resetForm: resetPasswordForm, errors: passwordErrors, setValues: setPasswordValues, isFieldDirty, meta } = usePasswordForm({
  validationSchema: schemaPassword,
  initialValues: { password: '', password_confirmation: '' },
});

// password fields
const { value: password } = useFieldPassword<string>('password');
const { value: password_confirmation } = useFieldPassword<string>('password_confirmation');

const fetchstate = async () => {
  try {
    state.user = await userService.detail(Number(state.userId))
    if (Number(state.userId) === authStore.user?.id) {
      authStore.setUser({
        id: state.user.id,
        avatar: state.user.avatar,
        name: state.user.name,
        nickname: state.user.nickname,
        status: state.user.status,
      })
    }

  } catch (error: any) {
    Swal.fire('error', error.response.message, 'error')
  }
}

const onSubmit = handleSubmit(async (values: ProfileForm) => {
  try {
    const res = await userService.update(Number(state.userId), values)
    fetchstate()
    responseHelper('success', res)
    state.profileModal = false
    resetForm()
  } catch (error: any) {
    Swal.fire('error', error.response?.data?.message || error.message, 'error')
  }
})

async function toggleProfileModal() {
  try {
    const res = await userService.edit(Number(router.params.id))
    const { data: user, params: params } = res
    state.editParams = params as typeof state.editParams
    // populate the form values from fetched user
    const formValues: ProfileForm = {
      name: user.name || state.user.name || '',
      email: user.email || state.user.email || '',
      phone: user.phone || state.user.phone || '',
      nickname: user.nickname ?? state.user.nickname ?? '',
      role: user.role_id ?? state.user?.role?.id ?? null,
      status: user.status ?? state.user?.status ?? null
    }

    // set vee-validate form values
    state.profileModal = !state.profileModal
    setValues(formValues)
  } catch (error: any) {
    responseHelper('error', error)
  }
}

function fixPrivilege() {
  userService
    .fixPrivilege(Number(router.params.id))
    .then((res) => responseHelper('success', res))
    .catch((e) => responseHelper('error', e))
}

function openResetPasswordModal() {
  setPasswordValues({ password: '', password_confirmation: '' })
  state.checkedReset = false
  state.resetPasswordModal = true
}

const toggleNewPasswordVisibility = () => {
  state.showPassword = !state.showPassword
}

const toggleConfirmPasswordVisibility = () => {
  state.showConfirmPassword = !state.showConfirmPassword
}

const onResetPassword = handlePasswordSubmit(async (values) => {
  try {
    await userService.resetPassword(
      String(state.userId),
      values,
      () => {
        resetPasswordForm()
        state.resetPasswordModal = false
      }
    )
  } catch (error: any) {
    responseHelper('error', error)
  }
})

const avatar = (avatar: string | null) => getAvatar(avatar)

function openCropperModal() {
  state.cropperModal = true
}

function onCropperReload() {
  state.cropperModal = false
  fetchstate()
}

function statusImageSelected(boolean: boolean) {
  state.isImageSelected = boolean
}

//check if key is not 'updated_by', 'created_at', 'updated_at', 'created_by' than return true
function removeUnusedChanges(key: string) {
  const unusedKeys = ['updated_by', 'created_at', 'updated_at', 'created_by'];
  return !unusedKeys.includes(key);
}

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
          <div class="avatar-lg position-relative profile-avatar-container">
            <button class="bg-transparent border-0" @click="openCropperModal">
              <img :src="avatar(state.user.avatar)" class="img-thumbnail rounded-circle profile-avatar" />
            </button>
            <div class="avatar-overlay" @click="openCropperModal">
              <i v-if="checkRole('user.users', 'update', true, state.user?.role?.id) || checkOwner(Number(state.userId))"
                class="las la-camera text-white"></i>
              <i v-else class="ri-eye-line text-white"></i>
            </div>
          </div>
        </div>
        <!--end col-->
        <div class="col">
          <div class="p-2">
            <h3 class="text-white mb-1">{{ state.user.name }}</h3>
            <div class="hstack text-white-50 gap-1">{{ state.user.name }}</div>
            <div class="hstack text-white-50 gap-1">{{ state.user.role?.name }}</div>

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
            v-if="checkRole('user.users', 'update', true, state.user?.role?.id) || checkOwner(Number(state.userId))">
            <button type="button" class="btn btn-sm btn-primary m-1" @click="toggleProfileModal">
              <i class="ri-user-settings-line align-bottom me-1"></i>
              Edit Profile
            </button>

            <button type="button" class="btn btn-sm btn-warning m-1" @click="openResetPasswordModal"
              v-if="checkRole('user.users', 'update', true, state.user?.role?.id) || checkOwner(Number(state.userId))">
              <i class="ri-lock-password-line align-bottom me-1"></i>
              Reset Password
            </button>

            <router-link :to="{ name: 'user.privileges', params: { id: state.userId } }"
              class="btn btn-sm btn-success m-1" v-if="checkRole('user.users', 'update', true, state.user?.role?.id)">
              <i class="ri-shield-user-line align-bottom me-1"></i>
              Edit Privileges
            </router-link>
            <button class="btn btn-sm btn-info m-1" @click="fixPrivilege()"
              v-if="checkRole('user.users', 'update', true, state.user?.role?.id)">
              <i class="bx bx-wrench align-middle me-1"></i>
              Fix Privilege
            </button>
          </div>
        </template>
        <template #cardBody>
          <div class="row">
            <div class="col-md-4">
              <span class="text-muted text-uppercase fs-11">Name</span>
              <div class="fs-12 fw-semibold border-bottom pb-2 mb-3 text-uppercase">
                <i class="las la-braille me-1 text-info"></i>
                <strong>{{ state.user?.name }}</strong>
              </div>
            </div>
            <!--End Col-->

            <div class="col-md-4">
              <span class="text-muted text-uppercase fs-11">Role</span>
              <div class="fs-12 border-bottom pb-2 mb-3 text-uppercase">
                <i class="las la-braille me-1 text-info"></i>
                {{ state.user?.role?.name }}
              </div>
            </div>
            <!--End Col-->

            <div class="col-md-4">
              <span class="text-muted text-uppercase fs-11">Status</span>
              <div class="border-bottom pb-2 mb-3 text-uppercase">
                <i class="las la-braille me-1 text-info"></i>
                <span v-if="state.user?.status == 1"
                  class="bg-success-subtle text-success rounded p-1 fs-10">Active</span>
                <span v-else-if="state.user?.status == 0"
                  class="bg-danger-subtle text-danger rounded p-1 fs-10">Suspended</span>
                <span v-else class="bg-success-subtle text-success rounded p-1 fs-10">Suspended</span>
              </div>
            </div>
            <!--End Col-->
          </div>

          <div class="row">
            <div class="col-md-4">
              <span class="text-muted text-uppercase fs-11">Email</span>
              <div class="fs-12 border-bottom pb-2 mb-3">
                <i class="las la-braille me-1 text-info"></i>
                {{ state.user?.email }}
              </div>
            </div>
            <!--End Col-->
            <div class="col-md-4" v-if="state.user?.nickname">
              <span class="text-muted text-uppercase fs-11">Nickname</span>
              <div class="fs-12 border-bottom pb-2 mb-3">
                <i class="las la-braille me-1 text-info"></i>
                {{ state.user?.nickname }}
              </div>
            </div>
            <!--End Col-->
            <div class="col-md-4">
              <span class="text-muted text-uppercase fs-11">Phone</span>
              <div class="fs-12 border-bottom pb-2 mb-3 text-uppercase">
                <i class="las la-braille me-1 text-info"></i>
                {{ state.user?.phone }}
              </div>
            </div>
            <div class="col-md-4">
              <span class="text-muted text-uppercase fs-11">Last Login</span>
              <div class="fs-12 border-bottom pb-2 mb-3">
                <i class="las la-braille me-1 text-info"></i>
                {{ formatDate(state.user?.last_login, 'YYYY-MM-DD HH:mm:ss', 'DD MMMM YYYY - HH:mm:ss') }}
              </div>
            </div>
            <!--End Col-->
          </div>
        </template>
        <template #customFooter>
          <div class="card-footer bg-light pt-2 pb-2">
            <div class="row">
              <div class="col-8">
                <nav aria-label="breadcrumb mb-0" v-if="checkRole('user.users', 'update')">
                  <ol class="breadcrumb text-uppercase mb-0 pt-1">
                    <li class="breadcrumb-item">
                      <i class="las la-map-marker me-1 text-muted"></i>
                      <router-link :to="{ name: 'user.index' }" class="text-info">
                        <strong>Users</strong>
                      </router-link>
                    </li>
                    <li class="breadcrumb-item active hide-xs" aria-current="page">
                      {{ state.user?.name }}
                    </li>
                  </ol>
                </nav>
                <a v-else href="#" class="btn btn-sm btn-light" onclick="history.back()"><i
                    class="las la-angle-double-left"></i> Back</a>
              </div>
              <div class="col-4 text-end">&nbsp;</div>
            </div>
          </div>
        </template>
      </BaseCard>
    </div>
    <div class="row" v-if="checkRole('user.users', 'read', true, state.user?.role?.id)">
      <BaseCard title="User Log" table-card no-footer>
        <template #titleIcon>
          <i class="las la-clipboard-list"></i>
        </template>
        <template #cardBody>
          <DatatableServer :url="`/user-logs/user/${state.userId}`" :column="state.userLogsColumns"
            :params="state.userLogParams" :table_per_page="[5, 10, 25]">
            <template #column-activity="{ item }">
              <div>
                <div class="fw-semibold text-capitalize">
                  <i v-if="item.action === 'logging in'" class="ri-login-box-line me-1 text-success"></i>
                  <i v-else-if="item.action === 'logging out'" class="ri-logout-box-line me-1 text-danger"></i>
                  <i v-else-if="item.action === 'updated'" class="ri-edit-line me-1 text-warning"></i>
                  <i v-else-if="item.action === 'created'" class="ri-add-circle-line me-1 text-primary"></i>
                  <i v-else-if="item.action === 'deleted'" class="ri-delete-bin-line me-1 text-danger"></i>
                  <i v-else class="ri-information-line me-1 text-info"></i>
                  {{ item.action }}
                </div>
                <div class="text-muted small" v-if="item.model_type">
                  <i class="ri-file-line me-1"></i>{{ item.model_type.split('\\').pop() }}
                  <span v-if="item.model_id"> #{{ item.model_id }}</span>
                </div>
                <div class="text-muted small" v-if="item.metadata && item.metadata.changes">
                  <i class="ri-database-2-line me-1"></i>
                  <span v-for="(value, key) in item.metadata.changes" :key="key" class="me-2">
                    <code class="text-muted" v-if="removeUnusedChanges(String(key))">{{ key }}</code>
                  </span>
                </div>
              </div>
            </template>
          </DatatableServer>
        </template>
      </BaseCard>
    </div>
    <TrackerCard v-if="state.user.creator && state.user.created_at" :created-at="state.user?.created_at"
      :updated-at="state.user?.updated_at" :created-by="state.user?.creator?.name"
      :updated-by="state.user?.updater?.name">
    </TrackerCard>
    <ModalBasic title="Update Profile" :modelValue="state.profileModal" @toggle="state.profileModal = $event" size="lg">
      <template #modalBody>
        <form id="update_profile_form" @submit.prevent="onSubmit">
          <div class="row g-3">
            <div class="border-bottom pb-3 col-md-6">
              <BasicInput label="Name" type="text" name="name" placeholder="Name" v-model="name" :required="true" />
              <div v-if="errors.name" class="text-danger small mt-1">{{ errors.name }}</div>
            </div>

            <div class="border-bottom pb-3 col-md-6"
              v-if="checkRole('user.users', 'update', true, state.user?.role?.id)">
              <label for="role_select"><i class="las la-braille text-muted"></i>Role</label>
              <MultiSelect id="role_select" placeholder="Select Roles" v-model="role" :options="state.editParams.role"
                :required="true" />
              <div v-if="errors.role" class="text-danger small mt-1">{{ errors.role }}</div>
            </div>

            <div class="border-bottom pb-3 col-md-6">
              <BasicInput label="Email (Login)" type="email" name="email" placeholder="Email" v-model="email"
                :required="true" />
              <div v-if="errors.email" class="text-danger small mt-1">{{ errors.email }}</div>
            </div>

            <div class="border-bottom pb-3 col-md-6">
              <BasicInput label="Phone (Personal)" type="text" name="phone" placeholder="Phone" v-model="phone" />
              <div v-if="errors.phone" class="text-danger small mt-1">{{ errors.phone }}</div>
            </div>

            <div class="border-bottom pb-3 col-md-6">
              <BasicInput label="Nick" type="text" name="nickname" placeholder="Nickname" v-model="nickname"
                :code="'optional'" />
              <div v-if="errors.nickname" class="text-danger small mt-1">{{ errors.nickname }}</div>
            </div>

            <div class="border-bottom pb-3 col-md-6">
              <label for="auth_select"><i class="las la-braille text-muted"></i>Status</label>
              <MultiSelect id="auth_select" v-model="status" placeholder="Auth Status"
                :options="state.editParams.status" />
              <div v-if="errors.status" class="text-danger small mt-1">{{ errors.status }}</div>
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
    <ModalBasic title="Reset Password" :modelValue="state.resetPasswordModal"
      @toggle="state.resetPasswordModal = $event">
      <template #modalBody>
        <form id="reset_password_form" @submit.prevent="onResetPassword" class="needs-validation" novalidate>
          <div class="row g-3">
            <!-- Password -->
            <div class="col-md-12 mb-3">
              <label for="newPassword" class="form-label">New Password <span class="text-danger">*</span></label>
              <div class="position-relative auth-pass-inputgroup">
                <input :type="state.showPassword ? 'text' : 'password'" class="form-control pe-5 password-input"
                  :class="{ 'is-invalid': passwordErrors.password && isFieldDirty('password') }" @paste.prevent
                  placeholder="Enter new password" id="newPassword" v-model="password">
                <button
                  class="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                  type="button" @click="toggleNewPasswordVisibility">
                  <i :class="state.showPassword ? 'ri-eye-off-fill' : 'ri-eye-fill'" class="align-middle"></i>
                </button>
                <div v-if="passwordErrors.password && isFieldDirty('password')" class="invalid-feedback">
                  {{ passwordErrors.password }}
                </div>
              </div>
            </div>

            <!-- Password Confirmation -->
            <div class="col-md-12 mb-3">
              <label class="form-label" for="confirm-password-input">Confirm Password <span
                  class="text-danger">*</span></label>
              <div class="position-relative auth-pass-inputgroup">
                <input :type="state.showConfirmPassword ? 'text' : 'password'" class="form-control pe-5 password-input"
                  :class="{ 'is-invalid': passwordErrors.password_confirmation && isFieldDirty('password_confirmation') }"
                  @paste.prevent placeholder="Confirm new password" id="confirm-password-input"
                  v-model="password_confirmation">
                <button
                  class="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                  type="button" @click="toggleConfirmPasswordVisibility">
                  <i :class="state.showConfirmPassword ? 'ri-eye-off-fill' : 'ri-eye-fill'" class="align-middle"></i>
                </button>
                <div v-if="passwordErrors.password_confirmation && isFieldDirty('password_confirmation')"
                  class="invalid-feedback">
                  {{ passwordErrors.password_confirmation }}
                </div>
              </div>
            </div>
          </div>
        </form>
      </template>
      <template #modalFooter>
        <div class="col">
          <div class="row">
            <div class="col col-lg-5 mt-4">
              <input v-model="state.checkedReset" type="checkbox" id="checkboxResetPassword"
                style="margin-right: 4px" />
              <label for="checkboxResetPassword">Confirm</label>
            </div>
            <div class="col col-lg-7 hstack justify-content-end">
              <button style="margin-right: 1em" type="button" class="btn btn-light"
                @click="state.resetPasswordModal = false">
                Close
              </button>
              <button form="reset_password_form" type="submit" variant="primary" class="btn btn-primary"
                :class="!state.checkedReset || !meta.valid ? 'disabled' : ''">
                Reset Password
              </button>
            </div>
          </div>
        </div>
      </template>
    </ModalBasic>
    <ModalBasic
      :title="checkRole('user.users', 'update', true, state.user?.role?.id) || checkOwner(Number(state.userId)) ? 'Update Profile Photo' : 'Profile Photo'"
      :modelValue="state.cropperModal" @toggle="state.cropperModal = $event" size="xl">
      <template #modalBody>
        <div class="photo-cropper-container-modal">
          <div class="row g-4 align-items-center">
            <div class="text-center"
              :class="checkRole('user.users', 'update', true, state.user?.role?.id) || checkOwner(Number(state.userId)) ? 'col-md-3' : 'col-md-12'"
              v-if="!state.isImageSelected">
              <div class="current-photo-preview mb-3">
                <img :src="avatar(state.user.avatar)" class="img-thumbnail rounded-circle current-photo-img"
                  :class="checkRole('user.users', 'update', true, state.user?.role?.id) || checkOwner(Number(state.userId)) ? 'current-photo-img' : 'current-photo-img-full'"
                  alt="Current Profile Photo" />
              </div>
              <div class="text-muted small">Current Photo</div>
            </div>
            <div
              v-if="checkRole('user.users', 'update', true, state.user?.role?.id) || checkOwner(Number(state.userId))"
              :class="state.isImageSelected ? 'col-md-12' : 'col-md-9'">
              <ImageCropper :route_id="String(state.userId)" @reload="onCropperReload"
                @uploaded="statusImageSelected" />
            </div>
          </div>
        </div>
      </template>
      <template #modalFooter>
        <div class="d-flex justify-content-between align-items-center w-100">
          <div class="text-muted small">
            <i class="las la-info-circle me-1"></i>
            Crop your image to fit perfectly in your profile
          </div>
          <button type="button" class="btn btn-secondary" @click="state.cropperModal = false">
            <i class="las la-times me-1"></i> Close
          </button>
        </div>
      </template>
    </ModalBasic>
  </Layout>
</template>

<style scoped>
/* Profile Avatar Styling */
.profile-avatar-container {
  transition: all 0.3s ease;
}

.profile-avatar {
  transition: all 0.3s ease;
  border: 3px solid rgba(255, 255, 255, 0.8) !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.profile-avatar-container:hover .profile-avatar {
  transform: scale(1.05);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3);
}

.camera-btn {
  bottom: 5px;
  right: 5px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.4);
  transition: all 0.3s ease;
  z-index: 2;
}

.camera-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.6);
}


.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 123, 255, 0.8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: pointer;
  z-index: 1;
}

.profile-avatar-container:hover .avatar-overlay {
  opacity: 1;
}

.avatar-overlay i {
  font-size: 24px;
}

/* Modal photo cropper container styling */
.photo-cropper-container-modal {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafe 50%, #f0f7ff 100%);
  border-radius: 24px;
  padding: 3rem 2.5rem;
  min-height: 380px;
  box-shadow:
    0 20px 60px rgba(0, 123, 255, 0.08),
    0 8px 32px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.photo-cropper-container-modal::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 123, 255, 0.3), transparent);
}

.current-photo-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafe 100%);
  border-radius: 20px;
  box-shadow:
    0 8px 32px rgba(0, 123, 255, 0.06),
    0 4px 16px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  padding: 2rem 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.5);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.current-photo-preview:hover {
  transform: translateY(-2px);
  box-shadow:
    0 12px 48px rgba(0, 123, 255, 0.1),
    0 8px 24px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.current-photo-img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  background: #f8f9fa;
  transition: box-shadow 0.3s, transform 0.3s;
}

.current-photo-img-full {
  width: 250px;
  height: 250px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  background: #f8f9fa;
  transition: box-shadow 0.3s, transform 0.3s;
}

.current-photo-img:hover {
  box-shadow: 0 8px 32px rgba(0, 123, 255, 0.18);
  transform: scale(1.04);
}

.current-photo-img-full:hover {
  box-shadow: 0 8px 32px rgba(0, 123, 255, 0.18);
  transform: scale(1.04);
}

.photo-cropper-container-modal .alert-info {
  border-radius: 12px;
  font-size: 1.1rem;
  padding: 1.5rem 1rem;
  background: linear-gradient(135deg, #e3f0ff 0%, #f8f9fa 100%);
  color: #007bff;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.08);
}

/* Photo Cropper Container */
.photo-cropper-container {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  padding: 1.5rem;
  min-height: 400px;
}
</style>