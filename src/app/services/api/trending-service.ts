import { inject, Injectable, signal } from '@angular/core';
import { TrendingApi } from '../api/trending/trending-api';
import { IHighlightedProduct } from '../../models/entity/product-interface';
import { IHighlightedStore } from '../../models/entity/store-interface';

@Injectable({
  providedIn: 'root'
})
export class TrendingService {

  #trendingApi = inject(TrendingApi);

  #trendingProduct = signal<Array<IHighlightedProduct>>([])
  public getTrendingProduct = this.#trendingProduct.asReadonly()

  #trendingStores = signal<Array<IHighlightedStore>>([])
  public getTrendingStores = this.#trendingStores.asReadonly()

  #tredingError = signal<boolean>(false)
  public getTrendingError = this.#tredingError.asReadonly()

  reset() {
    this.#trendingProduct.set([])
    this.#trendingStores.set([])
    this.#tredingError.set(false)   
  }

  getTrending() {
    this.reset()
    this.#trendingApi.getTrendingProductsAndStores()
    .subscribe({
        next: (trending: any) => {
            this.#trendingProduct.set(trending.products)
            this.#trendingStores.set(trending.stores)   
        },
        error: () => { this.#tredingError.set(true) }
      })
  }
}
