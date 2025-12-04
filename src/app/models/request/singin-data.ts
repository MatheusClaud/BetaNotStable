import { IAddress } from "../entity/address-interface"

export class SingInData {
    email: string = ''
    password: string = ''
    name: string = ''
    acceptMarketing: boolean = false
    birthAt: string = ''
    taxId: string = ''
    phoneNumber: string = ''
    address: IAddress | null = null

    constructor(
        init?: Partial<SingInData>
    ) {
        Object.assign(this, init)
        this.phoneNumber = '+55' + this.removeNonNumbers(this.phoneNumber)
        this.taxId = this.removeNonNumbers(this.taxId)
        this.birthAt = this.formatDataToServer(this.birthAt)
        if (this.address !== null) { this.address.country = 'Brasil' }
    }

    public removeNonNumbers(value: string) {
        return value.replace(/\D/g, '')
    }

    public formatDataToServer(value: string) {
        let split = value.split('/')
        return split[2] + "-" + split[1] + "-" + split[0]
    }
}
