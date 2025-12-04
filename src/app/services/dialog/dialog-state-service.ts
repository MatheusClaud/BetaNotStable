import { inject, Injectable, signal } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { LoginDialog } from "../../components/dialog/login-dialog/login-dialog";
import { IDialog } from "../../models/shared/dialog-enum";
import { SigninDialog } from "../../components/dialog/signin-dialog/signin-dialog";
import { CreateStoreDialog } from "../../components/dialog/create-store/create-store-dialog";
import { ResetPasswordDialog } from "../../components/dialog/reset-password/reset-password";
import { ValidatePasswordTokenDialog } from "../../components/dialog/validate-password/validate-password-token";
import { CropImagesDialog } from "../../components/dialog/crop-images/crop-images.dialog";

@Injectable({
  providedIn: 'root'
})
export class DialogStateService {

    #dialog = inject(MatDialog)
    #currentDialog = signal<IDialog>(IDialog.None)

    public getCurrentDialog = this.#currentDialog.asReadonly()

    public setCurrentDialogVisibility(dialog: IDialog, data: any = null) {
        this.#currentDialog.set(dialog)
        switch(dialog) {
          case IDialog.Login:
            this.openDialog(LoginDialog, data)
            break
          case IDialog.SingIn:
            this.openDialog(SigninDialog, data)
            break
          case IDialog.CreateStore:
            this.openDialog(CreateStoreDialog, data)
            break 
          case IDialog.ResetPassword:
            this.openDialog(ResetPasswordDialog, data)
            break
          case IDialog.ValidatePasswordToken:
            this.openDialog(ValidatePasswordTokenDialog, data)
            break
          case IDialog.CropImagesDialog:
            this.openDialog(CropImagesDialog, data)
            break
          default:
            this.#dialog.closeAll()
            break
        }
    }

    private openDialog(component: any, data?: any) {
        const dialogRef = this.#dialog.open(component, {
          width: 'min(85%, 600px)',
          maxWidth: '100vw',
          height: '85vh',
          data: data
        });
    
        dialogRef.afterClosed().subscribe(result => {
          console.log('Modal closed with result:', result);
          this.setCurrentDialogVisibility(IDialog.None)
        });
      }
}