import { Injectable, signal } from "@angular/core";
import { CropperDialogResult } from "../../components/dialog/crop-images/crop-images.dialog";

@Injectable({
  providedIn: 'root'
})
export class CropImagesService {

    indexedImages = signal<Array<CropperDialogResult>>([])
    #selectedImages = signal<Array<CropperDialogResult>>([])
    public getSelectedImages = this.#selectedImages.asReadonly()

    public setSelectedImages(images: Array<CropperDialogResult>) {
        this.#selectedImages.set(images)
    }
}