import type { Modules, Permission } from './User'

export interface Option {
  label: string | number
  value: number
  department?: number
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
