import { ChangeDetectionStrategy, Component, inject, linkedSignal, model, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GlobalStateService } from '../../../services/state/global-state-service';
import { DialogStateService } from '../../../services/dialog/dialog-state-service';
import { AuthenticationService } from '../../../services/authentication/authentication-service';
import { IDialog } from '../../../models/shared/dialog-enum';

@Component({
  selector: 'app-topbar',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Topbar {

  #dialogService = inject(DialogStateService)
  #GSService = inject(GlobalStateService)
  #authService = inject(AuthenticationService)

  loggedUser = this.#authService.getLoggedUser
  isLoged = linkedSignal(() => { return this.loggedUser() != null })

  loggedUserStores = this.#authService.getLoggedUserStores
  hasStores = linkedSignal(() => {
    if (this.loggedUserStores() !== null) {
      return this.loggedUserStores().length > 0
    }
    return false
  })

  inputValue = model("");

  constructor(
    private router: Router
  ) {
    this.#authService.checkSession()
  }
  
  goToLogin() { this.#dialogService.setCurrentDialogVisibility(IDialog.Login) }

  goToSingIn() { this.#dialogService.setCurrentDialogVisibility(IDialog.SingIn) }

  goToCreateStore() { this.#dialogService.setCurrentDialogVisibility(IDialog.CreateStore) }

  logout() {
    this.#authService.removeUserInfo()
    window.location.reload()
  }

  gotToHome() { this.router.navigate(['/home']) }

  openCart() { this.#GSService.setRightBarVisibility(true) }

  openFilter() { this.#GSService.setLeftBarVisibility(true) }

  gotToSettings() {
    this.router.navigate(['/account-settings/profile'])
  }

  gotTo(route: string) {
    this.router.navigate([route])
  }

  onEnterPressed() {
    if (this.inputValue() !== "") {
      this.router.navigate(['/stores'], {
        queryParams: { search: this.inputValue() }
      })
    }
  }
}
