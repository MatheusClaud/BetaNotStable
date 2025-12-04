import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { IFormBasicKit } from '../../../_shared/form/custom-form-basickit';
import { ResetPasswordService } from '../../../services/authentication/reset-password-service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordDialog extends IFormBasicKit {

  #dialogRef = inject(MatDialogRef<ResetPasswordDialog>)
  service = inject(ResetPasswordService)

  constructor() {
    super();
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.service.reset()
  }

  close(): void {
    this.#dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.service.sendResetEmail(this.form.value.email);
  }
}