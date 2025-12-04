import { inject, Injectable, linkedSignal, signal } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductApi {
  
  #http = inject(HttpClient)
  #baseUrl = signal(environment.api)
  #url = linkedSignal(() => { return this.#baseUrl() + "/api/products/" })

  public getPageOfPublicProducts(storeId: string, page: number = 1, limit: number = 10, wordFilter: string | null = null): Observable<any> {
    let finalUrl = this.#url() + "stores/" + storeId + "/?page=" + page + "&limit=" + limit
    if (wordFilter !== null) {
      finalUrl += "&name=" + wordFilter
    }
    return this.#http.get(finalUrl)
  }

  public getPublicProductById(id: string): Observable<any> {
    return this.#http.get(this.#url() + id)
  }

  public getMyStoreProducts(storeId: string, page: number = 1, limit: number = 10, wordFilter: string | null = null) {
    let finalUrl = this.#url() + "stores/" + storeId + "/manage/?page=" + page + "&limit=" + limit
    if (wordFilter !== null) {
      finalUrl += "&name=" + wordFilter
    }
    return this.#http.get(finalUrl)
  }

  public createProduct(storeId: string, data: any) {
    return this.#http.post(this.#url() + "stores/" + storeId + "/products" , data)
  }

  public updateProductById(id: string, data: any) {
    return this.#http.patch(this.#url() + "products/" + id, data)
  }

  public deleteProductById(id: string) {
    return this.#http.delete(this.#url() + "products/" + id)
  }

  public sendImagesToProduct(id: string, data: FormData) {
    return this.#http.post(this.#url() + id + "/images", data)
  }
}