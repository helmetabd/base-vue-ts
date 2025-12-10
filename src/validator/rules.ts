import * as yup from 'yup'

export const phoneValidation = yup.string().test(
  'indonesian-phone-format',
  'Please enter a valid Indonesian phone number (e.g., 08123456789, 628123456789, or +628123456789)',
  (value) => {
    if (!value) return true
    return /^(?:\+62|62|0)8[1-9][0-9]{7,10}$/.test(value)
  }
)
