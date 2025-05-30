import { responseHelper } from '@/utils/responseHelper'
import apiClient from './ApiClientService'
import type { Dashboard, PaginationType, ResponseUtils } from '@/interfaces/Utils'
import type { AxiosError } from 'axios'

export async function searchLocation(field: any, search: any, parent: any) {
  return apiClient
    .get(`/utilities/search/location?field=${field}&search=${search}&parent_id=${parent}`)
    .then((res) => res.data)
}

export async function searchEmployee(search: any) {
  return apiClient
    .get(`/utilities/select-employee`, { params: { name: search } })
    .then((res) => res.data)
}

export async function getPandawaUser(params: string) {
  return apiClient.get(`/utilities/get-pandawa-user?pandawa_email=${params}`).then((res) => res.data)
}

export async function searchEmployeeNumber(type: any) {
  return apiClient
    .get(`/utilities/get-employee-numbers`, { params: { group_id: type } })
    .then((res) => res.data)
}

export async function searchParams(url: string) {
  return apiClient
    .get(url)
    .then((res) => res.data)
    .catch((e) => responseHelper('error', e))
}

export async function fetchIndex(
  url: string,
  params: any
): Promise<{ data: any[]; pagination: PaginationType }> {
  let data: any[] = []
  let pagination = {} as PaginationType
  try {
    const result: ResponseUtils = await apiClient.get(url, { params })

    data = result.data

    pagination = {
      lastPage: result.meta.last_page,
      currentPage: result.meta.current_page,
      from: result.meta.from,
      to: result.meta.to,
      total: result.meta.total,
      links: result.meta.links,
      lastPageUrl: result.links.last,
      nextPageUrl: result.links.next,
      prevPageUrl: result.links.prev
    }
  } catch (e) {
    responseHelper('error', e as AxiosError) // Ensure this function exists
  }
  return { data, pagination }
}

export async function crmList() {
  return apiClient.get('/utils/get-crm-staffs').then((res) => res.data)
}

export async function productList() {
  return apiClient.get('/utils/get-products').then((res) => res.data)
}

export async function fetchDashboard(params: any): Promise<Dashboard> {
  let data: Dashboard = {
    total_employees: {
      total: 0,
      male: 0,
      female: 0,
      male_percentage: 0,
      female_percentage: 0
    },
    turn_over_rate: {
      active: 0,
      resign: 0,
      rate: 0
    },
    average_age: {
      average_employees_age: 0
    },
    annual_growth: {
      xaxis: [],
      series: []
    },
    position_populate: {
      xaxis: [],
      series: []
    },
    education_level: {
      xaxis: [],
      series: []
    },
    group_populate: {
      xaxis: [],
      series: []
    },
    core_against_support: {
      core: {
        total: 0,
        male: 0,
        female: 0
      },
      support: {
        total: 0,
        male: 0,
        female: 0
      },
      total: 0
    },
    active_against_resign: {
      total: 0,
      active: 0,
      resigned: 0,
      active_percentage: 0,
      active_male: 0,
      active_female: 0,
      resigned_percentage: 0,
      resigned_male: 0,
      resigned_female: 0
    },
    growth_against_resign: {
      xaxis: [],
      series: []
    },
    meta: {
      offices: [],
      year: 0,
      months: []
    }
  }
  try {
    const result: any = await apiClient.get('/dashboard', { params }).then((res) => res)
    data = result
  } catch (error) {
    responseHelper('error', error as AxiosError)
  }
  return { ...data }
}
