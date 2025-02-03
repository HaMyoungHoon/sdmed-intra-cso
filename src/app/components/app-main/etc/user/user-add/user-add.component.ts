import {Component} from "@angular/core";
import {FComponentBase} from "../../../../../guards/f-component-base";
import {
  allUserRoleDescArray,
  stringArrayToUserRole,
  UserRole,
  userRoleToFlag
} from "../../../../../models/rest/user/user-role";
import * as FExtensions from "../../../../../guards/f-extensions";
import {allUserDeptDescArray, stringArrayToUserDept, userDeptToFlag} from "../../../../../models/rest/user/user-dept";
import {
  allUserStatusDescArray,
  StatusDescToUserStatus,
  statusToUserStatusDesc, UserStatus
} from "../../../../../models/rest/user/user-status";
import {UserDataModel} from "../../../../../models/rest/user/user-data-model";

@Component({
  selector: "app-user-add",
  templateUrl: "./user-add.component.html",
  styleUrl: "./user-add.component.scss",
  standalone: false,
})
export class UserAddComponent extends FComponentBase {
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
    if (!FExtensions.regexIdCheck(this.userDataModel.id)) {
      this.translateService.get("user-add.warn.id").subscribe(x => {
        this.fDialogService.warn("save", x);
      });
      return
    }
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
      window.close();
      return;
    }
    this.fDialogService.warn("save", ret.msg);
  }
  async onIDChange(data: any): Promise<void> {
    this.userDataModel.id = this.userDataModel.id.replace(" ", "");
  }
  async onPWChange(data: any): Promise<void> {
    this.userDataModel.pw = this.userDataModel.pw.replace(" ", "");
  }
  async onPWConfirmChange(data: any): Promise<void> {
    this.confirmPW = this.confirmPW.replace(" ", "");
  }
}
