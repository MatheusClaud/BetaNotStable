import { inject, Injectable, signal } from "@angular/core";
import { IStore } from "../../models/entity/store-interface";
import { IProduct } from "../../models/entity/product-interface";
import { DialogStateService } from "../dialog/dialog-state-service";
import { GlobalStateService } from "../state/global-state-service";

export class UserCartItem {
    product: IProduct = {} as IProduct
    color: string = ""
    size: string = ""
    quantity: number = 0

    constructor(
        product: IProduct,
        color: string,
        size: string,
        quantity: number
    ) {
        this.product = product
        this.color = color
        this.size = size
        this.quantity = quantity
    }
}

@Injectable({
  providedIn: 'root'
})
export class UserCartService {

    dialogService = inject(DialogStateService)
    globalState = inject(GlobalStateService)

    currentStoreInCart = signal<IStore | null>(null)
    askUserForClearCart = signal(false)

    items = signal<UserCartItem[]>([])
    
    public addProductToCart(
        store: IStore,
        product: IProduct,
        color: string,
        size: string,
        quantity: number
    ) {
        this.askUserForClearCart.set(false)
        if (this.currentStoreInCart !== null && store.id !== this.currentStoreInCart()?.id) {
            // this.askUserForClearCart.set(true)
            this.items.set([new UserCartItem(product, color, size, quantity)])
        }
        else {
            this.items.set([...this.items(), new UserCartItem(product, color, size, quantity)])
        }
        this.currentStoreInCart.set(store)
        this.globalState.setRightBarVisibility(true)
    }

    public clearCart() {
        this.currentStoreInCart.set(null)
        this.askUserForClearCart.set(false)
        this.items.set([])
    }

    public removeItem(index: number) {
        this.items.update( current => {
            let updated = [...current]
            if (updated.length > 1) {
                updated.splice(index, 1)
            } else {
                updated = []
                this.clearCart()
            }

            return updated
        })
    }

    public updateItemQuantity(index: number, quantity: number) {
        this.items.update( current => {
            let updated = [...current]
            updated[index].quantity = quantity
            return updated
        })
    }
}