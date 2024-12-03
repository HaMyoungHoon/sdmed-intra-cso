import {afterNextRender, ChangeDetectorRef, Component} from "@angular/core";
import {FDialogService} from "../../../services/common/f-dialog.service";
import {DynamicDialogRef} from "primeng/dynamicdialog";
import {UserService} from "../../../services/rest/user.service";
import {setLocalStorage} from "../../../guards/f-amhohwa";
import * as FConstants from "../../../guards/f-constants";
import {PasswordModule} from "primeng/password";
import {FormsModule} from "@angular/forms";
import {FloatLabelModule} from "primeng/floatlabel";
import {Button} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {restTry} from '../../../guards/f-extensions';

@Component({
  selector: "app-sign-dialog",
  imports: [PasswordModule, FormsModule, FloatLabelModule, Button, InputTextModule],
  templateUrl: "./sign-dialog.component.html",
  styleUrl: "./sign-dialog.component.scss",
  standalone: true,
})
export class SignDialogComponent {
  id: string;
  pw: string;
  constructor(private cd: ChangeDetectorRef, private fDialogService: FDialogService,
              private ref: DynamicDialogRef, private userService: UserService) {
    this.id = "";
    this.pw = "";
    afterNextRender(() => {
      this.cd.markForCheck();
    });
  }

  async signIn(): Promise<void> {
    const ret = await restTry(async() => await this.userService.signIn(this.id, this.pw),
        e => this.fDialogService.error("signIn catch", e.message));
    if (ret.result) {
      setLocalStorage(FConstants.AUTH_TOKEN, ret.data ?? "");
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
