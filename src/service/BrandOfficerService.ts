import type { BrandOfficerForm } from '@/interfaces/Department'
import apiClient from './ApiClientService'
import { responseHelper } from '@/utils/responseHelper'

export async function index() {
  return apiClient.get('/brand-officers').then((res) => res.data)
}

export async function store(data: BrandOfficerForm) {
  return apiClient
    .post(`/brand-officers`, data)
    .then((res) => responseHelper('success', res))
    .catch((e) => responseHelper('error', e))
}

export async function show(id: string | string[] | number) {
  return apiClient.get(`/brand-officers/${id}`).then((res) => res.data)
}

export async function update(id: number | string | string[], data: BrandOfficerForm) {
  return apiClient
    .patch(`/brand-officers/${id}`, data)
    .then((res) => responseHelper('success', res))
    .catch((e) => responseHelper('error', e))
}

export async function destroy(id: number | string | string[], fetch: Function) {
  apiClient
    .delete(`/brand-officers/${id}`)
    .then((res) => responseHelper('success', res, undefined, fetch))
    .catch((e) => responseHelper('error', e))
}
