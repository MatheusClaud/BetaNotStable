import { AbstractControl, ValidationErrors } from "@angular/forms"

export const ErrorRequired = 'required';
export const ErrorAge = 'invalidAge';
export const ErrorMinLength = 'minlength';
export const ErrorEmail = 'email';
export const ErrorPasswordValid = "passwordValid";

export function minimumAgeValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value == null) {
      return null
    }

    if (control.value.length > 10) {
      control.setValue(control.value.slice(0, 10))
    }

    const [day, month, year] = control.value.split('/')
    const birthday = new Date(+year, +month, +day)
    const birthdayYear = birthday.getFullYear()
    const currentYear = new Date().getFullYear()

    if (currentYear - birthdayYear < 18) {
      return { 'invalidAge': true }
    }

    return null
}

export function passwordFormatValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value == null) {
        return null
    }

    let isPasswordValid =
        control.value.length > 7 &&
        /[A-Z]/.test(control.value) &&
        /\d/.test(control.value) &&
        /[^A-Za-z0-9]/.test(control.value)

    if (!isPasswordValid) {
        return { 'passwordValid': true }
    }

    return null
}