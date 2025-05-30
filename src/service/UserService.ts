import type { Permission, UserEdit } from '@/interfaces/User'
import apiClient from './ApiClientService'
import type { Privilage } from '@/interfaces/Utils'
import { responseHelper } from '@/utils/responseHelper'

export async function index() {
  return apiClient.get('/users').then((res) => res.data)
}

export async function create() {
  return apiClient.get('/users/create').then((res) => res.data)
}

export async function store(data: object) {
  return apiClient.post('/users', data).then((res) => res)
}

export async function detail(id: number) {
  return apiClient.get(`/users/${id}`).then((res) => res.data)
}

export async function edit(id: number): Promise<UserEdit> {
  return apiClient.get(`/users/${id}/edit`).then((res) => res as object as UserEdit)
}

export async function update(id: number, params: any) {
  return apiClient.patch(`/users/${id}`, params).then((res) => res)
}

export async function fixPandawa(id: number, payload: any) {
  return apiClient.post(`/users/${id}/fix-pandawa`, payload).then((res) => res)
}

export async function fixPrivilege(id: number) {
  return apiClient.get(`/users/${id}/permissions/fix`).then((res) => res)
}

export async function privileges(id: number): Promise<Privilage> {
  return apiClient.get(`/users/${id}/permissions`).then((res) => res as object as Privilage)
}

export async function templatePrivileges(): Promise<Privilage> {
  return apiClient.get(`/user/users/privilege-template`).then((res) => res as object as Privilage)
}

export async function updatePrivileges(id: number, privileges: Permission[]) {
  return apiClient
    .put(`/users/${id}/permissions`, { permissions: privileges })
    .then((res) => responseHelper('success', res))
}

export async function updateTemplate(privileges: Permission[]) {
  return apiClient
    .put(`/user/users/privilege-template`, { permissions: privileges })
    .then((res) => responseHelper('success', res))
}
