import { inject, Injectable, signal } from '@angular/core';
import { AuthApi } from '../api/auth/auth-api';
import { ForgotData } from '../../models/request/forget-data';
import { ResetData } from '../../models/request/reset-data';
import { AuthenticationService } from './authentication-service';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  #api = inject(AuthApi)
  #authService = inject(AuthenticationService)

  #emailHasBeenSend = signal<boolean>(false)
  public getEmailHasBeenSend = this.#emailHasBeenSend.asReadonly()

  #errorSendingEmail = signal<boolean>(false)
  public getErrorSendingEmail = this.#errorSendingEmail.asReadonly()

  #passwordResetSuccess = signal<boolean>(false)
  public getPasswordResetSuccess = this.#passwordResetSuccess.asReadonly()

  #passwordResetError = signal<boolean>(false)
  public getPasswordResetError = this.#passwordResetError.asReadonly()

  reset() {
    this.#emailHasBeenSend.set(false)
    this.#errorSendingEmail.set(false)
    this.#passwordResetSuccess.set(false)
    this.#passwordResetError.set(false) 
  }

  sendResetEmail(email: string) {
    this.reset()
    this.#api.forgotPassword(new ForgotData(email)).subscribe({
      next: () => {
        this.#emailHasBeenSend.set(true)
      },
      error: () => {
        this.#errorSendingEmail.set(true)
      }
    })
  }

  resetEmail(token: string, password: string) {
    this.reset()
    this.#api.resetPassword(new ResetData(token, password)).subscribe({
        next: (res) => {
            this.#passwordResetSuccess.set(true)
            console.log(res.token)
            this.#authService.setUserLoggedFromResetPassword(res.token)
        },
        error: () => {
            this.#passwordResetError.set(true)
        } 
    })
  }
}
