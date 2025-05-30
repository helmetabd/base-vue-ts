import Swal from 'sweetalert2'
import { type AxiosResponse, AxiosError } from 'axios'

type ResponseType = 'success' | 'error' | 'warning'

export interface ResponseData {
  message?: string
  data?: object
}

export function responseHelper(
  type: ResponseType, // Now the first parameter
  // res?: AxiosResponse | AxiosError, // Made optional and second
  res?: ResponseData | AxiosError, // Made optional and second
  message?: string,
  onConfirm?: Function | void,
  cancelButton: boolean = false
): void {
  const isAxiosError = (error: any): error is AxiosError => {
    return !!(error && error.isAxiosError)
  }

  // Case when type is 'success'
  if (type === 'success') {
    Swal.fire({
      title: 'Success',
      text:
        res && 'message' in res
          ? res.message || 'Operation successful'
          : message || 'Berhasil Menyimpan Data',
      icon: 'success',
      showCancelButton: cancelButton, // Remove cancel button for success
      confirmButtonText: 'OK'
    }).then((e) => {
      if (e.isConfirmed && typeof onConfirm === 'function') {
        onConfirm() // Execute the custom callback if the user confirms
      }
    })
  }
  // Case when type is 'error'
  else if (type === 'error') {
    if (res) {
      if ('response' in res && res.response && (res.response as AxiosResponse).data) {
        const errorMessage =
          (res.response as AxiosResponse<{ message?: string }>).data?.message || 'Unknown error'
        Swal.fire('Error', errorMessage, 'error')
      } else if (isAxiosError(res) && res.message) {
        Swal.fire('Error', res.message, 'error')
      } else if ('message' in res) {
        Swal.fire('Error', res.message as string, 'error')
      }
    } else {
      Swal.fire('Error', message ? message : 'Gagal Menghubungi Server', 'error')
    }
  } else if (type === 'warning') {
    Swal.fire('Warning', message ? message : 'Warning', 'warning')
  }
}
