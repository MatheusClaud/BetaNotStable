import { ChangeDetectionStrategy, Component, computed, effect, inject, linkedSignal, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { IFormBasicKit } from '../../../_shared/form/custom-form-basickit';
import { TruncateFilenamePipe } from '../../../pipes/truncate-filename.pipe';
import { CropImagesService } from '../../../services/crop-images/crop-images-service';

export type CropperDialogData = {
  image: File;
  width: number;
  height: number;
};

export type CropperDialogResult = {
  blob: Blob | null;
  imageUrl: string
};

@Component({
  selector: 'app-crop-image-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ImageCropperComponent,
    TruncateFilenamePipe
  ],
  templateUrl: './crop-images-dialog.html',
  styleUrl: './crop-images-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CropImagesDialog extends IFormBasicKit {

  #cropImageService = inject(CropImagesService)
  #dialogRef = inject(MatDialogRef<CropImagesDialog>)
  data: Array<File> = inject(MAT_DIALOG_DATA);

  indexedData = signal<Array<File>>([]);
  selectedIndex = signal<number>(-1);

  currentResult = signal<CropperDialogResult | undefined>(undefined);
  indexToCrop = signal<number>(-1);
  resultList = signal<Map<string, CropperDialogResult>>(new Map());
  areAllImagesSelected = signal<boolean>(false);


  width = 400;
  height = 400;

  constructor() {
    effect(() => {
      if (this.indexToCrop() !== -1 && this.currentResult() != undefined) {
        let newMap = new Map(this.resultList())
        let key = this.indexedData()[this.indexToCrop()!!]?.name!!
        newMap.set(key, this.currentResult()!!)
        this.resultList.set(newMap)
        this.indexToCrop.set(-1)
        if (this.selectedIndex() < this.indexedData().length-1) {
          this.selectedIndex.update(value => value + 1)
        }
      }
      if (this.resultList().size === this.getItemsInDisplay().length) {
        this.areAllImagesSelected.set(true)
      }
    })
    super()
    this.indexedData.set(Array.from(this.data))
    if (this.indexedData().length > 0) { this.setSelectedIndex(0)}
  }

  ngOnInit() {
  }

  close(): void {
    this.#dialogRef.close();
  }

  setSelectedIndex(index: number) {
    this.selectedIndex.set(index);
  }

  cutImage() {
    this.indexToCrop.set(this.selectedIndex())
  }

  deleteItem(index: number) {
    if (this.resultList().has(this.indexedData()[index].name)) {
      this.resultList().delete(this.indexedData()[index].name)
      console.log(this.resultList())
    }
    let spliced = [...this.indexedData()]
    spliced.splice(index, 1)
    if (spliced.length === 0) {
      this.close()
    } else {
      if (this.selectedIndex() === index){
        this.selectedIndex.set(index - 1)
      }
      else if (this.selectedIndex() > spliced.length - 1) {
        this.selectedIndex.set(spliced.length - 1)
      }
      this.indexedData.set(spliced)
    }
  }

  getItemsInDisplay(): Array<File> {
    return this.indexedData()
  }

  imageCropped(event: ImageCroppedEvent) {
    const { blob, objectUrl } = event;

    if (blob && objectUrl) {
      this.currentResult.set({ blob: blob, imageUrl: objectUrl })
    }
  }

  saveImages() {
    let data: Array<CropperDialogResult> = this.indexedData().map(
      (item: File) => {
        if (this.resultList().has(item.name)) {
          return this.resultList().get(item.name) as CropperDialogResult
        }
        else {
          return { blob: null, imageUrl: '' } as CropperDialogResult
        }
      })

    this.#cropImageService.setSelectedImages(data)
    this.#dialogRef.close()
  }
}