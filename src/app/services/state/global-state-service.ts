import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class GlobalStateService {

    #leftBarVisibility = signal<boolean>(false)
    #rightBarVisibility = signal<boolean>(false)
    #loadingVisibility = signal<boolean>(false)

    public getIsLeftBarVisible = this.#leftBarVisibility.asReadonly()
    public getIsRightBarVisible = this.#rightBarVisibility.asReadonly()
    public getIsLoadingVisible = this.#loadingVisibility.asReadonly()

    public setLeftBarVisibility(visibility: boolean) {
        this.#rightBarVisibility.set(false)
        this.#leftBarVisibility.set(visibility)
    }

    public setRightBarVisibility(visibility: boolean) {
        this.#leftBarVisibility.set(false)
        this.#rightBarVisibility.set(visibility)
    }

    public setLoadingVisibility(visibility: boolean) {
        this.#loadingVisibility.set(visibility)
    }
}