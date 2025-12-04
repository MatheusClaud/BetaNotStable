import { IAddress } from "../../entity/address-interface";

export class IViaCepAddress {
  erro: string = '';
  cep: string = '';
  logradouro: string = '';
  complemento: string = '';
  bairro: string = '';
  localidade: string = '';
  uf: string = '';
  ibge: string = '';
  gia: string = '';
  ddd: string = '';
  siafi: string = '';
}

export const ERROR_ON_CEP_REQUEST = "true"