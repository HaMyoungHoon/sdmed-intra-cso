import {Component} from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {UserRole} from "../../../../models/rest/user/user-role";
import {PharmaModel} from "../../../../models/rest/pharma/pharma-model";
import {PharmaListService} from "../../../../services/rest/pharma-list.service";
import * as FExtensions from "../../../../guards/f-extensions";

@Component({
  selector: "app-pharma-add",
  templateUrl: "./pharma-add.component.html",
  styleUrl: "./pharma-add.component.scss",
  standalone: false,
})
export class PharmaAddComponent extends FComponentBase {
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
      window.close();
      return;
    }

    this.fDialogService.warn("saveData", ret.msg);
  }
}
