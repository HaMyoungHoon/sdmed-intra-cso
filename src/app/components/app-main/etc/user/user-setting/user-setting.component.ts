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
import {plusMonths} from "../../../../../guards/f-extensions";
import {TableHeaderModel} from "../../../../../models/common/table-header-model";

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
  headerList: TableHeaderModel[] = [];
  selectedHeaders: TableHeaderModel[] = [];
  userDataModel: UserDataModel[] = [];
  isSorted: boolean | null = null;
  constructor(private thisService: UserInfoService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.UserChanger));
    this.layoutInit();
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
      closable: true,
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


  headerSelectChange(data: TableHeaderModel[]): void {
    if (data.length <= 0) {
      this.selectedHeaders = [];
    }
    this.configService.setUserSettingTableHeaderList(this.selectedHeaders);
  }
  layoutInit(): void {
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "user-setting.table.id";
      obj.field = "id";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "user-setting.table.name";
      obj.field = "name";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "user-setting.table.mail";
      obj.field = "mail";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "user-setting.table.phone-number";
      obj.field = "phoneNumber";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "user-setting.table.role";
      obj.field = "role";
      obj.htmlType = "tags";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "user-setting.table.status";
      obj.field = "status";
      obj.htmlType = "tag";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "user-setting.table.company-inner-name";
      obj.field = "companyInnerName";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "user-setting.table.company-number";
      obj.field = "companyNumber";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "user-setting.table.company-address";
      obj.field = "companyAddress";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "user-setting.table.training-date";
      obj.field = "trainingDate";
    }));

    this.selectedHeaders = this.configService.getUserSettingTableHeaderList();
    if (this.selectedHeaders.length <= 0) {
      this.selectedHeaders = [...this.headerList];
    }
  }
  getTableItem(item: UserDataModel, tableHeaderModel: TableHeaderModel): string {
    switch (tableHeaderModel.field) {
      case "id": return item.id;
      case "name": return item.name;
      case "mail": return item.mail;
      case "phoneNumber": return item.phoneNumber;
      case "status": return statusToUserStatusDesc(item.status);
      case "companyInnerName": return item.companyInnerName;
      case "companyNumber": return item.companyNumber;
      case "companyAddress": return item.companyAddress;
      case "trainingDate": return this.trainingDate(item);
      default: return "";
    }
  }
  getTableItems(item: UserDataModel, tableHeaderModel: TableHeaderModel): string[] {
    switch (tableHeaderModel.field) {
      case "role": {
        console.log(flagToRoleDesc(item.role));
        return flagToRoleDesc(item.role);
      }
      default: return [];
    }
  }
  getTableItemSeverity(item: UserDataModel, tableHeaderModel: TableHeaderModel): any {
    if (tableHeaderModel.field == "status") {
      return FExtensions.getUserStatusSeverity(item.status);
    }

    return undefined;
  }
  isHeaderLabel(tableHeaderModel: TableHeaderModel): boolean {
    return tableHeaderModel.htmlType == "label";
  }
  isHeaderTag(tableHeaderModel: TableHeaderModel): boolean {
    return tableHeaderModel.htmlType == "tag";
  }
  isHeaderTags(tableHeaderModel: TableHeaderModel): boolean {
    return tableHeaderModel.htmlType == "tags";
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
      closable: true,
      closeOnEscape: true,
      draggable: true,
      resizable: true,
      maximizable: true,
      width: "95%",
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
  trainingDate(item: UserDataModel): string {
    if (item.trainingList.length <= 0) {
      return "????-??-??";
    }
    return FExtensions.dateToYYYYMMdd(item.trainingList[0].trainingDate);
  }
  trainingEmpty(item: UserDataModel): boolean {
    if (item.trainingList.length <= 0) {
      return true;
    }
    return false;
  }
  trainingExpire(item: UserDataModel): boolean {
    if (item.trainingList.length <= 0) {
      return false;
    }
    if (item.trainingList[0].trainingDate) {
      const now = new Date().getTime();
      const target = FExtensions.plusYear(item.trainingList[0].trainingDate, 1).getTime();
      return now > target;
    }
    return false;
  }
  userTooltip(item: UserDataModel): string {
    if (this.trainingEmpty(item)) {
      return "user-setting.warn.training-empty";
    }
    if (this.trainingExpire(item)) {
      return "user-setting.warn.training-expired";
    }
    return "";
  }

  get filterFields(): string[] {
    return ["id", "name", "mail", "phoneNumber", "status", "role", "companyInnerName", "companyNumber", "companyAddress"];
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
