import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { IFormBasicKit } from '../../../_shared/form/custom-form-basickit';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OnlyNumbersDirective } from '../../../directives/form/only-numbers-directive';
import { CepService } from '../../../services/address/cep-service';
import { minimumAgeValidator } from '../../../_shared/form/custom-validators';
import { applyPipeInField, applyPipeInSubField } from '../../../_shared/form/custom-form-modifier';
import { cepPipeFormat, cpfPipeFormat, formatDateToDDMMYYYY, phonePipeFormat, stripCountryCode } from '../../../_shared/form/custom-fields-pipes';
import { UserService } from '../../../services/user/user-service';
import { AuthenticationService } from '../../../services/authentication/authentication-service';
import { SingInData } from '../../../models/request/singin-data';

@Component({
  selector: 'app-profile',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    OnlyNumbersDirective
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Profile extends IFormBasicKit {

  #cepService = inject(CepService)
  #authService = inject(AuthenticationService)
  userService = inject(UserService)

  
  userAddressFromCep = this.#cepService.userAddress
  errorAddressFromCep = this.#cepService.addressError

  currentUser = this.#authService.getLoggedUser

  isOnEditMode = signal<boolean>(false)

  constructor() {
    effect(() => {
      if (this.currentUser() !== null) {
        console.log(this.currentUser()) 
        this.form.get('email')?.setValue(this.currentUser()?.email)
        this.form.get('name')?.setValue(this.currentUser()?.name)
        this.form.get('acceptMarketing')?.setValue(this.currentUser()?.acceptMarketing) 
        this.form.get('birthAt')?.setValue(
          formatDateToDDMMYYYY(this.currentUser()?.birthAt!!)
        )
        this.form.get('taxId')?.setValue(this.currentUser()?.taxId)
        this.form.get('phoneNumber')?.setValue(
          stripCountryCode(this.currentUser()?.phoneNumber!!)
        )
        this.form.get('address')?.get('street')?.setValue(this.currentUser()?.address?.street)
        this.form.get('address')?.get('number')?.setValue(this.currentUser()?.address?.number)
        this.form.get('address')?.get('complement')?.setValue(this.currentUser()?.address?.complement) 
        this.form.get('address')?.get('city')?.setValue(this.currentUser()?.address?.city)
        this.form.get('address')?.get('neighbourhood')?.setValue(this.currentUser()?.address?.neighbourhood)
        this.form.get('address')?.get('zipCode')?.setValue(this.currentUser()?.address?.zipCode)
      }

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
    super()
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      acceptMarketing: [false],
      birthAt: ['', [Validators.required, minimumAgeValidator, Validators.minLength(10)]],
      taxId: ['', [Validators.required, Validators.minLength(14)]],
      phoneNumber: ['', [Validators.required, Validators.minLength(17)]],
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
    this.removeEditMode()

    this.#cepService.reset()
    applyPipeInField(this.form, 'phoneNumber', phonePipeFormat)
    applyPipeInSubField(this.form, 'address', 'zipCode', cepPipeFormat)
    applyPipeInField(this.form, 'taxId', cpfPipeFormat)
    this.#cepService.setCepListenerForForm(this.form)
  }

  removeEditMode() {
    this.isOnEditMode.set(false)
    this.form.get('birthAt')?.disable()
    this.form.get('taxId')?.disable()
    this.form.get('email')?.disable()
    this.form.get('name')?.disable()
    this.form.get('acceptMarketing')?.disable()
    this.form.get('phoneNumber')?.disable()
    this.form.get('address')?.get('street')?.disable()
    this.form.get('address')?.get('number')?.disable()
    this.form.get('address')?.get('complement')?.disable()
    this.form.get('address')?.get('city')?.disable()
    this.form.get('address')?.get('neighbourhood')?.disable()
    this.form.get('address')?.get('zipCode')?.disable()
  }

  setEditMode() {
    this.isOnEditMode.set(true)
    this.form.get('name')?.enable()
    this.form.get('acceptMarketing')?.enable()
    this.form.get('phoneNumber')?.enable()
    this.form.get('address')?.get('street')?.enable()
    this.form.get('address')?.get('number')?.enable()
    this.form.get('address')?.get('complement')?.enable()
    this.form.get('address')?.get('city')?.enable()
    this.form.get('address')?.get('neighbourhood')?.enable()
    this.form.get('address')?.get('zipCode')?.enable()
  }

  onSubmit(): void {
    if (!this.isOnEditMode()) {
      this.setEditMode()
      return;
    }
    if (this.form.invalid) return;
    this.removeEditMode()
    this.userService.updateUserData(new SingInData(this.form.value))
  }
}
