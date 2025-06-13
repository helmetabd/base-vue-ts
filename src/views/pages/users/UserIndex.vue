<script setup lang="ts">
import Layout from '@/layouts/MainLayout.vue'
import { reactive, watch } from 'vue'
import * as yup from "yup"
import BasicInput from '@/components/inputs/BasicInput.vue'
import BaseCard from '@/components/cards/base-card.vue'
import Multiselect from '@vueform/multiselect';
import '@vueform/multiselect/themes/default.css'
import checkRole from '../../../utils/adminActionButton'
import { userService } from '@/service'
import ModalBasic from '@/components/modals/ModalBasic.vue'
import type { FormField, Option, Param } from '@/interfaces/Utils'
import { useRoute } from 'vue-router'
import DatatableServer from '@/components/datatables/DatatableServer.vue'
import { useForm } from 'vee-validate'

const route = useRoute()

const schema = yup.object().shape({
  firstname: yup.string().required('First name is required'),
  lastname: yup.string().required('Last name is required'),
  username: yup.string().required('Username is required'),
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

const { handleSubmit, resetForm, meta, defineField, errors } = useForm({
  validationSchema: schema,
  initialValues: {} as FormField
});

const state = reactive({
  url: '/users',
  checked: false,
  modalAdd: false,
  userForm: {
    firstname: defineField('firstname'),
    lastname: defineField('lastname'),
    username: defineField('username'),
    email: defineField('email'),
    password: defineField('password'),
    phone: defineField('phone'),
    role: defineField('role')
  },
  options: {
    role: [
      { value: 'STAKEHOLDER', label: 'Stake Holder' },
      { value: 'USER', label: 'User' }
    ] as Option[]
  },
  tableData: {
    'sort-by': 'id',
    'sort-method': 'asc'
  } as Param,
  componentKey: 0,
  columns: [
    { hidden: false, label: 'ID', name: 'id', sortable: true },
    {
      hidden: false,
      label: 'Name',
      name: 'fullname',
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
      name: 'role',
      badge: {
        types: [
          { value: 'USER', type: 'primary', label: 'User' },
          { value: 'STAKEHOLDER', type: 'warning', label: 'Stack Holder' }
        ]
      },
      sortable: true
    },
    {
      hidden: false,
      label: 'Status',
      name: 'isActive',
      badge: {
        types: [
          { value: true, type: 'success', label: 'Active' },
          { value: false, type: 'danger', label: 'Suspended' }
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
      label: 'Created At',
      name: 'createdAt',
      custom: {
        icon: 'ri-time-line me-1 text-muted'
      },
      sortable: false
    }
  ],
  submit: false,
  inputFields: [
    {
      label: 'First Name',
      name: 'firstname',
      inputType: 'text',
      modelValue: '',
      required: true
    },
    {
      label: 'Last Name',
      name: 'lastname',
      inputType: 'text',
      modelValue: '',
      required: true
    },
    {
      label: 'Username',
      name: 'username',
      inputType: 'text',
      modelValue: '',
      required: true
    },
    {
      label: 'Email',
      name: 'email',
      inputType: 'email',
      modelValue: '',
      required: true
    },
    {
      label: 'Password',
      name: 'password',
      inputType: 'password',
      modelValue: '',
      required: true
    },
    {
      label: 'Phone',
      name: 'phone',
      inputType: 'tel', // Changed from 'phone' to 'tel' for better HTML semantics
      modelValue: '',
      required: true,
      placeholder: 'e.g., 08123456789 or +628123456789'
    },
  ]
})

// Renamed function to better reflect its purpose
function updateTableParams() {
  let query = route.query
  if (Object.keys(query).length > 0) {
    state.tableData = { ...state.tableData, ...query }
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

// Use handleSubmit from vee-validate for better form handling
const onSubmit = handleSubmit((values) => {
  // Format phone number before submission
  let form = values
  if (values.phone) {
    form.phone = formatPhoneToInternational(String(values.phone));
  }
  userService.store(form, () => {
    forceRender()
    closeModalAndReset()
    state.submit = true
  }, {
    allowOutsideClick: false,
    allowEscapeKey: false
  })
})

function toggleHeader(header: string) {
  const index = state.columns.findIndex((col) => col.label === header)
  if (index !== -1) {
    state.columns[index].hidden = !state.columns[index].hidden
  }
}

function forceRender() {
  state.componentKey++
}

// Extracted common reset logic
function closeModalAndReset() {
  state.modalAdd = false
  resetForm()
  state.checked = false
}

async function openAddModal() {
  state.modalAdd = true
  resetForm()
  state.checked = false
}

watch(() => route.query, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    state.tableData = { ...state.tableData, ...newValue as Param }
    updateTableParams()
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
            <div class="dropdown-menu p-3 pb-1 fs-11 text-uppercase" id="showHideColumn">
              <div class="form-check form-check-success mb-1 dropdown-item" v-for="(toggle, index) in state.columns"
                :key="`column-${index}`">
                <input class="form-check-input toggle-vis" type="checkbox" :checked="!toggle.hidden"
                  @change="toggleHeader(toggle.label)" />
                {{ toggle.label }}
              </div>
            </div>
            <button class="btn btn-primary btn-sm m-1" @click="openAddModal" type="button"
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

    <ModalBasic :modelValue="state.modalAdd" :title="'Create User'" @toggle="state.modalAdd = $event">
      <template #modalBody>
        <form @submit.prevent="onSubmit">
          <div class="row g-3">
            <div v-for="input in state.inputFields" :key="input.name" class="col-xxl-12">
              <BasicInput :label="input.label" :type="input.inputType" :name="input.name"
                :placeholder="input.placeholder || input.label" :required="input.required"
                v-model="(state.userForm as any)[input.name][0].value" :errors="errors[input.name]" />
            </div>
            <div class="col-12">
              <label class="mt-2 mb-2">Select Role</label>
              <Multiselect v-model="state.userForm.role[0].value" :options="state.options.role"
                placeholder="Select Role" />
              <span v-if="errors.role" class="text-danger">{{ errors.role }}</span>
            </div>
            <div class="col-5">
              <input type="checkbox" id="checkbox" style="margin-right: 4px" v-model="state.checked" />
              <label for="checkbox">Confirm</label>
            </div>
            <div class="col-7">
              <div class="hstack gap-2 justify-content-end">
                <button type="button" class="btn btn-light" @click="closeModalAndReset">
                  Close
                </button>
                <button :disabled="!state.checked" type="submit" class="btn btn-primary">
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