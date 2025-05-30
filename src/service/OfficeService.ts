import type { Position } from '@/interfaces/Department'
import apiClient from './ApiClientService'
import { responseHelper } from '@/utils/responseHelper'

export async function index() {
  return apiClient.get('/offices').then((res) => res.data)
}

export async function create() {
  return apiClient.get('/offices/create').then((res) => res.data.level)
}

export async function store(data: Position) {
  return apiClient
    .post('/offices', data)
    .then((res) => responseHelper('success', res))
    .catch((e) => responseHelper('error', e))
}

export async function show(id: string | string[] | number) {
  return apiClient.get(`/offices/${id}`).then((res) => res.data)
}

export async function update(id: number | string | string[], data: Position) {
  return apiClient
    .patch(`/offices/${id}`, data)
    .then((res) => responseHelper('success', res))
    .catch((e) => responseHelper('error', e))
}
