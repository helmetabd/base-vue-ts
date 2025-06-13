import * as yup from 'yup'

const phoneValidation = yup.string().test(
  'phone-format',
  'Invalid phone number',
  (value) => {
    if (!value) return true
    return /^(?:\+62|62|0)8[1-9][0-9]{7,10}$/.test(value)
  }
)

export const rulesPromotion = yup.object({
  status: yup.string().required('Status is required'),
  department: yup.string().required('Department is required'),
  position: yup.string().required('Position is required'),
  promotion_date: yup.date().required('Promotion date is required'),
  office: yup.string().required('Office is required')
  // employee: yup.string().required('Employee is required')
})

export const rulesMutation = yup.object({
  migration_date: yup.date().required('Migration date is required'),
  office: yup.string().required('Office is required')
})

export const rulesContract = yup.object({
  contract_date: yup.date().required('Contract date is required'),
  contract_length: yup.string().required('Contract length is required'),
  handler: yup.string().required('Handler is required')
})

export const rulesEmployee = yup.object({
  name: yup.string().required('Name is required'),
  phone: yup.string().required('Phone is required').concat(phoneValidation),
  phone2: phoneValidation,
  email: yup.string().email('Invalid email').required('Email is required'),
  national_id: yup.string().required('National ID is required'),
  pob: yup.string().required('Place of birth is required'),
  date_of_birth: yup.date().required('Date of birth is required'),
  gender: yup.string().required('Gender is required'),
  national_id_address: yup.string().required('National ID address is required'),
  current_address: yup.string().required('Current address is required'),
  ccty: yup.string().required('CCTY is required'),
  emergency_phone: yup.string().required('Emergency phone is required').concat(phoneValidation),
  emergency_name: yup.string().required('Emergency name is required'),
  emergency_relations: yup.string().required('Emergency relations is required'),
  recruiter: yup.string().required('Recruiter is required')
})

export const rulesResign = yup.object({
  layoff_date: yup.date().required('Layoff date is required'),
  handler: yup.string().required('Handler is required'),
  reason: yup.string().required('Reason is required'),
  note: yup.string().required('Note is required')
})

export const rulesEducation = yup.object({
  education_level: yup.string().required('Education level is required'),
  institution: yup.string().required('Institution is required'),
  faculty: yup.string().required('Faculty is required')
})

export const rulesBank = yup.object({
  bank_name: yup.string().required('Bank name is required'),
  account: yup.string().required('Account is required'),
  on_behalf: yup.string().required('On behalf is required')
})
