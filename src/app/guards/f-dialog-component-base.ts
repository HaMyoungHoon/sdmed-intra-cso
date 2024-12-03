import {AfterViewInit, Component, inject} from "@angular/core";
import {UserService} from "../services/rest/user.service";
import {FDialogService} from "../services/common/f-dialog.service";
import {haveRole, UserRole} from "../models/rest/user-role";
import {restTry} from "./f-extensions";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";

@Component({
  selector: "f-dialog-component-base",
  template: "",
  standalone: false
})
export abstract class FDialogComponentBase implements AfterViewInit {
  myRole?: number = 0;
  haveRole: boolean = false;
  isLoading: boolean = false;
  protected roleCheck: boolean = true;
  protected ref: DynamicDialogRef;
  protected dialogService: DialogService;
  protected userService: UserService;
  protected fDialogService: FDialogService;
  protected constructor(protected arrayRole: Array<UserRole> = Array<UserRole>(UserRole.None)) {
    this.ref = inject(DynamicDialogRef);
    this.dialogService = inject(DialogService);
    this.userService = inject(UserService);
    this.fDialogService = inject(FDialogService);
  }

  async ngAfterViewInit(): Promise<void> {
    if (this.roleCheck) {
      await this.getMyRole();
    }
    await this.ngInit();
  }
  async getMyRole(): Promise<void> {
    this.setLoading();
    const ret = await restTry(async() => await this.userService.getMyRole(),
      e => this.fDialogService.error("getMyRole", e.message));
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
