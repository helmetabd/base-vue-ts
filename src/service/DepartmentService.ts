import type { DepartmentForm } from '@/interfaces/Department'
import apiClient from './ApiClientService'
import { responseHelper } from '@/utils/responseHelper'

export async function index() {
  return apiClient.get('/departments').then((res) => res.data)
}

export async function map() {
  return apiClient.get('/departments/map').then((res) => res.data)
}

export async function store(data: DepartmentForm) {
  return apiClient
    .post('/departments', data)
    .then((res) => responseHelper('success', res))
    .catch((e) => responseHelper('error', e))
}

export async function show(id: string | string[] | number) {
  return apiClient.get(`/departments/${id}`).then((res) => res.data)
}

export async function update(id: number | string | string[], data: DepartmentForm) {
  return apiClient
    .patch(`/departments/${id}`, data)
    .then((res) => responseHelper('success', res))
    .catch((e) => responseHelper('error', e))
}
