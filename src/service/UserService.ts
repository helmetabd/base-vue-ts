import type { Permission, UserEdit } from "@/interfaces/User";
import apiClient from "./ApiClientService";
import type { Privilage } from "@/interfaces/Utils";
import { responseHelper } from "@/utils/responseHelper";

export async function index() {
  return apiClient.get("/users").then((res) => res.data);
}

export async function store(
  data: object,
  functionConfirm: Function,
  options: object
) {
  return apiClient
    .post("/users", data)
    .then((res) =>
      responseHelper("success", res, undefined, functionConfirm, false, options)
    )
    .catch((e) => responseHelper("error", e));
}

export async function detail(id: string) {
  return apiClient.get(`/users/${id}`).then((res) => res.data);
}

export async function update(
  id: string,
  data: object,
  functionConfirm: Function,
  options: object
) {
  return apiClient
    .patch(`/users/${id}`, data)
    .then((res) =>
      responseHelper("success", res, undefined, functionConfirm, false, options)
    )
    .catch((e) => responseHelper("error", e));
}

export async function destroy(id: string, fetch: Function) {
  apiClient
    .delete(`/users/${id}`)
    .then((res) => responseHelper("success", res, undefined, fetch))
    .catch((e) => responseHelper("error", e));
}
