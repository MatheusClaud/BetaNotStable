import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../services/api/product-service';
import { CreateProductData, EditProductData, IProduct } from '../../../../models/entity/product-interface';
import { IFormBasicKit } from '../../../../_shared/form/custom-form-basickit';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ImageSelector } from '../../../elements/image-selector/image-selector';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { applyPipeInField } from '../../../../_shared/form/custom-form-modifier';
import { brazilianCurrencyFormat } from '../../../../_shared/form/custom-fields-pipes';
import { CropImagesService } from '../../../../services/crop-images/crop-images-service';
import { CropperDialogResult } from '../../../dialog/crop-images/crop-images.dialog';

@Component({
  selector: 'app-edit-product',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggle,
    ImageSelector,
  ],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditProduct extends IFormBasicKit {

  productService = inject(ProductService)
  route = inject(ActivatedRoute)
  #router = inject(Router)
  imagesService = inject(CropImagesService)

  product = signal({} as IProduct)

   newAdded: CropperDialogResult[] = []
   toRemove: string[] = []

  constructor() {
    super()

    effect(() => {
      if (this.productService.sucessInRemoveProduct()) {
        this.goToProducts()
      }
    })
    
    let product = this.productService.productInEdit()
    if (product === null) { this.goToProducts() }
    this.product.set(product!!)

    this.form = this.fb.group({
      name: [product?.name, [Validators.required]],
      description: [product?.description, [Validators.required]],
      basePrice: [product?.basePrice, [Validators.required]],
      colorToAdd: ['', []],
      sizeToAdd: ['', []],
      isActive: [product?.isActive],
    });
    
    if (product?.attributes.colors !== undefined) {
      this.colors.set(product?.attributes.colors)
    }
    if (product?.attributes.sizes !== undefined) {
      this.sizes.set(product?.attributes.sizes)
    }
  }

  ngOnInit() {
    applyPipeInField(this.form, "basePrice", brazilianCurrencyFormat)
  }

  ngOnDestroy() {
    this.productService.resetForEdit()
  }

  goToProducts() {
    this.#router.navigate(["/account-settings/products"])    
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

  deleteProduct() {
    this.productService.deleteProduct(this.product().id)
  }

  onSubmit() {
    if (this.form.invalid) return;
    
    this.newAdded = this.imagesService.indexedImages().filter(item => !this.product().privateImageUrls.includes(item.imageUrl))
    this.toRemove = this.product().privateImageUrls.filter(item => !this.imagesService.indexedImages().map(e => e.imageUrl).includes(item))

    
    let atributes = {
      sizes: this.sizes().length > 0 ? this.sizes() : [],
      colors: this.colors().length > 0 ? this.colors() : []
    }

    let product = new EditProductData(this.form.value, atributes)

    if (this.newAdded.length == 0 && this.toRemove.length == 0) {
      // product.privateImageUrls = this.product().privateImageUrls
      product.privateImageUrls = this.imagesService.indexedImages().map(e => e.imageUrl)
    }
    else if (this.toRemove.length > 0) {
      product.privateImageUrls = this.imagesService.indexedImages().filter(e => !this.toRemove.includes(e.imageUrl)).map(e => e.imageUrl)
    } else if (this.newAdded.length > 0) {
      this.productService.setImagesToStore(this.product().id, this.newAdded.map((value) => {
            return value.blob!!
          }))
    }

    this.productService.editProduct(this.product().id, product)
  }
}
