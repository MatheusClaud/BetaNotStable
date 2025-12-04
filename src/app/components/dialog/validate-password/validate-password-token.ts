import { ChangeDetectionStrategy, Component, effect, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordFormatValidator } from '../../../_shared/form/custom-validators';
import { IFormBasicKit } from '../../../_shared/form/custom-form-basickit';
import { ResetPasswordService } from '../../../services/authentication/reset-password-service';
import { ActivatedRoute, Router } from '@angular/router';

export interface ValidatePasswordTokenData {
  success: boolean;
  message: string;
}

@Component({
  selector: 'app-validate-password-token',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './validate-password-token.html',
  styleUrl: './validate-password-token.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValidatePasswordTokenDialog extends IFormBasicKit {

  service = inject(ResetPasswordService)
  #router = inject(Router)
  #dialogRef = inject(MatDialogRef<ValidatePasswordTokenDialog>);
  route = inject(ActivatedRoute)
  token: string | null = null
  
  constructor() {
    super()
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8), passwordFormatValidator]]
    });
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('resetToken');
    if (this.token === null) { this.close() }
    this.service.reset()
  }

  close(): void {
    this.#dialogRef.close();
    this.#router.navigate(['/home']);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.service.resetEmail(this.token!!, this.form.value.password);
  }
}