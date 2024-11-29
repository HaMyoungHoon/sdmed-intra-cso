import {Component} from "@angular/core";
import {UserService} from "../../../../../services/rest/user.service";
import {FDialogService} from "../../../../../services/common/f-dialog.service";
import {FComponentBase} from "../../../../../guards/f-component-base";
import {UserDataModel} from "../../../../../models/rest/user-data-model";
import {statusToUserStatusDesc} from "../../../../../models/rest/user-status";
import {getSeverity} from "../../../../../guards/f-extensions";
import {flagToRoleDesc} from "../../../../../models/rest/user-role";

@Component({
  selector: "app-user-setting",
  templateUrl: "./user-setting.component.html",
  styleUrl: "./user-setting.component.scss"
})
export class UserSettingComponent extends FComponentBase {
  userDataModel?: UserDataModel[];
  userLoading: boolean = false;
  constructor(private userService: UserService, private fDialogService: FDialogService) {
    super();
  }

  override ngInit(): void {
    this.getUserDataModel();
  }
  getUserDataModel(): void {
    this.userLoading = true;
    this.userService.getUserAll().then(x => {
      this.userLoading = false;
      if (x.result) {
        this.userDataModel = x.data
        return;
      }

      this.fDialogService.warn("getUserAll", x.msg);
    }).catch(x => {
      this.userLoading = false;
      this.fDialogService.error("getUserAll", x.message);
    })
  }

  refreshUserDataModel(): void {
    this.getUserDataModel();
  }
  userEdit(data: UserDataModel): void {
    this.fDialogService.openUserEditDialog({
      modal: true,
      closable: false,
      closeOnEscape: true,
      draggable: true,
      resizable: true,
      width: "80%",
      height: "80%",
      data: data
    }).subscribe((x): void => {
      const target = this.userDataModel?.findIndex(y => y.thisPK == x.thisPK) ?? 0
      if (target > 0) {
        new UserDataModel().copyLhsToRhs(this.userDataModel!![target], x);
      }
    });
  }

  protected readonly statusToUserStatusDesc = statusToUserStatusDesc;
  protected readonly getSeverity = getSeverity;
  protected readonly flagToRoleDesc = flagToRoleDesc;
}
