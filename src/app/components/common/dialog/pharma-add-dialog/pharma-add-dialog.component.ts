import {Component} from "@angular/core";
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {CheckboxModule} from "primeng/checkbox";
import {FormsModule} from "@angular/forms";
import {ImageModule} from "primeng/image";
import {InputTextModule} from "primeng/inputtext";
import {NgIf} from "@angular/common";
import {ProgressSpinComponent} from "../../progress-spin/progress-spin.component";
import {TranslatePipe} from "@ngx-translate/core";
import {PharmaListService} from "../../../../services/rest/pharma-list.service";
import {PharmaModel} from "../../../../models/rest/pharma/pharma-model";
import {UserRole} from "../../../../models/rest/user/user-role";
import {FDialogComponentBase} from "../../../../guards/f-dialog-component-base";
import * as FExtensions from "../../../../guards/f-extensions";
import {DatePicker} from "primeng/datepicker";

@Component({
  selector: "app-pharma-add-dialog",
  imports: [ButtonModule, CardModule, CheckboxModule, FormsModule, ImageModule, InputTextModule, NgIf, ProgressSpinComponent, TranslatePipe, DatePicker],
  templateUrl: "./pharma-add-dialog.component.html",
  styleUrl: "./pharma-add-dialog.component.scss",
  standalone: true,
})
export class PharmaAddDialogComponent extends FDialogComponentBase {
  pharmaModel: PharmaModel = new PharmaModel();
  constructor(private thisService: PharmaListService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.PharmaChanger));
  }

  override async ngInit(): Promise<void> {

  }

  async saveData(): Promise<void> {
    if (this.pharmaModel.code.length <= 0) {
      this.translateService.get("pharma-add.warn.code").subscribe(x => {
        this.fDialogService.warn("saveData", x);
      });
      return
    }
    if (this.pharmaModel.orgName.length <= 0) {
      this.translateService.get("pharma-add.warn.org-name").subscribe(x => {
        this.fDialogService.warn("saveData", x);
      });
      return;
    }
    if (this.pharmaModel.innerName.length <= 0) {
      this.translateService.get("pharma-add.warn.inner-name").subscribe(x => {
        this.fDialogService.warn("saveData", x);
      });
      return;
    }
    this.setLoading();

    const ret = await FExtensions.restTry(async() => await this.thisService.postData(this.pharmaModel),
      e => this.fDialogService.error("saveData", e));
    this.setLoading(false);
    if (ret.result) {
      this.ref.close(ret.data);
      return;
    }

    this.fDialogService.warn("saveData", ret.msg);
  }
  closeThis(): void {
    this.ref.close();
  }
}
