import { inject, Injectable, signal } from '@angular/core';
import { StoreApi } from './store/store-api';
import { CreateStoreData, EditStoreData, IStore, StorePage } from '../../models/entity/store-interface';
import { EditStore } from '../../components/pages/edit-store/edit-store';
import { AuthApi } from './auth/auth-api';
import { AuthenticationService } from '../authentication/authentication-service';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  #storeApi = inject(StoreApi);
  #authApi = inject(AuthenticationService)

  #userStores = signal<Array<IStore>>([])
  #errorOnCreateStore = signal(false)
  #errorOnSendImages = signal(false)
  #idOfCreatedStore = signal<string | null>(null)
  #sucessInSendImages = signal(false)
  #sucessInDeleteStore = signal(false)
  #errorInDeleteStore = signal(false)

  storeToEdit = signal<IStore | null>(null)
  #errorOnEditStore = signal(false)


  public getUserStores = this.#userStores.asReadonly()
  getErrorOnCreateStore = this.#errorOnCreateStore.asReadonly()
  getErrorOnSendImages = this.#errorOnSendImages.asReadonly()
  getIdOfCreatedStore = this.#idOfCreatedStore.asReadonly()
  getSucessInSendImages = this.#sucessInSendImages.asReadonly()
  getErrorOnEditStore = this.#errorOnEditStore.asReadonly()
  getSucessInDeleteStore = this.#sucessInDeleteStore.asReadonly()
  getErrorInDeleteStore = this.#errorInDeleteStore.asReadonly()


  reset() {
    this.#userStores.set([]) 
    this.#errorOnCreateStore.set(false)
    this.#errorOnSendImages.set(false)
    this.#sucessInSendImages.set(false)
    this.#idOfCreatedStore.set(null)
  }

  resetForEdit() {
    this.#errorOnEditStore.set(false)
    this.#sucessInDeleteStore.set(false)
    this.#sucessInSendImages.set(false)
    this.#errorOnSendImages.set(false) 
    this.#errorInDeleteStore.set(false)
    this.sucessInEditStore.set(false)
  }

  setImagesToStore(storeId: string, blobs: Blob[]) {
    this.#errorOnCreateStore.set(false)
    this.#errorOnSendImages.set(false)
    const jpegBlob = blobs.map((blob) => {
        let newBlob = new Blob([blob], { type: 'image/jpeg' })
        return newBlob
    })
    const formData = new FormData()
    jpegBlob.forEach((image: Blob, index) => {
        formData.append('images', image, `image_${index}.jpg`)
    })
    this.#storeApi.sendImagesToStore(storeId, formData)
        .subscribe({
            next: (_: any) => { this.#sucessInSendImages.set(true) },
            error: () => { this.#errorOnSendImages.set(true) }
        })
  }

  createStore(store: CreateStoreData) {
    this.reset()
    this.#storeApi.createStore(store)
    .subscribe({
        next: (res: any) => {  
            console.log(res)
            this.#authApi.setUserLoggedFromCreateStore(res.token)
            this.#idOfCreatedStore.set(res.store.id)
        },
        error: () => { this.#errorOnCreateStore.set(true) }
      })
  }

  sucessInEditStore = signal(false)

  editStore(id: string, newData: EditStoreData) {
    this.resetForEdit()
    this.#storeApi.updateStoreById(id, newData)
      .subscribe({
        next: (res: any) => { this.sucessInEditStore.set(true) },
        error: () => { this.#errorOnEditStore.set(true) }
      })
  }

  deleteStore(id: string) {
    this.resetForEdit()
    this.#storeApi.deleteStoreById(id)
      .subscribe({
        next: () => { this.#sucessInDeleteStore.set(true) },
        error: () => { this.#errorInDeleteStore.set(true) }
      })
  }

  requestUserStores() {
    this.reset()
    this.#storeApi.getUserStores()
    .subscribe({
        next: (stores: Array<IStore>) => { 
          console.log(stores)
          this.#userStores.set(stores) },
        error: () => { this.#userStores.set([]) }
      })
  }

  pageOfpublicStores = signal<StorePage | null>(null)
  currentPublicStore = signal<IStore | null>(null)
  errorOnGetPublicStore = signal(false)

  resetPublic() {
    this.pageOfpublicStores.set(null)
    this.currentPublicStore.set(null)
    this.errorOnGetPublicStore.set(false)
  }

  requestPublicStores(page: number = 1, limit: number = 10, wordFilter: string | null = null) {
    this.resetPublic()
    this.#storeApi.getPublicStores(page, limit, wordFilter)
    .subscribe({
        next: (stores: StorePage) => { this.pageOfpublicStores.set(stores) },
        error: () => { this.pageOfpublicStores.set(null) }
      })
  }

  getPublicStoreById(id: string) {
    this.resetPublic()
    this.#storeApi.getStoreById(id)
    .subscribe({
        next: (store: IStore) => { this.currentPublicStore.set(store) },
        error: () => {
          this.errorOnGetPublicStore.set(true)
          this.currentPublicStore.set(null)
        }
      })
  }
}
