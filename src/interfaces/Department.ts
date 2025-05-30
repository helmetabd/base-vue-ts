import type { BasicEmployee, EmployeeCard, EmployeePosition } from './Employee'
import type { Simple } from './Utils'

export interface DepartmentForm {
  display_name: string
  parent?: number
  category: number
}

export interface TeamForm {
  display_name: string
  type?: number
  leader_id: number | EmployeeCard
  brand_officer_id?: number
  department_id?: number
}

export interface PositionForm {
  name: string
  level: number
  department: number
  group?: number
}

export interface Office {
  id: number
  name: string
  code: string
  address: string
  employees?: BasicEmployee[]
  employee_count?: number
}

export interface Department {
  id: number
  name: string
  parent?: Department | null
  employee_count?: number
  category?: string
}

export interface DepartmentDetail {
  id: number
  name: string
  category: number
  positions?: Position[]
  employees: EmployeePosition[]
  employee_count: number
  position_count?: number
  parent?: Department | null
  childs?: Department[]
  teams?: Team[] | null
}

export interface Position {
  id?: number
  name: string
  level: number
  level_name: string
  employee_count?: number
  department?: {
    id: number
    name: string
  }
  created_at?: string
  updated_at?: string
}

export interface Team {
  id: number
  name: string
  leader: EmployeeCard
  type: number | null
  type_name: string | null
  member_count: number
  creator: {
    id: number
    name: string
    avatar: any | null
  }
  created_at: string
}

export interface BrandOfficer {
  id: number
  name: string
  color: string
  creator: {
    id: number
    name: string
    avatar: any | null
  }
  created_at: string
  member_count: number
}

export interface PositionGroup {
  id: number
  name: string
  display_name: string
  created_at: string
  update_at: string
  member_count: number
  members?: EmployeeCard[]
}

export interface BrandOfficerDetail {
  id: number
  name: string
  display_name: string
  color: string
  creator: {
    id: number
    name: string
    avatar: any | null
  }
  updater: {
    id: number
    name: string
    avatar: any | null
  }
  created_at: string
  updated_at: string
  member_count: number
  members: EmployeeCard[]
}

export interface BrandOfficerForm {
  display_name: string
  color: string
}

export interface BrandOfficerCard {
  id: number
  name: string
  color: string
}

export interface TeamDetail {
  id: number
  name: string
  display_name: string
  department: Simple
  leader: EmployeeCard
  brand_officer: BrandOfficerCard
  member_count: number
  members: EmployeeCard[]
  type: number | null
  type_name: string | null
  creator: {
    id: number
    name: string
    avatar: any | null
  }
  updater: {
    id: number
    name: string
    avatar: any | null
  }
  created_at: string
  updated_at: string
}

export interface PositionDetail {
  id: number
  name: string
  level: number
  level_name: string
  department: Department
  employee?: BasicEmployee[]
  group: PositionGroup
  created_at: Date
  updated_at: Date
}

export interface DepartmentMap {
  id: number
  name: string
  positions: Position[]
  children: DepartmentMap[]
}

export interface DepartmentMapResponse {
  id: number
  name: string
  positions: Position[]
  parent: {
    id: number
    name: string
  } | null
}
