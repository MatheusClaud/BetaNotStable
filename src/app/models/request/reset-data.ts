export class ResetData {
    token: string
    password: string

    constructor(
        token: string,
        password: string
    ) {
        this.token = token
        this.password = password
    }
}
