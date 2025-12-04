
export class IReusableField {
    controlKey: string = ''
    label: string = ''
    placeholder: any = null
    errors: Array<IErrorToValidate> = []
    pipe: (value: string) => string = emptyPipe

    constructor(
        controlKey: string,
        label: string,
        placeholder: string,
        errors: Array<IErrorToValidate> = [],
        pipe: (value: string) => string = emptyPipe
    ) {
        this.controlKey = controlKey
        this.label = label
        this.placeholder = placeholder
        this.errors = errors
        this.pipe = pipe
    }
}

export class IErrorToValidate {
    validatorKey: string = ''
    errorMessage: string = ''
    validatorParameter: any = null

    constructor(key: string, message: string, parameter: any = null) {
        this.validatorKey = key
        this.errorMessage = message
        this.validatorParameter = parameter
    }
}

export enum IFieldType {
    SELECT_DAYS_OF_WEEK, //
    OPEN_HOURS, //
    SINGLE_IMAGE, //
    MULTIPLE_IMAGES //
}

function emptyPipe(str: string) {
    return str
}