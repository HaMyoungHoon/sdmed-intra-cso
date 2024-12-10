import {AfterViewInit, Component, inject} from "@angular/core";
import {getLocalStorage, isExpired} from "./f-amhohwa";
import * as FConstants from "./f-constants";
import {restTry} from "./f-extensions";
import {haveRole, UserRole} from "../models/rest/user-role";
import {FDialogService} from "../services/common/f-dialog.service";
import {TranslateService} from "@ngx-translate/core";
import {CommonService} from "../services/rest/common.service";

@Component({
  selector: "f-component-base",
  template: "",
  standalone: false
})
export abstract class FComponentBase implements AfterViewInit {
  myRole?: number = 0;
  haveRole: boolean = false;
  isLoading: boolean = false;
  isMobile: boolean = false;
  protected commonService: CommonService;
  protected fDialogService: FDialogService;
  protected translateService: TranslateService
  protected constructor(protected arrayRole: Array<UserRole> = Array<UserRole>(UserRole.None)) {
    this.commonService = inject(CommonService);
    this.fDialogService = inject(FDialogService);
    this.translateService = inject(TranslateService);
  }

  async ngAfterViewInit(): Promise<void> {
    this.isMobile = !navigator.userAgent.includes("Window");
    const authToken = getLocalStorage(FConstants.AUTH_TOKEN);
    if (isExpired(authToken)) {
      return;
    }
    await this.getMyRole();
    await this.ngInit();
  }
  async getMyRole(): Promise<void> {
    this.setLoading();
    const ret = await restTry(async() => await this.commonService.getMyRole(),
      e => this.fDialogService.error("getMyRole", e));
    this.setLoading(false);
    if (ret.result) {
      this.myRole = ret.data;
      this.haveRole = haveRole(ret.data, this.arrayRole)
      return;
    }

    this.fDialogService.warn("getMyRole", ret.msg);
    return;
  }

  async ngInit(): Promise<void> {

  }

  setLoading(data: boolean = true): void {
    this.isLoading = data;
  }
}
