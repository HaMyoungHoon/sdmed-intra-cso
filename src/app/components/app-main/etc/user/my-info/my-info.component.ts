import {Component} from "@angular/core";
import {UserService} from "../../../../../services/rest/user.service";
import {FDialogService} from "../../../../../services/common/f-dialog.service";
import {UserDataModel} from "../../../../../models/rest/user-data-model";
import {dateToYearFullString, getSeverity, stringToDate} from "../../../../../guards/f-extensions";
import {flagToRoleDesc} from "../../../../../models/rest/user-role";
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
  loading: boolean = true;
  constructor(private userService: UserService, private fDialogService: FDialogService) {
    super();
  }

  override ngInit(): void {
    this.userService.getUserDataByID().then(x => {
      this.loading = false;
      if (x.result) {
        this.userDataModel = x.data;
        return;
      }

      this.fDialogService.warn("getUserData", x.msg);
    }).catch(x => {
      this.loading = false;
      this.fDialogService.error("getUserData", x.message);
    });
  }

  protected readonly getSeverity = getSeverity;
  protected readonly flagToRoleDesc = flagToRoleDesc;
  protected readonly flagToDeptDesc = flagToDeptDesc;
  protected readonly dateToYearFullString = dateToYearFullString;
  protected readonly stringToDate = stringToDate;
  protected readonly statusToUserStatusDesc = statusToUserStatusDesc;
}
