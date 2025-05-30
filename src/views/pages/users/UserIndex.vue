<script setup lang="ts">
import Layout from '@/layouts/MainLayout.vue'
import { reactive, watch } from 'vue'
import BasicInput from '@/components/inputs/BasicInput.vue'
import BaseCard from '@/components/cards/base-card.vue'
import Swal from 'sweetalert2'
import checkRole from '../../../utils/adminActionButton'
import { userService, utilsService } from '@/service'
import ModalBasic from '@/components/modals/ModalBasic.vue'
import { errorHelper } from '../../..//utils/alertHelper'
import type { FormField, Option, Param } from '@/interfaces/Utils'
import { useRoute, useRouter } from 'vue-router'
import DatatableServer from '@/components/datatables/DatatableServer.vue'

const router = useRouter()
const route = useRoute()

const state = reactive({
  url: '/users',
  checked: false,
  modalAdd: false,
  searchPandawaForm: '' as string,
  userForm: {} as FormField,
  options: {
    role: {} as Option
  },
  tableData: {
    order_by: 'id',
    sort: 'asc'
  } as Param,
  statusSearch: {} as { message: string; code: string },
  componentKey: 0,
  columns: [
    { hidden: false, label: 'ID', name: 'id', sortable: true },
    {
      hidden: false,
      label: 'Name',
      name: 'name',
      class: 'text-start',
      bold: true,
      custom: {
        routeName: 'user.detail',
        params: 'id',
        image: 'avatar',
        uniqueIcon: true
      },
      sortable: true
    },
    {
      hidden: false,
      label: 'Auth/Role',
      name: 'role_id',
      display: 'role.id',
      badge: {
        types: [
          { value: 1, type: 'danger', label: 'Super Admin' },
          { value: 2, type: 'primary', label: 'Admin' },
          { value: 3, type: 'warning', label: 'User' }
        ]
      },
      sortable: true
    },
    {
      hidden: false,
      label: 'Status',
      name: 'status',
      badge: {
        types: [
          { value: 1, type: 'success', label: 'Active' },
          { value: 0, type: 'danger', label: 'Suspended' }
        ]
      },
      sortable: true
    },
    {
      hidden: false,
      label: 'Email',
      name: 'email',
      sortable: false
    },
    {
      hidden: false,
      label: 'NIP',
      name: 'nip',
      sortable: false
    },
    {
      hidden: false,
      label: 'Last Login',
      name: 'last_login',
      custom: {
        icon: 'ri-time-line me-1 text-muted'
      },
      sortable: false
    }
  ],
  inputFields: [
    {
      id: 1,
      label: 'Pandawa User ID',
      name: 'pandawa_user_id',
      pandawa: 'id',
      inputType: 'text',
      modelValue: ''
    },
    {
      id: 2,
      label: 'NIP',
      name: 'nip',
      pandawa: 'nip',
      inputType: 'text',
      modelValue: ''
    },
    {
      id: 3,
      label: 'Name',
      name: 'name',
      pandawa: 'name',
      inputType: 'text',
      modelValue: '',
      required: true
    },
    {
      id: 4,
      label: 'Email',
      name: 'email',
      pandawa: 'email',
      inputType: 'email',
      modelValue: ''
    }
  ]
})

function getProjects() {
  const paramData = Object.fromEntries(
    Object.entries(state.tableData).filter(([, value]) => value !== null)
  )
  router.replace({
    query: paramData
  })
  state.tableData = paramData
}

function createData() {
  userService.store(state.userForm).then(() => {
    Swal.fire({
      icon: 'success',
      text: 'Berhasil menyimpan data',
      title: 'Success',
      allowOutsideClick: false,
      allowEscapeKey: false
    })
      .then((e) => {
        if (e.isConfirmed) {
          forceRender()
          state.modalAdd = false
        }
      })
      .catch((e) => errorHelper(e))
  })
}

async function searchPandawaUser(email: string) {
  await utilsService
    .getPandawaUser(email)
    .then((res) => {
      state.inputFields.forEach((e) => {
        state.userForm[e.name] = res[e.pandawa]
      })
      state.statusSearch.message = 'User has been found'
      state.statusSearch.code = 'success'
    })
    .catch((e) => {
      console.error(e)
      state.statusSearch.message = 'User not found'
      state.statusSearch.code = 'danger'
    })
}

