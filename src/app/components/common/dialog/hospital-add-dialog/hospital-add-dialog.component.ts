import {Component} from "@angular/core";
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {ImageModule} from "primeng/image";
import {InputTextModule} from "primeng/inputtext";
import {NgIf} from "@angular/common";
import {ProgressSpinComponent} from "../../progress-spin/progress-spin.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslatePipe} from "@ngx-translate/core";
import {FDialogComponentBase} from "../../../../guards/f-dialog-component-base";
import {UserRole} from "../../../../models/rest/user/user-role";
import {HospitalModel} from "../../../../models/rest/hospital/hospital-model";
import * as FExtensions from "../../../../guards/f-extensions";
import {HospitalListService} from "../../../../services/rest/hospital-list.service";

@Component({
  selector: "app-hospital-add-dialog",
  imports: [ButtonModule, CardModule, ImageModule, InputTextModule, NgIf, ProgressSpinComponent, ReactiveFormsModule, TranslatePipe, FormsModule],
  templateUrl: "./hospital-add-dialog.component.html",
  styleUrl: "./hospital-add-dialog.component.scss",
  standalone: true,
})
export class HospitalAddDialogComponent extends FDialogComponentBase {
  hospitalModel: HospitalModel = new HospitalModel();
  constructor(private thisService: HospitalListService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.HospitalChanger));
  }

  override async ngInit(): Promise<void> {
  }

  async saveData(): Promise<void> {
    if (this.hospitalModel.code.length <= 0) {
      this.translateService.get("hospital-add.warn.code").subscribe(x => {
        this.fDialogService.warn("saveData", x);
      });
      return
    }
    if (this.hospitalModel.orgName.length <= 0) {
      this.translateService.get("hospital-add.warn.org-name").subscribe(x => {
        this.fDialogService.warn("saveData", x);
      });
      return;
    }
    if (this.hospitalModel.innerName.length <= 0) {
      this.translateService.get("hospital-add.warn.inner-name").subscribe(x => {
        this.fDialogService.warn("saveData", x);
      });
      return;
    }
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.postData(this.hospitalModel),
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
