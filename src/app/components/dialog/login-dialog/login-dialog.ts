import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from '../../../services/authentication/authentication-service';
import { LoginData } from '../../../models/request/login-data';
import { DialogStateService } from '../../../services/dialog/dialog-state-service';
import { IDialog } from '../../../models/shared/dialog-enum';
import { IFormBasicKit } from '../../../_shared/form/custom-form-basickit';

@Component({
  selector: 'app-login-dialog',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './login-dialog.html',
  styleUrl: './login-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginDialog extends IFormBasicKit {

  #authService = inject(AuthenticationService)
  #dialogService = inject(DialogStateService)
  #dialogRef = inject(MatDialogRef<LoginDialog>)

  loginSucceess = this.#authService.getProcessHasFineshed
  loginError = this.#authService.getLoginError
  
  constructor() {
    super()
    effect(() => {
      if (this.loginSucceess()) { this.close() }
    })

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  close(): void {
    this.#dialogRef.close('Closing modal from inside');
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const { email, password } = this.form.value;

    this.#authService.doLogin(new LoginData(email, password)).subscribe()
  }

  forgotPassword() {
    //this.close()
    this.#dialogService.setCurrentDialogVisibility(IDialog.ResetPassword)
  }
}
