import { Component } from "@angular/core";
import {FDialogComponentBase} from "../../../../guards/f-dialog-component-base";
import {MyInfoService} from "../../../../services/rest/my-info.service";
import {ButtonModule} from "primeng/button";
import {FloatLabel} from "primeng/floatlabel";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {PasswordModule} from "primeng/password";
import {TranslatePipe} from "@ngx-translate/core";
import * as FExtensions from "../../../../guards/f-extensions";

@Component({
  selector: "app-password-change-dialog",
  imports: [ButtonModule, FloatLabel, FormsModule, InputTextModule, PasswordModule, TranslatePipe],
  templateUrl: "./password-change-dialog.component.html",
  styleUrl: "./password-change-dialog.component.scss",
  standalone: true
})
export class PasswordChangeDialogComponent extends FDialogComponentBase {
  currentPW: string = "";
  afterPW: string = "";
  confirmPW: string = "";
  passwordChangeDisable: boolean = true;
  constructor(private thisService: MyInfoService) {
    super();
  }

  async passwordChange(): Promise<void> {
    if (this.afterPW.length < 4) {
      this.translateService.get("password-change-dialog.warn.after-pw").subscribe(x => {
        this.fDialogService.warn("passwordChange", x);
      });
      return;
    }
    if (this.afterPW != this.confirmPW) {
      this.translateService.get("password-change-dialog.warn.confirm-pw").subscribe(x => {
        this.fDialogService.warn("passwordChange", x);
      });
      return;
    }
    const ret = await FExtensions.restTry(async() => await this.thisService.putPasswordChange(this.currentPW, this.afterPW, this.confirmPW),
      e => this.fDialogService.error("passwordChange", e));
    if (ret.result) {
      this.ref.close();
      return;
    }
    this.fDialogService.warn("passwordChange", ret.msg);
  }

  currentPWChange(event: any): void {
    this.setPasswordChange();
  }
  afterPWChange(event: any): void {
    this.setPasswordChange();
  }
  confirmPWChange(event: any): void {
    this.setPasswordChange();
  }

  setPasswordChange(): void {
    if (this.currentPW.length <= 0) {
      this.passwordChangeDisable = true;
    } else if (this.afterPW.length <= 0) {
      this.passwordChangeDisable = true;
    } else if (this.confirmPW.length <= 0) {
      this.passwordChangeDisable = true;
    } else {
      this.passwordChangeDisable = false;
    }
  }

  get confirmPWClass(): string {
    if (this.confirmPW != this.afterPW) {
      return "ng-invalid ng-dirty";
    }
    return "";
  }
}
