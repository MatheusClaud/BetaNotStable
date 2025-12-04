import { inject, Injectable, linkedSignal, signal } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IUser } from "../../../models/entity/user-interface";
import { SingInData } from "../../../models/request/singin-data";

@Injectable({
  providedIn: 'root'
})
export class UserApi {
  
  #http = inject(HttpClient)
  #baseUrl = signal(environment.api)
  #url = linkedSignal(() => { return this.#baseUrl() + "/api/user" })

  public getUser(): Observable<any> {
    return this.#http.get(this.#url())
  }

  public createUser(user: SingInData): Observable<any> {
    return this.#http.post(this.#url(), user)
  }

  public updateUser(user: IUser): Observable<any> {
    return this.#http.patch(this.#url(), user)
  }

  public updateUserPassword(pass: string): Observable<any> {
    return this.#http.patch(this.#url() + "/password", { password: pass })
  }
}