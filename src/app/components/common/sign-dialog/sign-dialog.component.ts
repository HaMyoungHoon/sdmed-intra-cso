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

@Component({
  selector: "app-sign-dialog",
  standalone: true,
  imports: [PasswordModule, FormsModule, FloatLabelModule, Button, InputTextModule],
  templateUrl: "./sign-dialog.component.html",
  styleUrl: "./sign-dialog.component.scss"
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

  signIn(): void {
    this.userService.signIn(this.id, this.pw).then(x => {
      if (x.result) {
        setLocalStorage(FConstants.AUTH_TOKEN, x.data ?? "");
        this.ref.close();
        return;
      }

      this.fDialogService.warn("signIn", x.msg);
    }).catch(x => {
      this.fDialogService.error("signIn catch", x.message);
    });
  }
  idChange(data: any): void {
    if (this.signInDisable) {
      return;
    }

    if (data.key == "Enter") {
      this.signIn();
    }
  }
  pwChange(data: any): void {
    if (this.signInDisable) {
      return;
    }

    if (data.key == "Enter") {
      this.signIn();
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
