import apiClient from './ApiClientService'
import { responseHelper } from '@/utils/responseHelper'
import type {
  BankForm,
  ContractForm,
  EditEmployee,
  EducationForm,
  EmployeeDetail,
  EmployeeForm,
  EmployeeUpdateForm,
  InsuranceForm,
  MutationForm,
  PromotionForm,
  ResignForm
} from '@/interfaces/Employee'

export async function store(data: EmployeeForm, functionRouter: Function) {
  return apiClient
    .post('/employees', data)
    .then((res) => responseHelper('success', res, undefined, functionRouter))
    .catch((e) => responseHelper('error', e))
}
export async function storePromotion(id: number | string | string[], data: PromotionForm) {
  return apiClient
    .post(`/employees/${id}/promotion`, data)
    .then((res) => responseHelper('success', res))
    .catch((e) => responseHelper('error', e))
}
export async function storeContract(id: number | string | string[], data: ContractForm) {
  return apiClient
    .post(`/employees/${id}/contracts`, data)
    .then((res) => responseHelper('success', res))
    .catch((e) => responseHelper('error', e))
}
export async function storeMutation(id: number | string | string[], data: MutationForm) {
  return apiClient
    .post(`/employees/${id}/migrate-office`, data)
    .then((res) => responseHelper('success', res))
    .catch((e) => responseHelper('error', e))
}
export async function storeResign(id: number | string | string[], data: ResignForm) {
  return apiClient
    .post(`/employees/${id}/layoff`, data)
    .then((res) => responseHelper('success', res))
    .catch((e) => responseHelper('error', e))
}
export async function storeEducation(id: number | string | string[], data: EducationForm) {
  return apiClient
    .post(`/employees/${id}/educations`, data)
    .then((res) => responseHelper('success', res))
    .catch((e) => responseHelper('error', e))
}
export async function storeBank(id: number | string | string[], data: BankForm) {
  return apiClient
    .patch(`/employees/${id}/bank-account`, data)
    .then((res) => responseHelper('success', res))
    .catch((e) => responseHelper('error', e))
}
export async function storeInsurance(id: number | string | string[], data: InsuranceForm) {
  return apiClient
    .patch(`/employees/${id}/insurances`, data)
    .then((res) => responseHelper('success', res))
    .catch((e) => responseHelper('error', e))
}
export async function show(id: string | string[] | number): Promise<EmployeeDetail> {
  return apiClient.get(`/employees/${id}`).then((res) => res.data)
}
export async function edit(id: string | string[] | number): Promise<EditEmployee> {
  return apiClient.get(`/employees/${id}/edit`).then((res) => res as object as EditEmployee)
}
export async function update(
  id: number | string | string[],
  data: EmployeeUpdateForm,
  functionRouter: Function
) {
  return apiClient
    .patch(`/employees/${id}`, data)
    .then((res) => responseHelper('success', res, undefined, functionRouter))
    .catch((e) => responseHelper('error', e))
}
export async function destroy(url: string, fetch: Function) {
  apiClient
    .delete(url)
    .then((res) => responseHelper('success', res, undefined, fetch))
    .catch((e) => responseHelper('error', e))
}
export async function updateImage(
  id: number | string | string[],
  data: FormData,
  reloadFunction: Function
) {
  apiClient
    .post(`employees/${id}/photo`, data, {
      headers: {
        'Content-Type': `undefined`
      }
    })
    .then((res) => {
      if (typeof reloadFunction === 'function')
        responseHelper('success', res, undefined, reloadFunction)
    })
    .catch((err) => {
      responseHelper('error', err)
    })
}
export async function removeOption(
  type: 'institution' | 'faculty',
  id: number,
  fetch: void | Function
) {
  apiClient
    .delete(`utilities/educations/${type}/${id}`)
    .then((res) => responseHelper('success', res, undefined, fetch))
    .catch((e) => {
      if (e.code == 'ERR_NETWORK' && e.message == 'Network Error') {
        responseHelper('error', undefined, `This ${type} is used by other employees`)
      } else {
        responseHelper('error', e)
      }
    })
}
