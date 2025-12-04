import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { applyPipeInField } from '../../../_shared/form/custom-form-modifier';
import { brazilianCurrencyFormat, cnpjPipeFormat } from '../../../_shared/form/custom-fields-pipes';
import { IFormBasicKit } from '../../../_shared/form/custom-form-basickit';
import { ImageSelector } from "../../elements/image-selector/image-selector";
import { StoreService } from '../../../services/api/store-service';
import { CropImagesService } from '../../../services/crop-images/crop-images-service';
import { CreateStoreData, IStore } from '../../../models/entity/store-interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-store',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ImageSelector,
],
  templateUrl: './create-store.html',
  styleUrl: './create-store.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateStore extends IFormBasicKit {

  #router = inject(Router)
  storeService = inject(StoreService)
  imagesService = inject(CropImagesService)

  public timeOptions: string[] = [];
  public days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  constructor() {
    effect(() => {
      if (this.storeService.getIdOfCreatedStore() !== null) {
        this.checkSucessInCreateStore() 
      }
    })
    super()
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      cnpj: ['', [Validators.required, Validators.minLength(18)]],
      description: ['', [Validators.required]],
      instagram: [''],
      minOrderValue: ['', [Validators.required]],
      minOrderQuantity: ['', [Validators.required]],
      monday: [false],
      tuesday: [false],
      wednesday: [false],
      thursday: [false],
      friday: [false],
      saturday: [false],
      sunday: [false],
      businessHours: this.fb.group({
        open: ['08:00', Validators.required],
        close: ['18:00', Validators.required]
      })
    });

    this.generateTimeOptions();
  }

  private generateTimeOptions(): void {
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        this.timeOptions.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      }
    }
  }

  ngOnInit() {
    applyPipeInField(this.form, 'cnpj', cnpjPipeFormat);
    applyPipeInField(this.form, 'minOrderValue', brazilianCurrencyFormat)
  }

  ngOnDestroy() {
    this.storeService.reset()
    this.storeService.resetForEdit()
    this.imagesService.indexedImages.set([])
  }

  get selectedDays(): string[] {
    return this.days.filter(day => this.form.get(day)?.value === true);
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    let store = new CreateStoreData(this.form.value)

    if (this.storeService.getIdOfCreatedStore() == null) {
      this.storeService.createStore(store)
    } else {
      this.checkSucessInCreateStore()
    }
  }

  checkSucessInCreateStore() {
    if (this.storeService.getSucessInSendImages()) {
      this.#router.navigate(["/account-settings/my-stores"])
    }
    if (this.storeService.getIdOfCreatedStore() != null) {
      if (this.imagesService.indexedImages().length > 0 && this.storeService.getSucessInSendImages() == false) {
        this.storeService.setImagesToStore(this.storeService.getIdOfCreatedStore()!!, this.imagesService.indexedImages().map((value) => {
          return value.blob!!
        }))   
      } else {
        this.#router.navigate(["/account-settings/my-stores"])
      }
    }
  }
}