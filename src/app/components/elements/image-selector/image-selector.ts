import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, Input, OnDestroy, signal, untracked } from '@angular/core';
import { DialogStateService } from '../../../services/dialog/dialog-state-service';
import { IDialog } from '../../../models/shared/dialog-enum';
import { CropImagesService } from '../../../services/crop-images/crop-images-service';
import { CropperDialogResult } from '../../dialog/crop-images/crop-images.dialog';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-image-selector',
  imports: [
    CommonModule,
    CdkDropList,
    CdkDrag,
  ],
  templateUrl: './image-selector.html',
  styleUrl: './image-selector.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageSelector implements OnDestroy {

  @Input() imagesLinkToStart: Array<string> = []
  @Input() imageLimit = 8
  imageLimitSurpassed = signal(false)
  userHasOpenDialog = signal(false)

  #dialogService = inject(DialogStateService)
  imagesService = inject(CropImagesService)

  indexedImages = signal<Array<CropperDialogResult>>([])

  constructor() {
    effect(() => {
      if (this.imagesLinkToStart.length > 0) {
        this.indexedImages.set(this.imagesLinkToStart.map((elem) => { return { blob: null, imageUrl: elem}}))
      }
    })
    effect(() => {
      const selected = this.imagesService.getSelectedImages()
      untracked(() => {
        if (this.userHasOpenDialog()) {
          const indexed = this.indexedImages
          if (selected.length > 0 && indexed().length === 0) {
            indexed.set(this.imagesService.getSelectedImages())
          } else if (indexed().length + selected.length > this.imageLimit) {
            this.imageLimitSurpassed.set(true)
          } else {
            indexed.update((old) => [...old, ...selected])
          }
        }
      })
    })
    effect(() => {
      this.imagesService.indexedImages.set(this.indexedImages())
    })
  }

  fileSelected(event: any) {
    const file = event.target?.files[0];
    console.log(event.target.files)

    if (event.target.files.length > this.imageLimit) {
      this.imageLimitSurpassed.set(true)
    }
    else {
      this.imageLimitSurpassed.set(false)
      this.userHasOpenDialog.set(true)
      this.#dialogService.setCurrentDialogVisibility(IDialog.CropImagesDialog, event.target.files)
    }
  }

  drop(event: CdkDragDrop<any>): void {
    this.indexedImages.update(arr => {
      const copy = [...arr]
      moveItemInArray(copy, event.previousIndex, event.currentIndex);
      return copy;
    })
  }

  removeIndex(index: number) {
    if (this.indexedImages().length === 1) {
      this.indexedImages.set([])
    } else {
      this.indexedImages.update((list) => {
        let newe = [...list]
        newe.splice(index, 1)
        return newe
      })
    }
  }

  ngOnDestroy() {
    this.userHasOpenDialog.set(false)
    this.indexedImages.set([])
  }
}
