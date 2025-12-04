import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication/authentication-service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { StoreService } from '../../../services/api/store-service';

@Component({
  selector: 'app-account-settings',
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './account-settings.html',
  styleUrl: './account-settings.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountSettings {

  storeService = inject(StoreService)
  #authService = inject(AuthenticationService)
  loggedUser = this.#authService.getLoggedUser

}
