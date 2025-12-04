import { ChangeDetectionStrategy, Component, effect, inject, model, signal } from '@angular/core';
import { StoreService } from '../../../services/api/store-service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/api/product-service';
import { IProduct } from '../../../models/entity/product-interface';

@Component({
  selector: 'app-store-page',
  imports: [FormsModule],
  templateUrl: './store-page.html',
  styleUrl: './store-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StorePage {

  store = signal<string>("")
  route = inject(ActivatedRoute)
  router = inject(Router)
  storeService = inject(StoreService)
  productService = inject(ProductService)
  inputValue = model("")

  constructor() {
    effect(() => {
      if (this.storeService.errorOnGetPublicStore()) {
        this.router.navigate(["/stores"])
      }
    })
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let store = params['store'] || null;
      if (store != null) {
        this.storeService.getPublicStoreById(store)
        this.productService.requestPublicStoreProducts(store, 1, 10)
        this.store = store
      } else {
        this.router.navigate(["/stores"])
      }
    });
  }

  goTo(route: string) {
    this.router.navigate([route])
  }

  next() {
    let page = this.productService.pageOfPublicProducts()
    if (page != null && page.meta.page < page.meta.pageCount) {
      this.productService.requestPublicStoreProducts(this.storeService.currentPublicStore()!!.id, page.meta.page + 1)
    }
  }

  previous() {
    let page = this.productService.pageOfPublicProducts()
    if (page != null && page.meta.page > 1) {
      this.productService.requestPublicStoreProducts(this.storeService.currentPublicStore()!!.id, page.meta.page - 1)
    }
  }

  search() {
    this.productService.requestPublicStoreProducts(this.storeService.currentPublicStore()!!.id, 1, 10, this.inputValue())
  }

  goToProduct(product: IProduct) {
    this.router.navigate(["/product"],
      {
        queryParams: {
          storeId: this.store,
          productId: product.id
        }
      }
    )
  }
}
