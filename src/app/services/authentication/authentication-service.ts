import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AuthApi } from '../api/auth/auth-api';
import { LoginData } from '../../models/request/login-data';
import { LoginResponse } from '../../models/response/login-response';
import { TokenService } from '../token/token-service';
import { UserApi } from '../api/user/user-api';
import { IUser } from '../../models/entity/user-interface';
import { StoreApi } from '../api/store/store-api';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  #api = inject(AuthApi)
  #userApi = inject(UserApi)
  #storeApi = inject(StoreApi)
  #tokenService = inject(TokenService)

  #loggedUser = signal<IUser | null>(null)
  public getLoggedUser = this.#loggedUser.asReadonly()

  #loginError = signal<boolean>(false)
  public getLoginError = this.#loginError.asReadonly()

  #loggedUserStores = signal<any>(null)
  public getLoggedUserStores = this.#loggedUserStores.asReadonly()

  #processHasFinished = signal<boolean>(false)
  public getProcessHasFineshed = this.#processHasFinished.asReadonly()

  public removeUserInfo() {
    this.#loginError.set(false)
    this.#loggedUser.set(null)
    this.#loggedUserStores.set(null)
    this.#processHasFinished.set(false)
    this.#tokenService.removeToken()
  }

  loginProcessError = (
    (error: HttpErrorResponse) => {
      this.onLoginError()
      return throwError(() => error)
    }
  )

  public checkSession() {
    if (this.#tokenService.getToken() !== null) {
      this.loadUser().subscribe()
    }
  }

  public doLogin(data: LoginData): Observable<any> {
    this.removeUserInfo()
    return this.#api.login(data)
      .pipe(
        tap((res: LoginResponse) => {
          this.#tokenService.setToken(res.token)
          this.loadUser().subscribe()
        }),
        catchError(this.loginProcessError)
      );
  }

  private onLoginError() {
    this.removeUserInfo()
    this.#loginError.set(true)
  }

  private loadUser() {
    return this.#userApi.getUser().pipe(
      tap((res: IUser) => {
        this.#loggedUser.set(res)
        this.loadUserStores().subscribe()
      }),
      catchError(this.loginProcessError)
    )
  }

  private loadUserStores() {
    return this.#storeApi.getUserStores().pipe(
      tap((res: any) => {
        this.#loggedUserStores.set(res)
        this.#processHasFinished.set(true)
      }),
      catchError((error: HttpErrorResponse) => {
        this.#processHasFinished.set(true)
        this.#loggedUserStores.set(null)
        throw error
      }
      )
    )
  }

  public setUserLoggedFromSingIn(user: IUser) {
    this.#tokenService.setToken(user.token)
    this.#loggedUser.set(user)
  }

  public setUserLoggedFromEdit(user: IUser) {
    this.#loggedUser.set(user)
  }

  public setUserLoggedFromResetPassword(token: string) {
    this.#tokenService.setToken(token)
    this.loadUser().subscribe()
  }

  public setUserLoggedFromCreateStore(token: string) {
    this.#tokenService.setToken(token)
  }
}
