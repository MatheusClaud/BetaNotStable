import { IAddress } from "./address-interface"
import { IRole } from "./role-interface"
import { IViaCepAddress } from "../response/address-api/IViaCepAddress"

export class IUser {
    token: string = ''
    language: string = ''
    id: string = ''
    email: string = ''
    name: string = ''
    birthAt: string = ''
    taxId: string = ''
    phoneNumber: string = ''
    isActive: string = ''
    acceptMarketing: string = ''
    createdAt: string = ''
    updatedAt: string = ''
    role: IRole | null = null
    address: IAddress | null = null

    buildFromViaCep(address: IViaCepAddress): IAddress {
        const newAddress = new IAddress();
        newAddress.city = address.localidade;
        newAddress.country = "Brasil";
        newAddress.neighbourhood = address.bairro;
        newAddress.street = address.logradouro;
        newAddress.zipCode = address.cep;
        return newAddress;
    }
}