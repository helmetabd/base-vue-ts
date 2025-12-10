import type { Modules, Permission } from './User'

export interface Option {
  label: string | number
  value: number
  color?: string
  parent_category?: string
}
export interface GroupOption {
  label: string
  options: Option[]
}
export interface EditResponse<T, K> {
  data: T
  params: Record<string, K>
}
export interface FormField {
  [key: string]: string | number | null | undefined | string[]
}
export interface SpecialDashboard {
  [key: string]: string | number | undefined | string[]
}
export interface Simple {
  id: number
  name: string
}
export interface links {
  url: string | null
  label: string
  active: boolean
}
export interface ResponseUtils {
  data: any[]
  meta: {
    current_page: number
    from: number
    last_page: number
    links: links[]
    path: string
    per_page: number
    to: number
    total: number
  }
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
}
export interface ResponseRaw {
  data: ResponseUtils
  status: string
  message: string
  code: number
}
export interface PaginationRaw {
  currentPage: number
  firstPageUrl: string
  lastPage: number
  lastPageUrl: string
  nextPageUrl: string | null
  perPage: number
  prevPageUrl: string | null
  total: number
}
export interface PaginationType {
  lastPage: number
  currentPage: number
  from: number
  to: number
  total: number
  links: links[]
  lastPageUrl: string
  nextPageUrl: string | null
  prevPageUrl: string | null
}
export interface Param {
  search?: string
  status?: string
  employment_status?: string
  office?: string
  department?: string
  position?: string
  education?: string
  age?: string
  level?: string
  data?: string
}
interface Series {
  name: string
  type?: string
  data: number[]
}
export interface Dashboard {
  total_employees: {
    total: number
    male: number
    female: number
    male_percentage: number
    female_percentage: number
  }
  turn_over_rate: {
    active: number
    resign: number
    rate: number
  }
  average_age: {
    average_employees_age: number
  }
  annual_growth: {
    xaxis: number[]
    series: Series[]
  }
  position_populate: {
    xaxis: string[]
    series: number[]
  }
  education_level: {
    xaxis: string[]
    series: number[]
  }
  group_populate: {
    xaxis: string[]
    series: number[]
  }
  core_against_support: {
    core: {
      total: number
      male: number
      female: number
    }
    support: {
      total: number
      male: number
      female: number
    }
    total: number
  }
  active_against_resign: {
    total: number
    active: number
    resigned: number
    active_percentage: number
    active_male: number
    active_female: number
    resigned_percentage: number
    resigned_male: number
    resigned_female: number
  }
  growth_against_resign: {
    xaxis: string[]
    series: Series[]
  }
  meta: {
    offices: Option[]
    year: number
    months: Option[]
  }
}
export interface Privilage {
  data: {
    id: number
    nip: number | null
    status: number
    name: string
    email: string
    avatar: string | null
    last_login: string
    permissions: Permission[]
  }
  params: {
    modules: Modules[]
  }
}
export interface Menu {
  name: string
  display_name: string
  icon: string | null
  route: string | null
  module: string
  auth_level_min: number
  admin_required: boolean
  caret: boolean
  childs?: Menu[]
  type?: string
}
export interface Column {
  name: string
  label: string
  sortable: boolean
  checkable?: boolean
  textTypes?: any
  hidden?: boolean
  width?: string
  bold?: boolean
  headerClass?: string
  routeName?: string
  class?: string
  isNumber?: boolean
  targetCollapsed?: boolean
  currency?: string
  fixedNumber?: number
  style?: { [key: string]: string }
  percentage?: { target: string; actual: string }
  custom?: any
  badge?: any
  dateConfig?: any
  offcanvas?: any
  stackedImage?: boolean
  isArray?: boolean
  isFirst?: boolean
  isLast?: boolean
  defaultValue?: any
  display?: string
  customizeRow?: boolean
  customizeHeader?: boolean
  truncate?: boolean
  link?: boolean
  params?: { id: string; date: any }
  isIndex?: boolean
  startIndex?: number
}
