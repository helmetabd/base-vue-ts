<script setup lang="ts">
import Layout from '@/layouts/MainLayout.vue'
import { reactive } from 'vue'
import BasicInput from '@/components/inputs/BasicInput.vue'
import BaseCard from '@/components/cards/base-card.vue'
import Swal from 'sweetalert2'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import checkRole from '../../../utils/adminActionButton'
import { userService } from '@/service'
import ModalBasic from '@/components/modals/ModalBasic.vue'
import { errorHelper } from '../../..//utils/alertHelper'
import type { FormField, Option, Param } from '@/interfaces/Utils'
import DatatableServer from '@/components/datatables/DatatableServer.vue'

const state = reactive({
  url: '/users',
  checked: false,
  modalAdd: false,
  userForm: {} as FormField,
  options: {
    role: {} as Option,
    status: [] as Option[]
  },
  tableData: {
    order_by: 'id',
    sort: 'asc'
  } as Param,
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
      label: 'Nickname',
      name: 'nickname',
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
      label: 'Phone',
      name: 'phone',
      custom: {
        icon: 'ri-phone-line me-1 text-muted'
      },
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
  inputFields: []
})

// Add user form schema
const schema = yup.object({
  name: yup.string().required('Name is required'),
  nickname: yup.string().nullable(),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'), // Fixed error message
  phone: yup.string()
    .required('Phone number is required')
    .test('indonesian-phone', 'Please enter a valid Indonesian phone number (e.g., 08123456789, 628123456789, or +628123456789)',
      function (value) {
        if (!value) return false;
        return /^(?:\+62|62|0)8[1-9][0-9]{7,10}$/.test(value);
      }
    ),
  role: yup.string().required('Role is required')
})

const { handleSubmit, errors, resetForm } = useForm({ validationSchema: schema })
const { value: name } = useField<string>('name')
const { value: nickname } = useField<string | null>('nickname')
const { value: password } = useField<string>('password')
const { value: email } = useField<string>('email')
const { value: phone } = useField<string | null>('phone')
const { value: roleField } = useField<number | null>('role')

const submitAdd = handleSubmit(async (values) => {
  try {
    values = { ...values, status: 1 }
    await userService.store(values)
    Swal.fire({ icon: 'success', text: 'User created', title: 'Success' }).then((e) => {
      if (e.isConfirmed) {
        forceRender()
        state.modalAdd = false
      }
    })
    resetForm()
  } catch (e: any) {
    errorHelper(e)
  }
})

function toggleHeader(header: string) {
  const index = state.columns.findIndex((col) => col.label === header)
  if (index !== -1 && state.columns[index]) {
    state.columns[index].hidden = !state.columns[index].hidden
  }
}

function forceRender() {
  state.componentKey++
}

async function clear() {
  state.modalAdd = true
  state.options = await userService.create()
  state.userForm = {}
  state.checked = false
}
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
      </BaseCard>
    </div>
    <ModalBasic :modelValue="state.modalAdd" :title="'Create User'" @toggle="state.modalAdd = $event" size="lg">
      <template #modalBody>
        <form @submit.prevent="submitAdd" id="add_user_form">
          <div class="row g-3">
            <div class="col-xxl-6 border-bottom pb-3">
              <BasicInput label="Name" type="text" name="name" placeholder="Name" v-model="name" :required="true" />
              <div v-if="errors.name" class="text-danger small mt-1">{{ errors.name }}</div>
            </div>

            <div class="col-xxl-6 border-bottom pb-3">
              <BasicInput label="Phone" type="text" name="phone" placeholder="Phone" v-model="phone" :required="true" />
              <div v-if="errors.phone" class="text-danger small mt-1">{{ errors.phone }}</div>
            </div>

            <div class="col-xxl-6 border-bottom pb-3">
              <BasicInput label="Email" type="email" name="email" placeholder="Email" v-model="email"
                :required="true" />
              <div v-if="errors.email" class="text-danger small mt-1">{{ errors.email }}</div>
            </div>

            <div class="col-xxl-6 border-bottom pb-3">
              <BasicInput label="Password" type="password" name="password" placeholder="Password" v-model="password"
                :required="true" />
              <div v-if="errors.password" class="text-danger small mt-1">{{ errors.password }}</div>
            </div>

            <div class="col-xxl-6 border-bottom pb-3">
              <BasicInput label="Nickname" type="text" name="nickname" placeholder="Nickname" v-model="nickname" />
              <div v-if="errors.nickname" class="text-danger small mt-1">{{ errors.nickname }}</div>
            </div>

            <div class="col-xxl-6 border-bottom pb-3">
              <label><i class="las la-braille text-muted"></i>Select Role</label>
              <MultiSelect v-model="roleField" :options="state.options.role" placeholder="Select Role" />
              <div v-if="errors.role" class="text-danger small mt-1">{{ errors.role }}</div>
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
              <button style="margin-right: 1em" type="button" class="btn btn-light" @click="state.modalAdd = false">
                Close
              </button>
              <button form="add_user_form" type="submit" variant="primary" class="btn btn-primary"
                :class="!state.checked ? 'disabled' : ''">
                Save
              </button>
            </div>
          </div>
        </div>
      </template>
    </ModalBasic>
  </Layout>
</template>
