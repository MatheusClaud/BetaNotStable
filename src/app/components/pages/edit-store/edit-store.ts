import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { applyPipeInField } from '../../../_shared/form/custom-form-modifier';
import { brazilianCurrencyFormat, cnpjPipeFormat, dateWithHourFormat } from '../../../_shared/form/custom-fields-pipes';
import { IFormBasicKit } from '../../../_shared/form/custom-form-basickit';
import { ImageSelector } from "../../elements/image-selector/image-selector";
import { StoreService } from '../../../services/api/store-service';
import { CropImagesService } from '../../../services/crop-images/crop-images-service';
import { CreateStoreData, EditStoreData, IStore } from '../../../models/entity/store-interface';
import { Router } from '@angular/router';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { CropperDialogResult } from '../../dialog/crop-images/crop-images.dialog';

@Component({
  selector: 'app-edit-store',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ImageSelector,
    MatSlideToggleModule
  ],
  templateUrl: './edit-store.html',
  styleUrl: './edit-store.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditStore extends IFormBasicKit {

  #router = inject(Router)
  storeService = inject(StoreService)
  imagesService = inject(CropImagesService)

  store = signal<IStore>(new IStore)

  public timeOptions: string[] = [];
  public days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  newAdded: CropperDialogResult[] = []
  toRemove: string[] = []

  constructor() {
    super()
    effect(() => {
      this.validateRoute()
      this.checkSucessInDeleteStore()
      this.checkSucessInEditStore()
    })
    this.validateRoute()
    this.form = this.fb.group({
      createdAt: [dateWithHourFormat(this.store().createdAt)],
      updatedAt: [dateWithHourFormat(this.store().updatedAt)],
      isActive: [this.store().isActive],
      name: [this.store().name, [Validators.required]],
      cnpj: [this.store().cnpj, [Validators.required, Validators.minLength(18)]],
      description: [this.store().description, [Validators.required]],
      instagram: [this.store().instagram],
      minOrderValue: [this.store().minOrderValue, [Validators.required]],
      minOrderQuantity: [this.store().minOrderQuantity, [Validators.required]],
      monday: [this.store().businessHours.mon?.length > 0],
      tuesday: [this.store().businessHours.tue?.length > 0],
      wednesday: [this.store().businessHours.wed?.length > 0],
      thursday: [this.store().businessHours.thu?.length > 0],
      friday: [this.store().businessHours.fri?.length > 0],
      saturday: [this.store().businessHours.sat?.length > 0],
      sunday: [this.store().businessHours.sun?.length > 0],
      businessHours: this.fb.group({
        open: [IStore.getHour(this.store()).open, Validators.required],
        close: [IStore.getHour(this.store()).close, Validators.required],
      })
    });

    this.generateTimeOptions();
  }

  ngOnInit() {
    applyPipeInField(this.form, 'cnpj', cnpjPipeFormat);
    applyPipeInField(this.form, 'minOrderValue', brazilianCurrencyFormat)
    this.form.get('cnpj')?.disable()
    this.form.get('name')?.disable()
    this.form.get('createdAt')?.disable()
    this.form.get('updatedAt')?.disable()
  }

  ngOnDestroy() {
    this.storeService.reset()
    this.storeService.resetForEdit()
  }

  private validateRoute() {
    if (this.storeService.storeToEdit() != null) {
      this.store.set(this.storeService.storeToEdit()!!)
    }
    else {
        this.#router.navigate(["/account-settings/my-stores"])
    }
  }

  private generateTimeOptions(): void {
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        this.timeOptions.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      }
    }
  }

  get selectedDays(): string[] {
    return this.days.filter(day => this.form.get(day)?.value === true);
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const hasFieldsChanged = IStore.hasFormFieldChanged(this.store(), this.form.value)
    if (hasFieldsChanged) {

    }
    
    if (this.store().privateImageUrls !== null) {

    }
    this.newAdded = this.imagesService.indexedImages().filter(item => !this.store().privateImageUrls.includes(item.imageUrl))
    this.toRemove = this.store().privateImageUrls.filter(item => !this.imagesService.indexedImages().map(e => e.imageUrl).includes(item))

    let store = new EditStoreData(this.form.value)
    if (this.toRemove.length > 0) { store.privateImageUrls = [] }
    console.log(store)
    this.storeService.editStore(this.store().id, store)
  }

  checkSucessInDeleteStore() {
    if (this.storeService.getSucessInDeleteStore()) {
      this.store.set({} as IStore)
      this.#router.navigate(["/account-settings/my-stores"])
    }
  }

  checkSucessInEditStore() {
    if (this.storeService.sucessInEditStore()) {
      if (this.newAdded.length > 0) {
        this.storeService.setImagesToStore(this.storeService.storeToEdit()!!.id, this.newAdded.map((value) => {
          return value.blob!!
        }))   
      } else {
        //this.#router.navigate(["/account-settings/my-stores"])
      }
    }
  }

  deleteStore() {
    this.storeService.deleteStore(this.store().id)
  }
}