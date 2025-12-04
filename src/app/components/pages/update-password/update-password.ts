import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IFormBasicKit } from '../../../_shared/form/custom-form-basickit';
import { passwordFormatValidator } from '../../../_shared/form/custom-validators';
import { UserService } from '../../../services/user/user-service';

@Component({
  selector: 'app-update-password',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './update-password.html',
  styleUrl: './update-password.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdatePassword extends IFormBasicKit {

  userService = inject(UserService)

  constructor() {
    super()
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8), passwordFormatValidator]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(8), passwordFormatValidator]],
    });
  }

  arePasswordsEqual(): boolean {
    return this.form.get('password')?.value === this.form.get('passwordConfirm')?.value
  }

  onSubmit(): void {
    
    this.userService.updateUserPassword(this.form.get('password')?.value)
  }
}
