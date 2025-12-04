import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, computed, input, signal } from '@angular/core';
import { IHighlightedProduct } from '../../../models/entity/product-interface';
import { IHighlightedStore } from '../../../models/entity/store-interface';

@Component({
  selector: 'app-trending-home-item',
  imports: [CommonModule],
  templateUrl: './trending-home-item.html',
  styleUrl: './trending-home-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrendingHomeItem {

  itemsList = input<Array<any>>([])
  trendingType = input<number>(0)

  currentPage = signal(0)

  screenWidth = signal<number>(window.innerWidth);

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.currentPage.set(0)
    this.screenWidth.set(window.innerWidth)
  }

  itemsPerPage = computed(() => {
    if (this.screenWidth() > 1024) {
      return 4
    } else {
      return 2
    }
  })

  itemsInDisplay = computed(() => {
    if (this.showMoreSelected()) {
      return this.itemsList()
    } else {
      return this.itemsList().slice(this.currentPage() * this.itemsPerPage(), this.currentPage() * this.itemsPerPage() + this.itemsPerPage())
    }
  })

  numberOfPages = computed(() => {
    return Math.ceil(this.itemsList().length / this.itemsPerPage())
  })

  pagesArray = computed(() => {
    return new Array(this.numberOfPages());
  });

  showMoreSelected = signal(false)

  toogleShowMore() { this.showMoreSelected.update((value) => !value) }

  goToNextPage() {
    this.currentPage.update(current => Math.min(current + 1, this.numberOfPages() - 1));
  }

  goToPreviousPage() {
    this.currentPage.update(current => Math.max(current - 1, 0));
  }

  goToPage(page: number) {
    this.currentPage.set(page)
  }

  formatToProduct(object: any): IHighlightedProduct {
    return object as IHighlightedProduct
  }

  formatToStore(object: any): IHighlightedStore {
    return object as IHighlightedStore
  }
}