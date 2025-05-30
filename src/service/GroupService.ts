import apiClient from './ApiClientService'
import { responseHelper } from '@/utils/responseHelper'

export async function index() {
  return apiClient.get('/position-group').then((res) => res.data)
}

export async function store(data: { name: string }) {
  return apiClient
    .post('/position-group', data)
    .then((res) => responseHelper('success', res))
    .catch((e) => responseHelper('error', e))
}

export async function show(id: string | string[] | number) {
  return apiClient.get(`/position-group/${id}`).then((res) => res.data)
}

export async function update(id: number | string | string[], data: { name: string }) {
  return apiClient
    .patch(`/position-group/${id}`, data)
    .then((res) => responseHelper('success', res))
    .catch((e) => responseHelper('error', e))
}

export async function destroy(id: number | string | string[], fetch: Function) {
  apiClient
    .delete(`/position-group/${id}`)
    .then((res) => responseHelper('success', res, undefined, fetch))
    .catch((e) => responseHelper('error', e))
}
