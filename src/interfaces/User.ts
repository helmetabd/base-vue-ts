import type { Option } from './Utils'

export interface State {
  user: User
  userId: string | string[]
  profileModal: boolean
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
  status: number
  name: string
  nickname: string | null
  phone: string | null
  email: string
  avatar: string | null
  last_login: string
  role: Role
  created_at: string
  updated_at: string
  creator: SimpleUser
  updater: SimpleUser
}
export interface UserEdit {
  id: number
  role_id: number
  status: number
  name: string
  nickname: string | null
  phone: string | null
  password?: string
  email: string
  avatar: string | null
  last_login: string | null
  created_by: number
  updated_by: number
  remember_token: string | null
  created_at: string
  updated_at: string
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
export interface SimpleUser {
  id: number
  name: string
  avatar: string | null
}
export interface UserStore {
  id: number
  avatar: string | null
  name: string
  nickname: string | null
  status: number
}
