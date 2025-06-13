import type { Option } from './Utils'

export interface Role {
  id: number
  name: string
}

export interface User {
  id: string
  isActive: boolean
  username: string,
  firstname: string
  lastname: string
  fullname: string
  email: string
  avatar: string | null
  createdAt: string
  updatedAt: string
  role: string,
  phone: string
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
