import { inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { IViaCepAddress } from "../../../models/response/address-api/IViaCepAddress";

@Injectable({
  providedIn: 'root'
})
export class CepApi {

  #baseUrl = signal(environment.viaCepAPI)

  #http = inject(HttpClient)

  public searchCep(cep: string): Observable<IViaCepAddress> {
    return this.#http.get<IViaCepAddress>(`${this.#baseUrl()}/${cep}/json/`);
  }
}