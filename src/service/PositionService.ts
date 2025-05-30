import type { PositionForm } from '@/interfaces/Department'
import apiClient from './ApiClientService'
import { responseHelper } from '@/utils/responseHelper'

export async function index() {
  return apiClient.get('/positions').then((res) => res.data)
}

export async function create() {
  return apiClient.get('/positions/create').then((res) => res.data)
}

export async function store(data: PositionForm) {
  return apiClient
    .post('/positions', data)
    .then((res) => responseHelper('success', res))
    .catch((e) => responseHelper('error', e))
}

export async function show(id: string | string[] | number) {
  return apiClient.get(`/positions/${id}`).then((res) => res.data)
}

export async function update(id: number | string | string[], data: PositionForm) {
  return apiClient
    .patch(`/positions/${id}`, data)
    .then((res) => responseHelper('success', res))
    .catch((e) => responseHelper('error', e))
}
