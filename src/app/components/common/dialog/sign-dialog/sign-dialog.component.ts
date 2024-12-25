import {Component} from "@angular/core";
import * as FAmhohwa from "../../../../guards/f-amhohwa";
import * as FConstants from "../../../../guards/f-constants";
import {PasswordModule} from "primeng/password";
import {FormsModule} from "@angular/forms";
import {FloatLabelModule} from "primeng/floatlabel";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import * as FExtensions from "../../../../guards/f-extensions";
import {FDialogComponentBase} from "../../../../guards/f-dialog-component-base";
import {CommonService} from "../../../../services/rest/common.service";

@Component({
  selector: "app-sign-dialog",
  imports: [PasswordModule, FormsModule, FloatLabelModule, ButtonModule, InputTextModule],
  templateUrl: "./sign-dialog.component.html",
  styleUrl: "./sign-dialog.component.scss",
  standalone: true,
})
export class SignDialogComponent extends FDialogComponentBase {
  id: string = "";
  pw: string = "";
  constructor(private thisService: CommonService) {
    super();
    this.roleCheck = false;
  }

  async signIn(): Promise<void> {
    const ret = await FExtensions.restTry(async() => await this.thisService.signIn(this.id, this.pw),
        e => this.fDialogService.error("signIn catch", e));
    if (ret.result) {
      FAmhohwa.setLocalStorage(FConstants.AUTH_TOKEN, ret.data ?? "");
      this.ref.close();
      return;
    }
    this.fDialogService.warn("signIn", ret.msg);
  }
  async idChange(data: any): Promise<void> {
    if (this.signInDisable) {
      return;
    }

    if (data.key == "Enter") {
      await this.signIn();
    }
  }
  async pwChange(data: any): Promise<void> {
    if (this.signInDisable) {
      return;
    }

    if (data.key == "Enter") {
      await this.signIn();
    }
  }

  get signInDisable(): boolean {
    if (this.id.length < 3) {
      return true;
    }
    if (this.pw.length < 4) {
      return true;
    }
    return false;
  }
}
