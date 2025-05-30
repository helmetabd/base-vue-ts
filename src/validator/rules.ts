import { helpers, required } from '@vuelidate/validators'

const phoneRules = helpers.withMessage('Invalid phone number', (value?: string) => {
  if (value) {
    return /^(?:\+62|62|0)8[1-9][0-9]{7,10}$/.test(value)
  } else {
    return true
  }
})

export const rulesPromotion = {
  form: {
    status: { required },
    department: { required },
    position: { required },
    promotion_date: { required },
    office: { required }
    // employee: { required }
  }
}

export const rulesMutation = {
  form: {
    migration_date: { required },
    office: { required }
  }
}

export const rulesContract = {
  form: {
    contract_date: { required },
    contract_length: { required },
    handler: { required }
  }
}

export const rulesEmployee = {
  form: {
    name: { required },
    // phone: { required, phoneRules: helpers.regex('phoneRules', phoneNumberRegex()) },
    phone: { required, phoneRules },
    phone2: { phoneRules },
    email: { required },
    national_id: { required },
    pob: { required },
    date_of_birth: { required },
    gender: { required },
    national_id_address: { required },
    current_address: { required },
    ccty: { required },
    emergency_phone: { required, phoneRules },
    emergency_name: { required },
    emergency_relations: { required },
    recruiter: { required }
  }
}

export const rulesResign = {
  form: {
    layoff_date: { required },
    handler: { required },
    reason: { required },
    note: { required }
  }
}

export const rulesEducation = {
  form: {
    education_level: { required },
    institution: { required },
    faculty: { required }
  }
}

export const rulesBank = {
  form: {
    bank_name: { required },
    account: { required },
    on_behalf: { required }
  }
}
