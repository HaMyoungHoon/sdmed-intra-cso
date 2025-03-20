import {Component} from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {UserRole} from "../../../../models/rest/user/user-role";
import {HospitalModel} from "../../../../models/rest/hospital/hospital-model";
import {HospitalListService} from "../../../../services/rest/hospital-list.service";
import * as FExtensions from "../../../../guards/f-extensions";

@Component({
  selector: "app-hospital-add",
  templateUrl: "./hospital-add.component.html",
  styleUrl: "./hospital-add.component.scss",
  standalone: false,
})
export class HospitalAddComponent extends FComponentBase {
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
      window.close();
      return;
    }
    this.fDialogService.warn("saveData", ret.msg);
  }
}
