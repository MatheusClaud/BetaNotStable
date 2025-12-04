import { inject, Injectable, signal } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { catchError, distinctUntilChanged, Observable, tap, throwError } from "rxjs";
import { ERROR_ON_CEP_REQUEST, IViaCepAddress } from "../../models/response/address-api/IViaCepAddress";
import { CepApi } from "../api/address/cep-api";
import { IAddress } from "../../models/entity/address-interface";
import { FormControl, FormGroup } from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class CepService {

  #cep_api = inject(CepApi)

  #userAddress = signal<IAddress | null>(null)
  public userAddress = this.#userAddress.asReadonly()

  #addressError = signal<boolean>(false)
  public addressError = this.#addressError.asReadonly()

  public reset() {
    this.#userAddress.set(null)
    this.#addressError.set(false)
  }

  public recoverAddressData(cep: string): Observable<IViaCepAddress> {
    this.reset()
    return this.#cep_api.searchCep(cep).pipe(
      tap((res: IViaCepAddress) => {
        if (res.erro == ERROR_ON_CEP_REQUEST) {
          this.#addressError.set(true)
        } else {
          this.#userAddress.set(new IAddress().buildFromViaCep(res))
        }
      }),
      catchError(
        (error: HttpErrorResponse) => {
          this.#addressError.set(true)
          return throwError(() => error)
        }
      )
    )
  }

  public setCepListenerForForm(formGroup: FormGroup) {
    let zipCode = formGroup.get('address')?.get('zipCode')
    zipCode?.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe( value => {
      let format = value.replace('-', '')
      if (format.length == 8) {
        this.recoverAddressData(format).subscribe()
      }
    })
  }

  public setCepListenerToFormControl(control: FormControl) {
    control?.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe( value => {
      let format = value.replace('-', '')
      if (format.length == 8) {
        this.recoverAddressData(format).subscribe()
      }
    })
  }
}