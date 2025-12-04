import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { StoreService } from '../../../services/api/store-service';
import {MatTableModule} from '@angular/material/table';
import { cnpjPipeFormat } from '../../../_shared/form/custom-fields-pipes';
import { IStore } from '../../../models/entity/store-interface';

@Component({
  selector: 'app-my-stores',
  imports: [CommonModule, RouterLink, MatTableModule],
  templateUrl: './my-stores.html',
  styleUrl: './my-stores.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyStores {

  #router = inject(Router)
  storesService = inject(StoreService)

  columns = ['name', 'cnpj', 'instagram', 'isActive']

  constructor() {
    effect(() => {
      this.storesService.requestUserStores()
    })
  }

  ngOnInit() {
    this.storesService.reset()
    this.storesService.resetForEdit()
    //this.storesService.requestUserStores()
  }

  getStores() {
    return this.storesService.getUserStores()
      .map((value) => {
          value.cnpj = cnpjPipeFormat(value.cnpj)
          return value                
      })
  }

  goEditStore(store: IStore) {
    console.log("chamou")
    this.storesService.storeToEdit.set(store)
    this.#router.navigate(["/account-settings/edit-store"])
  }
}
