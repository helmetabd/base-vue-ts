import type { BrandOfficerCard, Department, Office, Position, Team } from './Department'
import type { Option, Simple } from './Utils'

export interface EmployeeForm {
  employee: EmployeeUpdateForm
  education: EducationForm
  contract: ContractForm
  placement: PromotionForm
  pandawa_account: boolean
}
export interface EmployeeUpdateForm {
  name: string
  nick_name: string
  phone: string | number
  phone2?: string | number | null
  email: string
  national_id: number | string
  pob: number
  date_of_birth: string
  gender: number
  national_id_address: string
  npwp?: number | null
  current_address: string
  current_district?: string
  ccty: number
  emergency_phone: string | number
  emergency_name: string
  emergency_relations: string
  recruiter: number
  brand_officer?: number
  team?: number
  platform?: number | string
}

export interface BasicEmployee {
  id: number
  name: string
  nick_name: string
  nip: number | string
  photo: any | null
  phone: number | string
  email: string
  gender: number
  status: number
}

export interface EmployeePosition {
  id: number
  name: string
  photo: any | null
  nip: string | number
  position: string
  position_level: number
}

export interface Handler {
  name: string
}

export interface EducationForm {
  education_level: number
  institution?: string | number
  faculty?: string | number
  graduation_year?: number
}

export interface Bank {
  id?: string | number
  bank_name: string
  account: string | number
  on_behalf: string
  created_at?: string
  updated_at?: string
}

export interface BankForm {
  bank_name: string
  account: number
  on_behalf: string
}

export interface InsuranceForm {
  bpjs_number?: string
  bpjs_pu?: string
  bpjs_bpu?: string
  mandiri_inhealth?: string
}

export interface ContractForm {
  contract_date: string
  contract_length: number
  handler: number
}

export interface ResignForm {
  layoff_date: string
  note?: string
  handler: number
  reason: number
}

export interface PromotionForm {
  status: number
  position: number
  department: number
  office: number
  promotion_date: string
  // employee: number
}

export interface MutationForm {
  office: number
  migration_date: string
}

export interface Promotion {
  id: string | number
  date: string
  old_department: Department
  old_position: Position
  new_department: Department
  new_position: Position
  creator: Handler
}

export interface OfficeHistory {
  id: string | number
  date: string
  old_office: Office
  new_office: Office
  creator: Handler
}

export interface Contract {
  id: string | number
  date: string
  contract_length: number
  next_contract_date: string
  processed_by: string
}

export interface Education {
  id: string | number
  education_level: number
  is_graduated: number
  institution: Simple
  faculty: Simple
  created_at: Date
  updated_at: Date
}

export interface Insurance {
  id: string | number
  bpjs_number: string
  bpjs_pu: string
  bpjs_bpu: string
  mandiri_inhealth: string
}

export interface EmployeeDetail {
  basic: BasicEmployee
  personal_data: {
    npwp: string
    national_id: number | string
    national_id_address: string
    place_of_birth: Simple
    date_of_birth: string
    age: number
    current_city: Simple
    current_district: string | null
    current_address: string
    emergency_phone: string | number
    emergency_name: string
    emergency_relations: string
    recruiter: number
    recruiter_name: BasicEmployee
  }
  employment: {
    employment_status: number
    department: Department
    position: Position
    office: Office
    nip: string
    pandawa_account: number
    last_update: string
    employment_length: any
    brand_officer: BrandOfficerCard
    team: Team
    platform: string
  }
  promotion: Promotion[]
  office: OfficeHistory[]
  contracts: Contract[]
  education: Education[]
  bank: Bank
  insurance: Insurance
  creator: Handler
  created_at: string
  updated_at: string
  updater: Handler
}

export interface EmployeeUpdate {
  basic: BasicEmployee
  personal_data: {
    npwp: string
    national_id: number | string
    national_id_address: string
    place_of_birth: Simple
    date_of_birth: string
    age: number
    current_city: Simple
    current_district: string | null
    current_address: string
    emergency_phone: string | number
    emergency_name: string
    emergency_relations: string
    recruiter: number
  }
  brand_officer_id: number | null
  team_id: number | null
  platform_id: number | null
  creator: Handler
  created_at: string
  updated_at: string
  updater: Handler
}

export interface EditEmployee {
  data: EmployeeUpdate
  params: {
    cities: Option[]
    gender: Option[]
    employees: Option[]
    brand_officers: Option[]
    teams: Option[]
    platforms: Option[]
  }
}

export interface EmployeeCard {
  id: number
  name: string
  photo: any | null
  nip: string
  position: Simple
}
