import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import {MatTableModule} from '@angular/material/table';
import { StoreService } from '../../../../services/api/store-service';
import { cnpjPipeFormat, currencyPipeFormat } from '../../../../_shared/form/custom-fields-pipes';
import { IStore } from '../../../../models/entity/store-interface';
import { ProductService } from '../../../../services/api/product-service';
import { IProduct } from '../../../../models/entity/product-interface';
import {MatPaginatorModule} from '@angular/material/paginator';

@Component({
  selector: 'app-my-products',
  imports: [CommonModule, RouterLink, MatTableModule, MatPaginatorModule],
  templateUrl: './my-products.html',
  styleUrl: './my-products.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyProducts {

  #router = inject(Router)
  productService = inject(ProductService)
  storesService = inject(StoreService)

  initialPage = 1
  itemsPerPage = 4

  columns = ['name', 'basePrice', 'isActive']

  constructor() {
    effect(() => {
      this.productService.requestMyStoreProducts(this.storesService.storeToEdit()!!.id, this.initialPage, this.itemsPerPage)
    })
  }

  ngOnInit() {
    this.productService.reset()
    if (this.storesService.storeToEdit() ===  null) {
      this.#router.navigate(["/account-settings/my-stores"])
    }
  }

  getProducts() {
    return this.productService.myStoreProductsPage()!!.data
      .map((value) => {
          value.basePrice = currencyPipeFormat(value.basePrice)
          return value                
      })
  }

  goEditProduct(product: IProduct) {
    this.productService.productInEdit.set(product)
    this.#router.navigate(["/account-settings/edit-product"])
  }

  next() {
    let aux = this.productService.myStoreProductsPage()!!.meta;
    if (aux.page < aux.pageCount) {
      this.productService.requestMyStoreProducts(this.storesService.storeToEdit()!!.id, aux.page + 1, this.itemsPerPage)
    }
  }

  goBack() {
    let aux = this.productService.myStoreProductsPage()!!.meta;
    if (aux.page > 1) {
      this.productService.requestMyStoreProducts(this.storesService.storeToEdit()!!.id, aux.page - 1, this.itemsPerPage)
    }
  }
}
