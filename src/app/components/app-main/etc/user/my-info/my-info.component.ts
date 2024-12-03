import {Component} from "@angular/core";
import {UserService} from "../../../../../services/rest/user.service";
import {FDialogService} from "../../../../../services/common/f-dialog.service";
import {UserDataModel} from "../../../../../models/rest/user-data-model";
import {dateToYearFullString, getSeverity, restTry, stringToDate} from "../../../../../guards/f-extensions";
import {flagToRoleDesc, UserRole} from "../../../../../models/rest/user-role";
import {flagToDeptDesc} from "../../../../../models/rest/user-dept";
import {statusToUserStatusDesc} from "../../../../../models/rest/user-status";
import {FComponentBase} from "../../../../../guards/f-component-base";

@Component({
  selector: "app-my-info",
  templateUrl: "./my-info.component.html",
  styleUrl: "./my-info.component.scss",
  standalone: false
})
export class MyInfoComponent extends FComponentBase {
  userDataModel?: UserDataModel = undefined;
  constructor(override userService: UserService, override fDialogService: FDialogService) {
    super(userService, fDialogService, Array<UserRole>(UserRole.None));
  }

  override async ngInit(): Promise<void> {
    this.setLoading();
    const ret = await restTry(async() => await this.userService.getUserDataByID(),
      e => this.fDialogService.error("getUserData", e.message));
    this.setLoading(false);
    if (ret.result) {
      this.userDataModel = ret.data;
      return;
    }

    this.fDialogService.warn("getUserData", ret.msg);
  }

  protected readonly getSeverity = getSeverity;
  protected readonly flagToRoleDesc = flagToRoleDesc;
  protected readonly flagToDeptDesc = flagToDeptDesc;
  protected readonly dateToYearFullString = dateToYearFullString;
  protected readonly stringToDate = stringToDate;
  protected readonly statusToUserStatusDesc = statusToUserStatusDesc;
}
