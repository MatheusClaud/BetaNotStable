import { IViaCepAddress } from "../response/address-api/IViaCepAddress"

export class IAddress {
    id: string = ''
    street: string = ''
    complement: string = ''
    city: string = ''
    neighbourhood: string = ''
    number: string = ''
    country: string = ''
    zipCode: string = ''


    buildFromViaCep(address: IViaCepAddress): IAddress {
        this.city = address.localidade
        this.country = "Brasil"
        this.neighbourhood = address.bairro
        this.street = address.logradouro
        this.zipCode = address.cep
        return this
    }
}