import { ChangeDetectionStrategy, Component, inject, model, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../../../services/api/store-service';
import { FormsModule } from '@angular/forms';
import { IStore } from '../../../models/entity/store-interface';

@Component({
  selector: 'app-stores-list',
  imports: [FormsModule],
  templateUrl: './stores-list.html',
  styleUrl: './stores-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoresList {

  route = inject(ActivatedRoute)
  router = inject(Router)
  storeService = inject(StoreService)
  inputValue = model("")
  
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let search = params['search'] || null;
      if (search != null) {
        this.storeService.requestPublicStores(1, 10, search)
      } else {
        this.storeService.requestPublicStores()
      }
    });
  }

  goTo(route: string) {
    this.router.navigate([route])
  }

  next() {
    let page = this.storeService.pageOfpublicStores()
    if (page != null && page.meta.page < page.meta.pageCount) {
      this.storeService.requestPublicStores(page.meta.page + 1)
    }
  }

  previous() {
    let page = this.storeService.pageOfpublicStores()
    if (page != null && page.meta.page > 1) {
      this.storeService.requestPublicStores(page.meta.page - 1)
    }
  }

  search() {
    this.storeService.requestPublicStores(1, 10, this.inputValue())
  }

  ngOnDestroy() {
    this.storeService.resetPublic()
  }

  goToStore(store: IStore) {
    this.router.navigate(["/store"],
      {
        queryParams: { store: store.id }
      }
    )
  }
}
