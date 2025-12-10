<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import Layout from '@/layouts/MainLayout.vue'
import ModalEditPicture from './EditPictureView.vue'
import BaseCard from '@/components/cards/base-card.vue'
import BasicInput from '@/components/inputs/BasicInput.vue'
import { getAvatar } from '../../../utils/assetsHelper'
import Multiselect from '@vueform/multiselect'

// Dummy local store replacements (you don't have `useProfileStore` in your project)
const profile = ref<any>({
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '',
  gender: 'male',
})
const avatar = ref<string | undefined>('')
const roleValue = ref<any>({ name: 'user', display_name: 'User' })

// No-op / dummy actions to replace store actions
const fetchProfiles = () => {
  // placeholder: in a real app this would fetch profile data
  // Keep the existing default profile object
}
const updateUsersProfile = (data: any) => {
  // placeholder: you can replace this with a real store action
  // For now, merge the data into the local profile to simulate behavior
  profile.value = { ...profile.value, ...data }
  console.log('updateUsersProfile called', data)
}
const updateUsersPassword = (data: any) => {
  // placeholder: simulate password update
  console.log('updateUsersPassword called', data)
}

// local form state
const name = ref<string>('')
const email = ref<string>('')
const phone = ref<string>('')
const genders = ref([{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }])
const genderSelect = ref<{ label: string; value: string } | null>(null)

const checked = ref(false)
const passwordChecked = ref(false)
const password = ref('')
const passwordConfirmation = ref('')

onMounted(() => {
  fetchProfiles()
})

// sync profile into local form when available
watch(profile, (p) => {
  if (p) {
    name.value = (p as any).name ?? ''
    email.value = (p as any).email ?? ''
    phone.value = (p as any).phone ?? ''
    genderSelect.value = genders.value.find((g) => g.value === (p as any).gender) ?? null
  }
}, { immediate: true })

function searchAvatar(a?: string) {
  return getAvatar(a)
}

function getRoleBadgeClass(role?: string) {
  switch (role) {
    case 'super_admin':
      return 'bg-danger-subtle text-danger'
    case 'admin':
      return 'bg-primary-subtle text-primary'
    case 'user':
      return 'bg-warning-subtle text-warning'
    default:
      return ''
  }
}

function editProfileData() {
  const formData = {
    name: name.value,
    phone: phone.value,
    email: email.value,
    gender: genderSelect.value ? genderSelect.value.value : null,
  }
  updateUsersProfile(formData)
}

function editPassword() {
  const passwordData = {
    password: password.value,
    password_confirmation: passwordConfirmation.value,
  }
  updateUsersPassword(passwordData)
}

const displayName = computed(() => name.value || (profile.value && (profile.value as any).name) || '')

function handleUpdateImage(dataUrl: string) {
  // For now, update local avatar preview and merge into profile
  avatar.value = dataUrl
  updateUsersProfile({ avatar: dataUrl })
}
</script>
<template>
  <Layout>
    <div>
      <div class="row">
        <BaseCard wrapperClass="col-lg-3" noHeader>
          <template #cardBody>
            <div class="card-body p-4 text-center">
              <div class="mx-auto avatar-md mb-3">
                <img
                  :src="searchAvatar(avatar)"
                  style="height: 100%; width: 100%"
                  alt="user-image-profile"
                  class="myAvatar img-fluid rounded-circle"
                />
              </div>
              <template v-if="roleValue">
                <h5 class="card-title mb-2">{{ displayName }}</h5>
                <p class="text-muted">
                  <span class="rounded p-1" :class="getRoleBadgeClass(roleValue?.name)">
                    {{ roleValue?.display_name }}
                  </span>
                </p>
              </template>
            </div>
          </template>
          <template #cardFooterStart>
            <ModalEditPicture @update-image="handleUpdateImage" />
          </template>
        </BaseCard>
        <div class="col-lg-9">
          <form action="" method="post" id="updateForm" @submit.prevent="editProfileData">
            <div class="card" id="userDetail">
              <div class="card-header">
                <h5 class="card-title mb-0 cnt-userName">User Data</h5>
              </div>
              <div class="card-body">
                <div class="row mb-3">
                  <div class="col-md-3">
                    <label class="form-label" for="user_name">Name</label>
                  </div>
                  <div class="col-md-9">
                    <BasicInput v-model="name" type="text" name="name" label="Name" />
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-3">
                    <label class="form-label" for="user_email">Email</label>
                  </div>
                  <div class="col-md-9">
                    <BasicInput v-model="email" type="email" name="email" label="Email" />
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-3">
                    <label class="form-label" for="user_email">Gender</label>
                  </div>
                  <div class="col-md-9">
                    <Multiselect
                      v-model="genderSelect"
                      :options="genders"
                      :placeholder="'Select Gender'"
                    />
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-3">
                    <label class="form-label" for="user_phone">Contact (Phone/WA)</label>
                  </div>
                  <div class="col-md-9">
                    <BasicInput v-model="phone" type="tel" name="phone" label="Phone" />
                  </div>
                </div>
                <input type="hidden" name="uid" value="349" />
              </div>
              <div class="card-footer">
                <button :class="checked ? '' : 'disabled'" class="btn btn-primary">
                  <i class="ri-check-line align-middle me-1"></i>
                  Update/Save
                </button>
                <input
                  style="margin-left: 30px"
                  type="checkbox"
                  id="checkboxDetail"
                  v-model="checked"
                />
                <!-- @change="(e) => handleCheckbox(checked, e)" -->
                <label style="padding-left: 11px" for="checkboxDetail">Confirm</label>
              </div>
            </div>
          </form>

          <form @submit.prevent="editPassword">
            <div class="card">
              <div class="card-header">
                <h5 class="card-title mb-0 cnt-userName">Change Password</h5>
              </div>
              <div class="card-body">
                <div class="row mb-3">
                  <div class="col-md-3">
                    <label class="form-label" for="user_pass">New Password</label>
                  </div>
                  <div class="col-md-9">
                    <input id="user_pass" v-model="password" class="form-control" type="password" />
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-3">
                    <label class="form-label" for="user_pass_confrm"
                      >New Password Confrmation</label
                    >
                  </div>
                  <div class="col-md-9">
                    <input
                      id="user_pass_confrm"
                      v-model="passwordConfirmation"
                      class="form-control"
                      type="password"
                    />
                  </div>
                </div>

                <input type="hidden" name="uid" value="349" />
              </div>
              <!--End Card Body-->
              <div class="card-footer">
                <button :class="passwordChecked ? '' : 'disabled'" class="btn btn-danger">
                  <i class="ri-check-line align-middle me-1"></i>
                  Update/Save
                </button>
                <input
                  style="margin-left: 30px"
                  type="checkbox"
                  id="checkboxPassword"
                  v-model="passwordChecked"
                />
                <!-- @change="(e) => handleCheckbox(passwordChecked, e)" -->
                <label style="padding-left: 11px" for="checkboxPassword">Confirm</label>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Layout>
</template>

<style>
.tamp {
  position: absolute;
  top: 17px;
  right: 16px;
}
.form-select {
  width: 96%;
  margin-left: 2%;
}
.vs__search,
.vs__search:focus {
  font-size: 1em;
  padding: 5px 12px;
}
</style>
