import { FormGroup } from "@angular/forms"
import { distinctUntilChanged } from "rxjs"

export function subFieldHasError(form: FormGroup, fieldName: string, subField: string, error: string ): boolean{
    let field = form.get(fieldName)?.get(subField)
    if (field === null) { return false}
    return field!!.invalid && field!!.touched && field!!.hasError(error)
}

export function fieldHasError(form: FormGroup, fieldName: string, error: string): boolean{
    let field = form.get(fieldName)
    if (field === null) { return false}
    return field?.invalid && field?.touched && field?.hasError(error)
}

export function fieldTouched(form: FormGroup, fieldName: string): boolean {
    let field = form.get(fieldName)
    if (field === null) { return false}
    return field?.invalid && field?.touched
}

export function applyPipeInField(form: FormGroup, fieldName: string, pipe: (value: string) => string) {
    let field = form.get(fieldName)
    field?.valueChanges.pipe(distinctUntilChanged())
    .subscribe( value => { field.setValue(pipe(value)) } )
}

export function applyPipeInSubField(form: FormGroup, fieldName: string, subFieldName: string, pipe: (value: string) => string) {
    let field = form.get(fieldName)?.get(subFieldName)
    field?.valueChanges.pipe(distinctUntilChanged())
    .subscribe( value => { field.setValue(pipe(value)) } )
}