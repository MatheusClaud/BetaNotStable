import { inject, Injectable, signal } from "@angular/core";
import { UserApi } from "../api/user/user-api";
import { catchError, Observable, tap, throwError } from "rxjs";
import { IUser } from "../../models/entity/user-interface";
import { HttpErrorResponse } from "@angular/common/http";
import { AuthenticationService } from "../authentication/authentication-service";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  #api = inject(UserApi)
  #authService = inject(AuthenticationService)

  #errorOnSingIn = signal<boolean>(false)
  public errorOnSingIn = this.#errorOnSingIn.asReadonly()

  #errorOnEdit = signal<boolean>(false)
  public errorOnEdit = this.#errorOnEdit.asReadonly()

  #errorOnChangePassword = signal<boolean>(false)
  public errorOnChangePassword = this.#errorOnChangePassword.asReadonly()

  #sucessOnChangePassword = signal<boolean>(false)
  public sucessOnChangePassword = this.#sucessOnChangePassword.asReadonly()


  public getUser(): Observable<IUser> {
    return this.#api.getUser()
  }

  public createUser(data: any): Observable<any> {
    return this.#api.createUser(data)
      .pipe(
        tap((res: IUser) => {
            this.#errorOnSingIn.set(false)
            this.#authService.setUserLoggedFromSingIn(res)
        }),
        catchError(
            (error: HttpErrorResponse) => {
                this.#errorOnSingIn.set(true)
                return throwError(() => error)
            }
        )
      )
  }

  public updateUserData(data: any) {
    this.#api.updateUser(data)
      .subscribe({
        next: (res: IUser) => {
          this.#authService.setUserLoggedFromEdit(res)
        },
        error: (_: HttpErrorResponse) => {
          this.#errorOnEdit.set(true)
        }
      })
  }

  public updateUserPassword(password: string) {
    this.#errorOnChangePassword.set(false)
    this.#sucessOnChangePassword.set(false)
    this.#api.updateUserPassword(password)
      .subscribe({
        next: (_: any) => {
          this.#sucessOnChangePassword.set(true)
        },
        error: (_: HttpErrorResponse) => {
          this.#errorOnChangePassword.set(true)
        }
      })
  }
} 