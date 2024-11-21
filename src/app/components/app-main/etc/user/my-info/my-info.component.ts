import {AfterViewInit, ChangeDetectorRef, Component} from "@angular/core";
import {UserService} from "../../../../../services/rest/user.service";
import {getLocalStorage, isExpired} from "../../../../../guards/f-amhohwa";
import * as FConstants from "../../../../../guards/f-constants";
import {FDialogService} from "../../../../../services/common/f-dialog.service";
import {UserDataModel} from "../../../../../models/rest/user-data-model";
import {dateToYearFullString, getSeverity, stringToDate} from "../../../../../guards/f-extensions";
import {flagToRoleDesc} from "../../../../../models/rest/user-role";
import {flagToDeptDesc} from "../../../../../models/rest/user-dept";
import {statusToUserStatusDesc} from "../../../../../models/rest/user-status";

@Component({
  selector: "app-my-info",
  templateUrl: "./my-info.component.html",
  styleUrl: "./my-info.component.scss"
})
export class MyInfoComponent implements AfterViewInit {
  userDataModel?: UserDataModel = undefined;
  loading: boolean = true;
  constructor(private cd: ChangeDetectorRef, private userService: UserService, private fDialogService: FDialogService) {
    this.cd.markForCheck();
  }

  ngAfterViewInit(): void {
    const authToken = getLocalStorage(FConstants.AUTH_TOKEN);
    if (isExpired(authToken)) {
      return;
    }

    this.userService.getUserData().then(x => {
      this.loading = false;
      if (x.result) {
        this.userDataModel = x.data;
        this.cd.detectChanges();
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
