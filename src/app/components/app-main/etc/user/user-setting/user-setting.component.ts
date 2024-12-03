import {Component, ElementRef, ViewChild} from "@angular/core";
import {FComponentBase} from "../../../../../guards/f-component-base";
import {UserDataModel} from "../../../../../models/rest/user-data-model";
import {statusToUserStatusDesc} from "../../../../../models/rest/user-status";
import {customSort, filterTable, getSeverity, restTry} from "../../../../../guards/f-extensions";
import {flagToRoleDesc, UserRole} from "../../../../../models/rest/user-role";
import {Table} from "primeng/table";

@Component({
  selector: "app-user-setting",
  templateUrl: "./user-setting.component.html",
  styleUrl: "./user-setting.component.scss",
  standalone: false
})
export class UserSettingComponent extends FComponentBase {
  @ViewChild("userListTable") userListTable!: Table;
  @ViewChild("inputUploadExcel") inputUploadExcel!: ElementRef<HTMLInputElement>;
  initValue: UserDataModel[] = [];
  userDataModel: UserDataModel[] = [];
  isSorted: boolean | null = null;
  constructor() {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.UserChanger));
  }

  override async ngInit(): Promise<void> {
    await this.getUserDataModel();
  }
  async getUserDataModel(): Promise<void> {
    this.setLoading();
    const ret = await restTry(async() => await this.userService.getUserAll(),
      e => this.fDialogService.error("getUserAll", e.message));
    this.setLoading(false);
    if (ret.result) {
      this.initValue = ret.data ?? [];
      this.userDataModel = ret.data ?? [];
      return;
    }
    this.fDialogService.warn("getUserAll", ret.msg);
  }

  async refreshUserDataModel(): Promise<void> {
    await this.getUserDataModel();
  }
  uploadExcel(): void {
    this.inputUploadExcel.nativeElement.click();
  }
  async excelSelected(event: any): Promise<void>  {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.setLoading();
      const ret = await restTry(async() => await this.userService.postDataUploadExcel(file),
        e => this.fDialogService.error("excelSelected", e.message));
      this.inputUploadExcel.nativeElement.value = "";
      this.setLoading(false);
      if (ret.result) {
        await this.getUserDataModel();
        return;
      }
      this.fDialogService.warn("excelSelected", ret.msg);
    }
  }

  userEdit(data: UserDataModel): void {
    this.fDialogService.openUserEditDialog({
      modal: true,
      closable: false,
      closeOnEscape: true,
      draggable: true,
      resizable: true,
      width: "50%",
      height: "80%",
      data: data
    }).subscribe((x): void => {
      if (x == null) {
        return;
      }
      const initTarget = this.initValue.findIndex(y => y.thisPK == x.thisPK) ?? 0
      if (initTarget > 0) {
        new UserDataModel().copyLhsFromRhs(this.initValue[initTarget], x);
      }
      const target = this.userDataModel.findIndex(y => y.thisPK == x.thisPK) ?? 0
      if (target > 0) {
        new UserDataModel().copyLhsFromRhs(this.userDataModel[target], x);
      }
    });
  }

  protected readonly statusToUserStatusDesc = statusToUserStatusDesc;
  protected readonly getSeverity = getSeverity;
  protected readonly flagToRoleDesc = flagToRoleDesc;
  protected readonly customSort = customSort
  protected readonly filterTable = filterTable
}
