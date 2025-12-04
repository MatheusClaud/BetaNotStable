import { inject, Injectable, signal } from "@angular/core";
import { ProductApi } from "./product/product-api";
import { CreateProductData, EditProductData, IProduct, ProductPage } from "../../models/entity/product-interface";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

    #productApi = inject(ProductApi);

    myStoreProductsPage = signal<ProductPage | null>(null)
    errorOnGetMyStoreProducts = signal(false)

    createdProductId = signal<string | null>(null)
    errorOnProductCreation = signal(false)

    reset() {
        this.myStoreProductsPage.set(null)
        this.errorOnGetMyStoreProducts.set(false)
        this.createdProductId.set(null)
        this.errorOnProductCreation.set(false)
        this.errorOnCreateProduct.set(false)
        this.errorOnSendImages.set(false) 
        this.sucessInSendImages.set(false)
    }

    resetForEdit() {
        this.sucessInEditProduct.set(false)
        this.failureInEditProduct.set(false)
        this.sucessInRemoveProduct = signal(false)
        this.failureInRemoveProduct = signal(false)
        this.errorOnSendImages.set(false) 
        this.sucessInSendImages.set(false)
    }

    public requestMyStoreProducts(storeId: string, page: number = 1, limit: number = 10, wordFilter: string | null = null) {
        this.reset()
        this.#productApi.getMyStoreProducts(storeId, page, limit, wordFilter)
        .subscribe({
            next: (res: any) => {this.myStoreProductsPage.set(res)},
            error: () => {this.errorOnGetMyStoreProducts.set(true)}
        })
    }

    public createStore(id: string, data: CreateProductData) {
        this.createdProductId.set(null)
        this.errorOnProductCreation.set(false)
        this.#productApi.createProduct(id, data)
        .subscribe({
            next: (res: any) => {this.createdProductId.set(res.id)},
            error: () => {this.errorOnProductCreation.set(true)}
        })
    }

    errorOnCreateProduct = signal(false)
    errorOnSendImages = signal(false)
    sucessInSendImages = signal(false)

    setImagesToStore(storeId: string, blobs: Blob[]) {
        this.errorOnCreateProduct.set(false)
        this.errorOnSendImages.set(false)
        const jpegBlob = blobs.map((blob) => {
            let newBlob = new Blob([blob], { type: 'image/jpeg' })
            return newBlob
        })
        const formData = new FormData()
        jpegBlob.forEach((image: Blob, index) => {
            formData.append('images', image, `image_${index}.jpg`)
        })
        this.#productApi.sendImagesToProduct(storeId, formData)
            .subscribe({
                next: (_: any) => { this.sucessInSendImages.set(true) },
                error: () => { this.errorOnSendImages.set(true) }
            })
    }

    productInEdit = signal<IProduct | null>(null)
    sucessInEditProduct = signal(false)
    failureInEditProduct = signal(false)


    editProduct(id: string, data: EditProductData) {
        this.resetForEdit()
        this.#productApi.updateProductById(id, data)
        .subscribe({
            next: (_: any) => { this.sucessInEditProduct.set(true) },
            error: () => { this.failureInEditProduct.set(true) }
        })
    }

    sucessInRemoveProduct = signal(false)
    failureInRemoveProduct = signal(false)

    deleteProduct(id: string) {
        this.#productApi.deleteProductById(id)
        .subscribe({
            next: (_: any) => { this.sucessInRemoveProduct.set(true) },
            error: () => { this.failureInRemoveProduct.set(true) }
        })
    }


    pageOfPublicProducts = signal<ProductPage | null>(null)
    currentPublicProduct = signal<IProduct | null>(null)
    errorGetCurrentPublicProduct = signal(false)

    public resetPublic() {
        this.pageOfPublicProducts.set(null)
        this.currentPublicProduct.set(null)
        this.errorGetCurrentPublicProduct.set(false)
    }

    public requestPublicStoreProducts(storeId: string, page: number = 1, limit: number = 10, wordFilter: string | null = null) {
        this.resetPublic()
        this.#productApi.getPageOfPublicProducts(storeId, page, limit, wordFilter)
        .subscribe({
            next: (res: any) => {this.pageOfPublicProducts.set(res)},
            error: () => {this.pageOfPublicProducts.set(null)}
        })
    }

    public getPublicProductById(productId: string) {
        this.resetPublic()
        this.#productApi.getPublicProductById(productId)
        .subscribe({
            next: (res: any) => {
                this.currentPublicProduct.set(res)},
            error: (res: any) => {
                this.errorGetCurrentPublicProduct.set(true)
            }
        })
    }
}