import { inject, Injectable, linkedSignal, signal } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TrendingApi {
  
  #http = inject(HttpClient)
  #baseUrl = signal(environment.api)
  #url = linkedSignal(() => { return this.#baseUrl() + "/api/trending/" })

  public getTrendingProductsAndStores(): Observable<any> {
    return this.#http.get(this.#url())
  }

  public setTrendingProductsAndStores(entity: any): Observable<any> {
    return this.#http.post(this.#url(), entity)
  }
}