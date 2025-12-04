import { HttpClient } from '@angular/common/http';
import { inject, Injectable, linkedSignal, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoginData } from '../../../models/request/login-data';
import { ForgotData } from '../../../models/request/forget-data';
import { ResetData } from '../../../models/request/reset-data';

@Injectable({
  providedIn: 'root'
})
export class AuthApi {
  #http = inject(HttpClient)
  #baseUrl = signal(environment.api)
  #url = linkedSignal(() => { return this.#baseUrl() + "/api/auth/" })

  public login(data: LoginData): Observable<any> {
    return this.#http
      .post(this.#url() + "login", data)
  }

  public forgotPassword(data: ForgotData): Observable<any> {
    return this.#http
      .post(this.#url() + "forget", data)
  }

  public resetPassword(data: ResetData): Observable<any> {
    return this.#http
      .post(this.#url() + "reset", data)
  }
}
