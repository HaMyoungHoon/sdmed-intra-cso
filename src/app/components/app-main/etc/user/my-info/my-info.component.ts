import {Component} from "@angular/core";
import {UserDataModel} from "../../../../../models/rest/user-data-model";
import {dateToYearFullString, getSeverity, restTry, stringToDate} from "../../../../../guards/f-extensions";
import {flagToRoleDesc} from "../../../../../models/rest/user-role";
import {flagToDeptDesc} from "../../../../../models/rest/user-dept";
import {statusToUserStatusDesc} from "../../../../../models/rest/user-status";
import {FComponentBase} from "../../../../../guards/f-component-base";
import {MyInfoService} from "../../../../../services/rest/my-info.service";
import {removeLocalStorage} from "../../../../../guards/f-amhohwa";
import * as FConstants from "../../../../../guards/f-constants";
import {Router} from "@angular/router";

@Component({
  selector: "app-my-info",
  templateUrl: "./my-info.component.html",
  styleUrl: "./my-info.component.scss",
  standalone: false
})
export class MyInfoComponent extends FComponentBase {
  userDataModel?: UserDataModel = undefined;
  constructor(private thisService: MyInfoService, private router: Router) {
    super();
  }

  override async ngInit(): Promise<void> {
    this.setLoading();
    const ret = await restTry(async() => await this.thisService.getData(true, true),
      e => this.fDialogService.error("getUserData", e));
    this.setLoading(false);
    if (ret.result) {
      this.userDataModel = ret.data;
      return;
    }

    this.fDialogService.warn("getUserData", ret.msg);
  }
  passwordChange(): void {
    this.fDialogService.openPasswordChangeDialog({
      modal: true,
      closable: true,
      closeOnEscape: true,
      draggable: false,
      resizable: false,
    }).subscribe((x): void => {
    });
  }
  logout(): void {
    removeLocalStorage(FConstants.AUTH_TOKEN);
    this.router.navigate([`/${FConstants.DASH_BOARD_URL}`]).then();
  }

  protected readonly getSeverity = getSeverity;
  protected readonly flagToRoleDesc = flagToRoleDesc;
  protected readonly flagToDeptDesc = flagToDeptDesc;
  protected readonly dateToYearFullString = dateToYearFullString;
  protected readonly stringToDate = stringToDate;
  protected readonly statusToUserStatusDesc = statusToUserStatusDesc;
}
