import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CepService } from '../../../services/address/cep-service';
import { OnlyNumbersDirective } from '../../../directives/form/only-numbers-directive';
import { UserService } from '../../../services/user/user-service';
import { SingInData } from '../../../models/request/singin-data';
import { ErrorAge, ErrorEmail, ErrorMinLength, ErrorPasswordValid, ErrorRequired, minimumAgeValidator, passwordFormatValidator } from '../../../_shared/form/custom-validators';
import { cepPipeFormat, cpfPipeFormat, datePipeFormat, phonePipeFormat } from '../../../_shared/form/custom-fields-pipes';
import { applyPipeInField, applyPipeInSubField } from '../../../_shared/form/custom-form-modifier';
import { AuthenticationService } from '../../../services/authentication/authentication-service';
import { IFormBasicKit } from '../../../_shared/form/custom-form-basickit';

@Component({
  selector: 'app-signin-dialog',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    OnlyNumbersDirective
  ],
  templateUrl: './signin-dialog.html',
  styleUrl: './signin-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SigninDialog extends IFormBasicKit  {

  #dialogRef = inject(MatDialogRef<SigninDialog>)
  #userService = inject(UserService)
  #authService = inject(AuthenticationService)
  currentUser = this.#authService.getLoggedUser
  userCreationError = this.#userService.errorOnSingIn

  #cepService = inject(CepService)
  userAddressFromCep = this.#cepService.userAddress
  errorAddressFromCep = this.#cepService.addressError
  
  constructor() {
    super();
    this.form
    effect(() => {
      if (this.currentUser() !== null) { this.close() }
      let address = this.userAddressFromCep()
      if (address != null) {
        this.form.get('address')?.get('street')?.setValue(address.street)
        this.form.get('address')?.get('city')?.setValue(address.city)
        this.form.get('address')?.get('neighbourhood')?.setValue(address.neighbourhood)
      } else {
        this.form.get('address')?.get('street')?.setValue('')
        this.form.get('address')?.get('city')?.setValue('')
        this.form.get('address')?.get('neighbourhood')?.setValue('')
      }
    }) 

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), passwordFormatValidator]],
      name: ['', [Validators.required]],
      acceptMarketing: [false],
      birthAt: ['', [Validators.required, minimumAgeValidator, Validators.minLength(10)]],
      taxId: ['', [Validators.required, Validators.minLength(14)]],
      phoneNumber: ['', [Validators.required, Validators.minLength(17)]], // Keep phoneNumber
      address: this.fb.group({
        street: ['', [Validators.required]],
        number: ['', [Validators.required]],
        complement: ['', [Validators.required]],
        city: ['', [Validators.required]],
        neighbourhood: ['', [Validators.required]],
        zipCode: ['', [Validators.required, Validators.minLength(9)]],
      })
    });
  }


  ngOnInit() {
    this.#cepService.reset()
    applyPipeInField(this.form, 'birthAt', datePipeFormat)
    applyPipeInField(this.form, 'phoneNumber', phonePipeFormat)
    applyPipeInField(this.form, 'taxId', cpfPipeFormat)
    applyPipeInSubField(this.form, 'address', 'zipCode', cepPipeFormat)
    this.#cepService.setCepListenerForForm(this.form)
  }

  close(): void {
    this.#dialogRef.close('Closing modal from inside');
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.#userService.createUser(new SingInData(this.form.value)).subscribe()
  }
}
