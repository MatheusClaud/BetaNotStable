import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GlobalStateService } from '../../../services/state/global-state-service';
import { UserCartService } from '../../../services/api/cart-service';
import { AuthenticationService } from '../../../services/authentication/authentication-service';

@Component({
  selector: 'app-right-bar',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './right-bar.html',
  styleUrl: './right-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RightBar {

  #GSService = inject(GlobalStateService)
  showSideBar = this.#GSService.getIsRightBarVisible
  cartService = inject(UserCartService)
  authService = inject(AuthenticationService)

  quantitys: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  totalPrice: number = 0

  products: any[] = []

  constructor(private fb: FormBuilder) {

  }

  closeCart() {
    this.#GSService.setRightBarVisibility(false)
  }

  clearCart() {
    this.cartService.clearCart()
  }


  removeItem(item: number) {
    this.cartService.removeItem(item)
  }

  onSelectionChange(index: number, event: Event) {
    let selectedValue = (event.target as HTMLSelectElement).value;
    this.cartService.updateItemQuantity(index, Number(selectedValue))
  }

  sendOrderToStore() {
    let message = "Olá desejo realizar o pedido de: "
    let acc = this.cartService.items().reduce((acc, current, index) => acc + current.quantity + " items de: " + current.product.name + ", cor: " + current.color + ", tamanho: " + current.size + " | ", "")
    let url = 'https://wa.me/5583999726887?text=' + message + acc;
    window.open(url, '_blank');
  }
}