<script setup lang="ts">
import Layout from '@/layouts/MainLayout.vue'
import 'moment'
import ModalBasic from '@/components/modals/ModalBasic.vue'
import BasicInput from '@/components/inputs/BasicInput.vue'
import Swal from 'sweetalert2'
import moment, { type MomentInput } from 'moment'
import { onMounted, reactive } from 'vue'
import { userService } from '@/service'
import { useRoute } from 'vue-router'
import checkRole from '../../../utils/adminActionButton'
import { getAvatar } from '../../../utils/assetsHelper'
import BaseCard from '@/components/cards/base-card.vue'
import { responseHelper } from '@/utils/responseHelper'
import type { State, User } from '@/interfaces/User'
import type { FormField, Option } from '@/interfaces/Utils'

const router = useRoute()

const state = reactive<State>({
  user: {} as User,
  userId: router.params.id,
  userProfileFormField: {} as FormField,
  profileModal: false,
  pandawaModal: false,
  inputProfile: [
    {
      id: 1,
      label: 'Name',
      name: 'name',
      inputType: 'text',
      modelValue: '',
      required: true
    },
    {
      id: 2,
      label: 'NIP',
      name: 'nip',
      inputType: 'text',
      modelValue: '',
      required: true
    },
    {
      id: 3,
      label: 'Email',
      name: 'email',
      inputType: 'email',
      modelValue: '',
      required: true
    }
  ],
  checked: false,
  userLogsColumns: [
    { label: 'ID', name: 'tid', class: 'text-center' },
    {
      label: 'Activity',
      name: 'activity',
      class: 'text-start'
    },
    {
      label: 'Staff',
      target: true,
      class: 'text-center'
    },
    {
      label: 'Time Stamp',
      name: 'created_at',
      class: 'text-center'
    }
  ],
  userAccountLogsColumns: [
    { label: 'ID', name: 'tid', class: 'text-center' },
    {
      label: 'Activity',
      name: 'activity',
      class: 'text-start'
    },
    {
      label: 'Setter',
      setter: true,
      class: 'text-center'
    },
    {
      label: 'Time Stamp',
      name: 'created_at',
      class: 'text-center'
    }
  ],
  editParams: {
    status: [] as Option[],
    role: [] as Option[]
  }
})

async function goToCreator(creatorId: number) {
  state.user = await userService.detail(creatorId)
  // this.fetchLogs(creatorId);
}

const fetchstate = async () => {
  try {
    state.user = await userService.detail(Number(state.userId))
  } catch (error: any) {
    Swal.fire('error', error.response.message, 'error')
  }
}

function formatDate(date: MomentInput, dateType: string): string {
  const types = [
    { name: 'iso', dateFormat: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]' },
    { name: 'normal', dateFormat: 'DD-MM-YYYY HH:mm:ss' }
  ]
  let formattedDate = ''
  if (date) {
    types.forEach((element) => {
      if (element.name === dateType) {
        formattedDate = moment(date, element.dateFormat).format('DD MMM YYYY - HH:mm:ss')
      }
    })
  } else {
    return ''
  }
  return formattedDate
}

function onSubmit() {
  userService
    .update(Number(state.userId), state.userProfileFormField)
    .then((res) => {
      fetchstate()
      responseHelper('success', res)
    })
    .catch((error: any) => Swal.fire('error', error.response.message, 'error'))
  state.profileModal = !state.profileModal
}

async function toggleProfileModal() {
  try {
    const res = await userService.edit(Number(router.params.id))
    const { data: user, params: params } = res
    state.editParams = params
    state.inputProfile.forEach((element) => {
      state.userProfileFormField[element.name as keyof FormField] = state.user[
        element.name as keyof User
      ] as string | number
    })
    state.userProfileFormField.role = user.role_id
    state.userProfileFormField.status = user.status
    state.profileModal = !state.profileModal
  } catch (error: any) {
    responseHelper('error', error)
  }
}

function fixPandawa(e: Event) {
  const target = e.target as HTMLFormElement
  const data = new FormData(target)

  userService
    .fixPandawa(Number(router.params.id), data)
    .then((res) => {
      Swal.fire('Success', res.data.message, 'success').then((event) => {
        if (event.isConfirmed) {
          fetchstate()
        }
      })
    })
    .catch((e: any) => {
      Swal.fire('Error', e.response.data.message, 'error')
    })
    .finally(() => {
      state.pandawaModal = false
    })
}

