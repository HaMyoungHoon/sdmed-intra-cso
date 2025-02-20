import {Component, ElementRef, ViewChild} from "@angular/core";
import {FComponentBase} from "../../../../../guards/f-component-base";
import {UserDataModel} from "../../../../../models/rest/user/user-data-model";
import {statusToUserStatusDesc} from "../../../../../models/rest/user/user-status";
import * as FExtensions from "../../../../../guards/f-extensions";
import {flagToRoleDesc, UserRole} from "../../../../../models/rest/user/user-role";
import {Table} from "primeng/table";
import {UserInfoService} from "../../../../../services/rest/user-info.service";
import {saveAs} from "file-saver";
import * as FConstants from "../../../../../guards/f-constants";
import {Subject, takeUntil} from "rxjs";

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
    await this.getUserDataModel();
  }
  async getUserDataModel(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getList(),
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
  addUser(): void {
    const isNewTab = this.configService.isNewTab();
    if (isNewTab) {
      window.open(`${FConstants.USER_NEW_URL}`);
      return;
    }
    const sub = new Subject<any>();
    this.sub.push(sub);
    this.fDialogService.openUserAddDialog({
      modal: true,
      closable: false,
      closeOnEscape: true,
      draggable: true,
      resizable: true,
      maximizable: true,
      width: "60%",
    }).pipe(takeUntil(sub)).subscribe((x): void => {
      if (x == null) {
        return;
      }
      this.initValue.unshift(x);
      this.userDataModel.unshift(x);
    })
  }
  uploadExcel(): void {
    this.inputUploadExcel.nativeElement.click();
  }
  async excelSelected(event: any): Promise<void>  {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.setLoading();
      const ret = await FExtensions.restTry(async() => await this.thisService.postExcel(file),
        e => this.fDialogService.error("excel upload", e));
      this.inputUploadExcel.nativeElement.value = "";
      this.setLoading(false);
      if (ret.result) {
        await this.getUserDataModel();
        this.fDialogService.success("excel upload", ret.data);
        return;
      }
      this.fDialogService.warn("excel upload", ret.msg);
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
    const sub = new Subject<any>();
    this.sub.push(sub);
    this.fDialogService.openUserEditDialog({
      modal: true,
      closable: false,
      closeOnEscape: true,
      draggable: true,
      resizable: true,
      maximizable: true,
      width: "60%",
      data: data
    }).pipe(takeUntil(sub)).subscribe((x): void => {
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

  get filterFields(): string[] {
    return ["id", "name", "status", "role"];
  }
  get sampleDownloadTooltip(): string {
    return "common-desc.sample-download";
  }


  protected readonly statusToUserStatusDesc = statusToUserStatusDesc;
  protected readonly getSeverity = FExtensions.getUserStatusSeverity;
  protected readonly flagToRoleDesc = flagToRoleDesc;
  protected readonly customSort = FExtensions.customSort
  protected readonly filterTable = FExtensions.filterTable
  protected readonly tableStyle = FConstants.tableStyle;
  protected readonly filterTableOption = FConstants.filterTableOption;
}
