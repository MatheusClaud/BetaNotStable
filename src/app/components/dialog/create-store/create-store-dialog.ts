import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogRef } from '@angular/material/dialog';

import { ErrorRequired, ErrorMinLength } from '../../../_shared/form/custom-validators';
import { applyPipeInField, fieldHasError, fieldTouched } from '../../../_shared/form/custom-form-modifier';
import { cnpjPipeFormat } from '../../../_shared/form/custom-fields-pipes';
import { IFormBasicKit } from '../../../_shared/form/custom-form-basickit';

@Component({
  selector: 'app-create-store-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './create-store-dialog.html',
  styleUrl: './create-store-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateStoreDialog extends IFormBasicKit {

  #dialogRef = inject(MatDialogRef<CreateStoreDialog>)
  // TODO: Inject a StoreServiceere
  // #storeService = inject(StoreService)

  public timeOptions: string[] = [];
  public days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  public initialHour = {
    open: ['08:00', Validators.required],
    close: ['18:00', Validators.required]
  }

  constructor() {
    super()
    this.form = this.fb.group({
      name: ['Teste', [Validators.required]],
      cnpj: ['00.000.000/0000-00', [Validators.required, Validators.minLength(18)]], // CNPJ formatado tem 18 caracteres (XX.XXX.XXX/XXXX-XX)
      description: ['desc desc', [Validators.required]],
      instagram: ['insta'],
      minOrderValue: ['R$ 500.00', [Validators.required]],
      minOrderQuantity: ['12', [Validators.required]],
      monday: [false],
      tuesday: [false],
      wednesday: [false],
      thursday: [false],
      friday: [false],
      saturday: [false],
      sunday: [false],
      businessHours: this.fb.group(this.initialHour)
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
  }

  close(): void {
    this.#dialogRef.close();
  }

  get selectedDays(): string[] {
    return this.days.filter(day => this.form.get(day)?.value === true);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    // TODO: Call store creation service
    // this.#storeService.createStore(this.createStoreForm.value).subscribe(() => this.close());
    console.log('Form submitted:', this.form.value);
    this.close();
  }
}