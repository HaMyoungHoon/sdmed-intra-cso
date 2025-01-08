import { Component } from "@angular/core";
import {FDialogComponentBase} from "../../../../guards/f-dialog-component-base";
import {
  allUserRoleDescArray,
  stringArrayToUserRole,
  UserRole,
  userRoleToFlag
} from "../../../../models/rest/user/user-role";
import * as FExtensions from "../../../../guards/f-extensions";
import {UserDataModel} from "../../../../models/rest/user/user-data-model";
import {Button} from "primeng/button";
import {IftaLabel} from "primeng/iftalabel";
import {InputText} from "primeng/inputtext";
import {MultiSelect} from "primeng/multiselect";
import {ProgressSpinComponent} from "../../progress-spin/progress-spin.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Select} from "primeng/select";
import {TranslatePipe} from "@ngx-translate/core";
import {allUserDeptDescArray, stringArrayToUserDept, userDeptToFlag} from "../../../../models/rest/user/user-dept";
import {
  allUserStatusDescArray,
  StatusDescToUserStatus,
  statusToUserStatusDesc,
  UserStatus
} from "../../../../models/rest/user/user-status";

@Component({
  selector: "app-user-add-dialog-component",
  imports: [Button, IftaLabel, InputText, MultiSelect, ProgressSpinComponent, ReactiveFormsModule, Select, TranslatePipe, FormsModule],
  templateUrl: "./user-add-dialog-component.component.html",
  styleUrl: "./user-add-dialog-component.component.scss",
  standalone: true,
})
export class UserAddDialogComponentComponent extends FDialogComponentBase {
  confirmPW: string = "";
  userDataModel: UserDataModel = new UserDataModel();
  userRoleList: string[] = allUserRoleDescArray();
  userDeptList: string[] = allUserDeptDescArray();
  userStatusList: string[] = allUserStatusDescArray();
  selectedUserRoles: string[] = [];
  selectedUserDepts: string[] = [];
  selectedUserStatus: string = statusToUserStatusDesc(UserStatus.None);
  constructor() {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.UserChanger));
  }

  async saveData(): Promise<void> {
    if (!FExtensions.regexPasswordCheck(this.userDataModel.pw)) {
      this.translateService.get("user-add.warn.after-pw").subscribe(x => {
        this.fDialogService.warn("save", x);
      });
      return
    }
    if (this.confirmPW != this.userDataModel.pw) {
      this.translateService.get("user-add.warn.confirm-pw").subscribe(x => {
        this.fDialogService.warn("save", x);
      });
      return;
    }
    this.setLoading();
    this.userDataModel.role = userRoleToFlag(stringArrayToUserRole(this.selectedUserRoles));
    this.userDataModel.dept = userDeptToFlag(stringArrayToUserDept(this.selectedUserDepts));
    this.userDataModel.status = StatusDescToUserStatus[this.selectedUserStatus];
    const ret = await FExtensions.restTry(async() => await this.commonService.newUser(this.confirmPW, this.userDataModel),
      e => this.fDialogService.error("save", e));
    this.setLoading(false);
    if (ret.result) {
      this.ref.close(ret.data);
      return;
    }
    this.fDialogService.warn("save", ret.msg);
  }
}
