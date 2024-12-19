import {Component, ElementRef, ViewChild} from "@angular/core";
import {FComponentBase} from "../../../../../guards/f-component-base";
import {UserDataModel} from "../../../../../models/rest/user/user-data-model";
import {statusToUserStatusDesc} from "../../../../../models/rest/user/user-status";
import {customSort, filterTable, getUserStatusSeverity, restTry} from "../../../../../guards/f-extensions";
import {flagToRoleDesc, UserRole} from "../../../../../models/rest/user/user-role";
import {Table} from "primeng/table";
import {UserInfoService} from "../../../../../services/rest/user-info.service";
import {saveAs} from "file-saver";
import * as FConstants from "../../../../../guards/f-constants";

@Component({
  selector: "app-user-setting",
  templateUrl: "./user-setting.component.html",
  styleUrl: "./user-setting.component.scss",
  standalone: false
})
export class UserSettingComponent extends FComponentBase {
  @ViewChild("listTable") listTable!: Table;
  @ViewChild("inputUploadExcel") inputUploadExcel!: ElementRef<HTMLInputElement>;
  initValue: UserDataModel[] = [];
  userDataModel: UserDataModel[] = [];
  isSorted: boolean | null = null;
  constructor(private thisService: UserInfoService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.UserChanger));
  }

  override async ngInit(): Promise<void> {
    if (this.haveRole) {
      await this.getUserDataModel();
    }
  }
  async getUserDataModel(): Promise<void> {
    this.setLoading();
    const ret = await restTry(async() => await this.thisService.getList(),
      e => this.fDialogService.error("getUserAll", e));
    this.setLoading(false);
    if (ret.result) {
      this.initValue = ret.data ?? [];
      this.userDataModel = [...this.initValue];
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
      const ret = await restTry(async() => await this.thisService.postExcel(file),
        e => this.fDialogService.error("excelSelected", e));
      this.inputUploadExcel.nativeElement.value = "";
      this.setLoading(false);
      if (ret.result) {
        await this.getUserDataModel();
        return;
      }
      this.fDialogService.warn("excelSelected", ret.msg);
    }
  }
  async sampleDown(): Promise<void> {
    this.thisService.getExcelSample().then(x => {
      const blob = URL.createObjectURL(x.body);
      saveAs(blob, "userSampleExcel.xlsx");
    }).catch(x => {
      this.fDialogService.error("sampleDown", x.message);
    });
  }

  userEdit(data: UserDataModel): void {
    const isNewTab = this.configService.isNewTab();
    if (isNewTab) {
      window.open(`${FConstants.USER_INFO_URL}/${data.thisPK}`);
      return;
    }
    this.fDialogService.openUserEditDialog({
      modal: true,
      closable: false,
      closeOnEscape: true,
      draggable: true,
      resizable: true,
      maximizable: true,
      width: "60%",
      data: data
    }).subscribe((x): void => {
      if (x == null) {
        return;
      }
      const initTarget = this.initValue.findIndex(y => y.thisPK == x.thisPK) ?? -1
      if (initTarget >= 0) {
        new UserDataModel().copyLhsFromRhs(this.initValue[initTarget], x);
      }
      const target = this.userDataModel.findIndex(y => y.thisPK == x.thisPK) ?? -1
      if (target >= 0) {
        new UserDataModel().copyLhsFromRhs(this.userDataModel[target], x);
      }
    });
  }

  protected readonly statusToUserStatusDesc = statusToUserStatusDesc;
  protected readonly getSeverity = getUserStatusSeverity;
  protected readonly flagToRoleDesc = flagToRoleDesc;
  protected readonly customSort = customSort
  protected readonly filterTable = filterTable
}
