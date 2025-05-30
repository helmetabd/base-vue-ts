import type { TeamForm } from '@/interfaces/Department'
import apiClient from './ApiClientService'
import { responseHelper } from '@/utils/responseHelper'

export async function store(data: TeamForm, fetch: Function) {
  return apiClient
    .post(`/teams`, data)
    .then((res) => responseHelper('success', res, undefined, fetch))
    .catch((e) => responseHelper('error', e))
}

export async function show(id: string | string[] | number) {
  return apiClient.get(`/teams/${id}`).then((res) => res.data)
}

export async function update(id: number | string | string[], data: TeamForm) {
  return apiClient
    .patch(`/teams/${id}`, data)
    .then((res) => responseHelper('success', res))
    .catch((e) => responseHelper('error', e))
}

export async function destroy(id: number | string | string[], fetch: Function) {
  apiClient
    .delete(`/teams/${id}`)
    .then((res) => responseHelper('success', res, undefined, fetch))
    .catch((e) => responseHelper('error', e))
}
