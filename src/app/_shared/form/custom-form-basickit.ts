import { inject } from "@angular/core"
import { FormBuilder, FormGroup } from "@angular/forms"
import { fieldHasError, fieldTouched, subFieldHasError } from "./custom-form-modifier"
import { ErrorAge, ErrorEmail, ErrorMinLength, ErrorPasswordValid, ErrorRequired } from "./custom-validators"

export class IFormBasicKit {
  fb = inject(FormBuilder)
  form: FormGroup = this.fb.group({})

  errorRequired = ErrorRequired
  errorAge = ErrorAge
  errorMinLength = ErrorMinLength
  errorEmail = ErrorEmail
  errorPasswordValid = ErrorPasswordValid

  subFieldHasError(fieldName: string, subField: string, error: string ): boolean {
    return subFieldHasError(this.form!!, fieldName, subField, error)
  }

  fieldHasError(fieldName: string, error: string): boolean {
    return fieldHasError(this.form!!, fieldName, error)
  }

  fieldTouched(fieldName: string): boolean {
    return fieldTouched(this.form!!, fieldName)
  }
}