function fixPrivilege() {
  userService
    .fixPrivilege(Number(router.params.id))
    .then((res) => responseHelper('success', res))
    .catch((e) => responseHelper('error', e))
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
            <h3 class="text-white mb-1">{{ state.user.name }}</h3>

            <div class="hstack text-white-50 gap-1">{{ state.user.name }}</div>
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
          <div class="btn-group" v-if="checkRole('user.users', 'update', true, state.user?.role?.id)">
            <button type="button" class="btn btn-sm btn-primary m-1" @click="toggleProfileModal">
              <i class="ri-user-settings-line align-bottom me-1"></i>
              Edit Profile
            </button>

            <router-link :to="{ name: 'user.privileges', params: { id: state.userId } }"
              class="btn btn-sm btn-success m-1">
              <i class="ri-shield-user-line align-bottom me-1"></i>
              Edit Privileges
            </router-link>
            <button class="btn btn-sm btn-info m-1" @click="fixPrivilege()">
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
              <span class="text-muted text-uppercase fs-11">Pandawa User Role</span>
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

          <div class="row" v-if="state.user?.employee">
            <div class="col-md-4">
              <span class="text-muted text-uppercase fs-11">NIP</span>
              <div class="fs-11 border-bottom pb-2 mb-3 text-uppercase">
                <i class="las la-braille me-1 text-info"></i>
                <span v-if="!state.user?.employee?.nip" class="rounded p-1 bg-danger-subtle text-danger">NIP masih
                  kosong, hubungi Human Capital</span>
                {{ state.user?.employee?.nip }}
              </div>
            </div>
            <!--End Col -->
            <div class="col-md-4">
              <span class="text-muted text-uppercase fs-11">Email</span>
              <div class="fs-12 border-bottom pb-2 mb-3 text-uppercase">
                <i class="las la-braille me-1 text-info"></i>
                {{ state.user?.email }}
              </div>
            </div>
            <!--End Col-->
            <div class="col-md-4">
              <span class="text-muted text-uppercase fs-11">Last Login</span>
              <div class="fs-12 border-bottom pb-2 mb-3 text-uppercase">
                <i class="las la-braille me-1 text-info"></i>
                {{ state.user?.last_login }}
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
                      {{ state.user?.name }}
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
        <form id="update_profile_form" @submit.prevent="onSubmit">
          <div class="row g-3">
            <div class="col-md-12">
              <label for="role_select">Role</label>
              <MultiSelect id="role_select" placeholder="Select Roles" v-model="state.userProfileFormField.role"
                :options="state.editParams.role" :required="true" />
            </div>
            <div v-for="input in state.inputProfile" :key="input.id" class="col-md-12">
              <BasicInput :label="input.label" :type="input.inputType" :name="input.name" :placeholder="input.label"
                v-model="state.userProfileFormField[input.name]" :required="input.required ? true : false" disabled />
            </div>
            <div class="col-md-12">
              <label for="auth_select">Auth</label>
              <MultiSelect id="auth_select" v-model="state.userProfileFormField.status" placeholder="Auth Status"
                :options="state.editParams.status" />
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

    <ModalBasic title="Fix Pandawa state" :modelValue="state.pandawaModal" @toggle="state.pandawaModal = $event">
      <template #modalBody>
        <form id="pandawaForm" @submit.prevent="(e) => fixPandawa(e)">
          <div class="form-group">
            <label class="form-label" for="pandawa_nip">Pandawa NIP</label>
            <input type="text" id="pandawa_nip" name="pandawa_nip" placeholder="NIP karyawan genah" class="form-control"
              required />
          </div>
          <div class="col-md-12 mt-2">
            <blockquote class="blockquote custom-blockquote blockquote-outline blockquote-warning rounded mb-0">
              <p class="text-dark mb-2">Note:</p>
              <footer class="blockquote-footer mt-0 mb-1 text-danger">
                Pastikan staff sudah mempunyai NIP di yudhistira.
              </footer>
            </blockquote>
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
              <button style="margin-right: 1em" type="button" class="btn btn-light" @click="state.pandawaModal = false">
                Close
              </button>
              <button form="pandawaForm" type="submit" variant="primary" class="btn btn-primary"
                :class="!state.checked ? 'disabled' : ''">
                Update
              </button>
              <!-- </div> -->
            </div>
          </div>
        </div>
      </template>
    </ModalBasic>
  </Layout>
</template>
