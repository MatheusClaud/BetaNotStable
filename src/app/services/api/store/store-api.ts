import { inject, Injectable, linkedSignal, signal } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StoreApi {
  
  #http = inject(HttpClient)
  #baseUrl = signal(environment.api)
  #url = linkedSignal(() => { return this.#baseUrl() + "/api/stores/" })

  public getPublicStores(page: number = 1, limit: number = 10, wordFilter: string | null = null): Observable<any> {
    let finalUrl = this.#url() + "?page=" + page + "&limit=" + limit
    if (wordFilter !== null) {
      finalUrl += "&name=" + wordFilter
    }
    return this.#http.get(finalUrl)
  }

  public createStore(data: any) {
    return this.#http.post(this.#url(), data)
  }

  public getStoreById(id: string): Observable<any> {
    return this.#http.get(this.#url() + id)
  }

  public updateStoreById(id: string, data: any) {
    return this.#http.patch(this.#url() + id, data)
  }

  public deleteStoreById(id: string) {
    return this.#http.delete(this.#url() + id)
  }

  public getUserStores(): Observable<any> {
    return this.#http.get(this.#url() + "me/list")
  }

  public sendImagesToStore(id: string, data: FormData) {
    return this.#http.post(this.#url() + id + "/images", data)
  }
}