function toggleHeader(header: string) {
  let index = state.columns.findIndex((col) => col.label === header)
  state.columns[index].hidden = !state.columns[index].hidden
}

function forceRender() {
  state.componentKey++
}

async function clear() {
  state.modalAdd = true
  state.searchPandawaForm = ''
  state.statusSearch = {} as { message: string; code: string }
  state.options = await userService.create()
  state.userForm = {}
  state.checked = false
}
watch(() => route.query, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    state.tableData = newValue
    getProjects()
  }
}, { immediate: true, deep: true })
</script>

<template>
  <Layout>
    <div class="row">
      <BaseCard noFooter tableCard title="Users">
        <template #titleIcon>
          <i class="las la-braille me-1"></i>
        </template>
        <template #cardButton>
          <div class="btn-group btn-sm">
            <button class="btn btn-success btn-sm dropdown-toggle m-1" type="button" data-bs-toggle="dropdown"
              aria-haspopup="true" aria-expanded="false">
              <i class="las la-columns"></i> <span class="hide-xs">Column</span>
            </button>
            <div class="dropdown-menu p-3 pb-1 fs-11 text-uppercase" id="showHideColumn" style="">
              <div class="form-check form-check-success mb-1 dropdown-item" v-for="(toggle, index) in state.columns"
                :key="index">
                <input class="form-check-input toggle-vis" type="checkbox" :checked="!toggle.hidden"
                  @change="toggleHeader(toggle.label)" />
                {{ toggle.label }}
              </div>
            </div>
            <button class="btn btn-primary btn-sm m-1" @click="clear" type="button"
              v-if="checkRole('user.users', 'create')">
              <i class="ri-add-circle-line align-bottom me-1"></i>Add User
            </button>
          </div>
        </template>
        <template #cardBody>
          <DatatableServer :key="state.componentKey" :url="state.url" :column="state.columns"
            :params="state.tableData" />
        </template>
        <template #customFooter>
          <div class="card-footer pt-1 pb-1 bg-light">
            <code>API SOURCE: PANDAWA</code>
          </div>
        </template>
      </BaseCard>
    </div>
    <ModalBasic :modelValue="state.modalAdd" :title="'Create User'" @toggle="state.modalAdd = $event">
      <template #modalBody>
        <form @submit.prevent="createData">
          <div class="row g-3">
            <div class="col-xxl-12">
              <label for="searchPandawaUserForm" class="mt-2 mb-2">Pandawa Email</label>
              <div class="input-group mb-3">
                <input id="searchPandawaUserForm" type="email" class="form-control" placeholder="Pandawa user email"
                  aria-label="Pandawa User Search" aria-describedby="searchPandawa searchStatus"
                  v-model="state.searchPandawaForm" />
                <button class="btn btn-outline-secondary" type="button" id="searchPandawa"
                  @click="searchPandawaUser(state.searchPandawaForm)">
                  Search
                </button>
              </div>
              <div :class="'form-text text-' + state.statusSearch.code" v-if="state.statusSearch" id="searchStatus">
                {{ state.statusSearch.message }}
              </div>
            </div>
          </div>
          <div class="row g-3">
            <div v-for="input in state.inputFields" :key="input.id" class="col-xxl-12">
              <BasicInput :label="input.label" :type="input.inputType" :name="input.name" :placeholder="input.label"
                :required="input.required ? true : false" disabled v-model="state.userForm[input.name]" />
            </div>
            <div class="col-12">
              <label class="mt-2 mb-2">Select Role</label>
              <MultiSelect v-model="state.userForm.role" :options="state.options.role" placeholder="Select Role" />
            </div>
            <div class="col-5">
              <input type="checkbox" id="checkbox" style="margin-right: 4px" v-model="state.checked" />
              <label for="checkbox">Confirm</label>
            </div>
            <div class="col-7">
              <div class="hstack gap-2 justify-content-end">
                <button type="button" class="btn btn-light" @click="state.modalAdd = false">
                  Close
                </button>
                <button :disabled="state.checked ? false : true" type="submit" class="btn btn-primary">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </form>
      </template>
    </ModalBasic>
  </Layout>
</template>
