import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../../../services/api/store-service';
import { ProductService } from '../../../services/api/product-service';
import { IFormBasicKit } from '../../../_shared/form/custom-form-basickit';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { UserCartService } from '../../../services/api/cart-service';

@Component({
  selector: 'app-product-page',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule
  ],
  templateUrl: './product-page.html',
  styleUrl: './product-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductPage extends IFormBasicKit {

  cartService = inject(UserCartService)
  route = inject(ActivatedRoute)
  router = inject(Router)
  storeService = inject(StoreService)
  productService = inject(ProductService)

  store = signal("")
  product = signal("")

  quantitys: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  selectedImageIndex = signal(0)


  constructor() {
    super()
    effect(() => {
      if (this.storeService.errorOnGetPublicStore() || this.productService.errorGetCurrentPublicProduct()) {
        this.router.navigate(["/stores"])
      }
      console.log(this.productService.currentPublicProduct())
    })
    this.form = this.fb.group({
      quantity: [0, [Validators.required]],
      color: ['', [Validators.required]],
      size: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.selectedImageIndex.set(0)
    this.route.queryParams.subscribe(params => {
      let store = params['storeId'] || null;
      let product = params['productId'] || null;
      if (store != null && product != null) {
        this.storeService.getPublicStoreById(store)
        this.productService.getPublicProductById(product)
        this.product = product 
        this.store = store
      } else {
        this.router.navigate(["/stores"])
      }
    });
  }

  goTo(route: string, params = {}) {
    this.router.navigate([route], { queryParams: params})
  }

  canAddProductToCart() {
    return this.form.get('quantity')?.value > 0 && this.form.get('color')?.valid && this.form.get('size')?.valid
  }

  addProductToCart() {
    if (this.canAddProductToCart()) {
      this.cartService.addProductToCart(
        this.storeService.currentPublicStore()!!,
        this.productService.currentPublicProduct()!!,
        this.form.get('color')?.value,
        this.form.get('size')?.value,
        this.form.get('quantity')?.value,
      )
      this.goTo('/store', {store: this.store})
    }
  }

  setSelectedIndex(index: number) {
    this.selectedImageIndex.set(index)
  }
} 
