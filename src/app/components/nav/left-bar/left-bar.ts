import { ChangeDetectionStrategy, Component, effect, inject, linkedSignal, model } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalStateService } from '../../../services/state/global-state-service';
import { FormsModule } from '@angular/forms';
import { DialogStateService } from '../../../services/dialog/dialog-state-service';
import { AuthenticationService } from '../../../services/authentication/authentication-service';
import { IDialog } from '../../../models/shared/dialog-enum';
import { StoreService } from '../../../services/api/store-service';

@Component({
  selector: 'app-left-bar',
  imports: [FormsModule],
  templateUrl: './left-bar.html',
  styleUrl: './left-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeftBar {

  #dialogService = inject(DialogStateService)
  #GSService = inject(GlobalStateService)
  #authService = inject(AuthenticationService)
  storeService = inject(StoreService)

  showFilter = this.#GSService.getIsLeftBarVisible
  
  inputValue = model("")

  loggedUser = this.#authService.getLoggedUser
  isLoged = linkedSignal(() => { return this.loggedUser() != null })

  loggedUserStores = this.#authService.getLoggedUserStores
  hasStores = linkedSignal(() => {
    if (this.loggedUserStores() != null) {
      return this.loggedUserStores().length > 0
    }
    return false
  })

  filterOpen = -1

  filters = [
    { label: "Masculino", filters: [
       { label: "Cuecas" },
       { label: "Meias" },
       { label: "Roupas" },
       { label: "Pijamas" },
       { label: "Ir para Masculino" },
    ]},
    { label: "Feminino", filters: [
       { label: "Calcinhas" },
       { label: "Sutiãs" },
       { label: "Roupas" },
       { label: "Pijamas" },
       { label: "Modeladores" },
       { label: "Meias" },
       { label: "Ir para Feminino" },
    ]},
    { label: "Menina", filters: [
       { label: "Calcinhas" },
       { label: "Roupas" },
       { label: "Pijamas" },
       { label: "Meias" },
       { label: "Ir para Meninas" },
    ]},
    { label: "Menino", filters: [
       { label: "Cuecas" },
       { label: "Meias" },
       { label: "Roupas" },
       { label: "Pijamas" },
       { label: "Ir para Meninos" },
    ]},
    { label: "Ofertas" },
  ]

  constructor(private router: Router) {
    //this.filters = mockService.filters
    effect(() => {
      if (!this.showFilter()) { this.filterOpen = -1 }
    })
  }

  closeFilter() {
    this.#GSService.setLeftBarVisibility(false)
  }

  openCart() {
    this.#GSService.setRightBarVisibility(true)
  }

  gotToHome() {
    this.closeFilter()
    this.router.navigate(['/home'])
  }

  gotToSettings() {
    this.closeFilter()
    this.router.navigate(['/account-settings/profile'])
  }

  gotTo(route: string) {
    this.closeFilter()
    this.router.navigate([route])
  }

  goToLogin() {
    this.closeFilter()
    this.#dialogService.setCurrentDialogVisibility(IDialog.Login)
  }

  goToSingIn() {
    this.closeFilter()
    this.#dialogService.setCurrentDialogVisibility(IDialog.SingIn)
  }

  logout() {
    this.closeFilter()
    this.#authService.removeUserInfo()
    window.location.reload()
  }

  setFilterOpen(index: number) {
    if (index == this.filterOpen) {
      this.filterOpen = -1
    } else {
      this.filterOpen = index
    }
  }

  selectFilter(i: number, j: number) {
    if (this.filters[i]!!.filters!![j].label.includes("Ir para")) {
      this.router.navigate(['/products'], {
        queryParams: { filter: i }
      })
    } else {
      this.router.navigate(['/products'], {
        queryParams: { filter: i, subfilter: j },
        queryParamsHandling: 'merge'  
      })
    }
    this.closeFilter()
  }

  onEnterPressed() {
    if (this.inputValue() !== "") {
      this.router.navigate(['/stores'], {
        queryParams: { search: this.inputValue() }
      })
    }
  }
}