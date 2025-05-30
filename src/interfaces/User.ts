import type { BasicEmployee } from './Employee'
import type { FormField, Option } from './Utils'

export interface State {
  user: User
  userId: string | string[]
  userProfileFormField: FormField
  profileModal: boolean
  pandawaModal: boolean
  inputProfile: {
    id: number
    label: string
    name: keyof FormField
    inputType: string
    modelValue: string | number
    required?: boolean
  }[]
  checked: boolean
  userLogsColumns: {
    label: string
    name?: string
    class: string
    target?: boolean
    setter?: boolean
  }[]
  userAccountLogsColumns: {
    label: string
    name?: string
    class: string
    setter?: boolean
  }[]
  editParams: {
    status: Option[]
    role: Option[]
  }
}

export interface Role {
  id: number
  name: string
}

export interface User {
  id: number
  nip: number | null
  status: number
  name: string
  email: string
  avatar: string | null
  last_login: string
  role: Role
  employee: BasicEmployee
}

export interface UserEdit {
  data: {
    id: number
    role_id: number
    status: number
    name: string
    email: string
    avatar: string | null
    last_login: string | null
    created_by: number
    updated_by: number
    remember_token: string | null
    created_at: string
    updated_at: string
  }
  params: {
    role: Option[]
    status: Option[]
  }
}

export interface Permission {
  id: number
  module_name: string
  create: number | boolean
  read: number | boolean
  update: number | boolean
  under_only?: boolean | null
}

export interface Modules {
  id: number
  parent_id?: number
  name: string
  display_name: string
  create: number
  read: number
  update: number
  under_only?: boolean | null
  childs: Modules[]
}
