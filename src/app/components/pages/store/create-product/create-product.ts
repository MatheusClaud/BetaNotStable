import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { ImageSelector } from '../../../elements/image-selector/image-selector';
import { IFormBasicKit } from '../../../../_shared/form/custom-form-basickit';
import { StoreService } from '../../../../services/api/store-service';
import { CropImagesService } from '../../../../services/crop-images/crop-images-service';
import { brazilianCurrencyFormat } from '../../../../_shared/form/custom-fields-pipes';
import { applyPipeInField } from '../../../../_shared/form/custom-form-modifier';
import { OnlyNumbersDirective } from '../../../../directives/form/only-numbers-directive';
import { CreateProductData } from '../../../../models/entity/product-interface';
import { ProductService } from '../../../../services/api/product-service';

@Component({
  selector: 'app-create-product',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ImageSelector
  ],
  templateUrl: './create-product.html',
  styleUrl: './create-product.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateProduct extends IFormBasicKit {

  #router = inject(Router)
  storeService = inject(StoreService)
  productService = inject(ProductService)
  imagesService = inject(CropImagesService)

  public timeOptions: string[] = [];

  constructor() {
    effect(() => {
      if (this.productService.createdProductId() !== null) {
        this.checkSucessInCreatProduct()
      }
    })
    super()
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      basePrice: ['', [Validators.required]],
      colorToAdd: ['', []],
      sizeToAdd: ['', []],
      // minQuantityToAdd: [''],
      // unitPriceToAdd: ['']
    });
  }

  ngOnInit() {
    applyPipeInField(this.form, "basePrice", brazilianCurrencyFormat)
  }

  ngOnDestroy() {
    this.productService.reset()
  }


  onSubmit(): void {
    if (this.form.invalid) return;

    let atributes = {
      sizes: this.sizes().length > 0 ? this.sizes() : [],
      colors: this.colors().length > 0 ? this.colors() : []
    }

    let product = new CreateProductData(this.form.value, atributes)

    if (this.productService.createdProductId() == null) {
      this.productService.createStore(this.storeService.storeToEdit()!!.id, product)
    } else {
      this.checkSucessInCreatProduct()
    }
  }

  checkSucessInCreatProduct() {
    if (this.productService.createdProductId() != null) {
      if (this.imagesService.indexedImages().length > 0 && this.productService.sucessInSendImages() == false) {
        this.productService.setImagesToStore(this.productService.createdProductId()!!, this.imagesService.indexedImages().map((value) => {
          return value.blob!!
        }))   
      } else {
        this.#router.navigate(["/account-settings/products"])
      }
    }
  }

  colors = signal<string[]>([])
  errorOnAddColor = signal(false)

  addColor() {
    const color = this.form.get("colorToAdd")
    if (color === null || color.value === "" || this.colors().filter(elem => elem === color.value).length > 0) {
      this.errorOnAddColor.set(true)
    } else {
      this.errorOnAddColor.set(false)
      this.colors.update(old => [...old, color.value])
    }
  }

  removeColor(index: number) {
    if (this.colors().length === 1) {
      this.colors.set([])
    } else {
      this.colors.update((old) => {
        let newe = [...old]
        newe.splice(index, 1)
        return newe
      })
    }
  }

  sizes = signal<string[]>([])
  errorOnAddSize = signal(false)

  addSize() {
    const size = this.form.get("sizeToAdd")
    if (size === null || size.value === "" || this.sizes().filter(elem => elem === size.value).length > 0) {
      this.errorOnAddSize.set(true)
    } else {
      this.errorOnAddSize.set(false)
      this.sizes.update(old => [...old, size.value])
    }
  }

  removeSize(index: number) {
    if (this.sizes().length === 1) {
      this.sizes.set([])
    } else {
      this.sizes.update((old) => {
        let newe = [...old]
        newe.splice(index, 1)
        return newe
      })
    }
  }
}