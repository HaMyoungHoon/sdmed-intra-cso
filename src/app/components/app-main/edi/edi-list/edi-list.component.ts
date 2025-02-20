import {Component, ViewChild} from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {UserRole} from "../../../../models/rest/user/user-role";
import {EdiListService} from "../../../../services/rest/edi-list.service";
import * as FExtensions from "../../../../guards/f-extensions";
import {EDIUploadModel} from "../../../../models/rest/edi/edi-upload-model";
import {Table} from "primeng/table";
import {DatePicker} from "primeng/datepicker";
import * as FConstants from "../../../../guards/f-constants";
import {Subject, takeUntil} from "rxjs";
import * as FImageCache from "../../../../guards/f-image-cache";
import {TableHeaderModel} from "../../../../models/common/table-header-model";
import {StringToEDIStateDesc} from "../../../../models/rest/edi/edi-state";

@Component({
  selector: "app-edi-list",
  templateUrl: "./edi-list.component.html",
  styleUrl: "./edi-list.component.scss",
  standalone: false
})
export class EdiListComponent extends FComponentBase {
  @ViewChild("listTable") listTable!: Table;
  @ViewChild("startDatePicker") startDatePicker !: DatePicker;
  @ViewChild("endDatePicker") endDatePicker !: DatePicker;
  startDate: Date = FExtensions.plusDays(new Date(), -31);
  endDate: Date = new Date();
  headerList: TableHeaderModel[] = [];
  selectedHeaders: TableHeaderModel[] = [];
  viewList: EDIUploadModel[] = [];
  initList: EDIUploadModel[] = [];
  myChild: boolean = true;
  constructor(private thisService: EdiListService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.Employee, UserRole.EdiChanger));
    this.layoutInit();
  }

  override async ngInit(): Promise<void> {
    await this.getList();
  }

  async getList(): Promise<void> {
    this.setLoading();
    await FExtensions.tryCatchAsync(async() => await FImageCache.clearExpiredImage());
    const ret = await FExtensions.restTry(async() => await this.thisService.getList(FExtensions.dateToYYYYMMdd(this.startDate), FExtensions.dateToYYYYMMdd(this.endDate), this.myChild),
      e => this.fDialogService.error("getList", e));
    this.setLoading(false);
    if (ret.result) {
      this.initList = ret.data ?? [];
      this.viewList = [...this.initList];
      return;
    }
    this.fDialogService.warn("getList", ret.msg);
  }
  async startDateChange(data: any): Promise<void> {
    if (this.startDate.getTime() > this.endDate.getTime()) {
      const buff = new Date(this.startDate);
      this.startDate = new Date(this.endDate);
      this.endDate = new Date(buff);
    }

    const diffDay = FExtensions.calcDateDiffDay(this.startDate, this.endDate);
    if (diffDay > 366) {
      this.endDate.setTime(this.startDate.getTime() + 365 * 1000 * 24 * 60 * 60);
      this.endDatePicker.updateInputfield();
    }
  }
  async endDateChange(data: any): Promise<void> {
    if (this.startDate.getTime() > this.endDate.getTime()) {
      const buff = new Date(this.startDate);
      this.startDate = new Date(this.endDate);
      this.endDate = new Date(buff);
    }

    const diffDay = FExtensions.calcDateDiffDay(this.startDate, this.endDate);
    if (diffDay > 366) {
      this.startDate.setTime(this.endDate.getTime() - 365 * 1000 * 24 * 60 * 60);
      this.startDatePicker.updateInputfield();
    }
  }
  async refreshData(): Promise<void> {
    if (this.haveRole) {
      await this.getList();
    }
  }
  async openData(data: EDIUploadModel): Promise<void> {
    const isNewTab = this.configService.isNewTab();
    if (isNewTab) {
      window.open(`${FConstants.EDI_LIST_URL}/${data.thisPK}`, "_blank", `width=${screen.width}; height=${screen.height};`);
      return;
    }
    const sub = new Subject<any>();
    this.sub.push(sub);
    this.fDialogService.openEDIViewDialog({
      modal: true,
      closable: false,
      closeOnEscape: true,
      draggable: true,
      resizable: true,
      maximizable: true,
      data: data.thisPK
    }).pipe(takeUntil(sub)).subscribe((x): void => {
      if (x == null) {
        return;
      }
      const initTarget = this.initList?.findIndex(y => y.thisPK == x.thisPK) ?? -1
      if (initTarget >= 0) {
        new EDIUploadModel().copyLhsFromRhs(this.initList[initTarget], x);
      }
      const target = this.viewList.findIndex(y => y.thisPK == x.thisPK) ?? -1
      if (target >= 0) {
        new EDIUploadModel().copyLhsFromRhs(this.viewList[target], x);
      }
    });
  }

  get filterFields(): string[] {
    return ["ediState", "orgName", "id", "name"];
  }
  get startDatePlaceHolder(): string {
    return "edi-list.header.start-date";
  }
  get endDatePlaceHolder(): string {
    return "edi-list.header.end-date";
  }
  get myChildTooltip(): string {
    return "edi-list.header.my-child";
  }
  headerSelectChange(data: TableHeaderModel[]): void {
    if (data.length <= 0) {
      this.selectedHeaders = [];
    }
    this.configService.setEDIListTableHeaderList(this.selectedHeaders);
  }
  layoutInit(): void {
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "edi-list.table.year-month";
      obj.field = "yearMonth";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "edi-list.table.id";
      obj.field = "id";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "edi-list.table.user-name";
      obj.field = "userName";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "edi-list.table.org-name";
      obj.field = "orgName";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "edi-list.table.edi-state";
      obj.htmlType = "tag";
      obj.field = "ediState";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "edi-list.table.reg-date";
      obj.field = "regDate";
    }));

    this.selectedHeaders = this.configService.getEDIListTableHeaderList();
    if (this.selectedHeaders.length <= 0) {
      this.selectedHeaders = [...this.headerList];
    }
  }
  getTableItem(item: EDIUploadModel, tableHeaderModel: TableHeaderModel): string {
    switch (tableHeaderModel.field) {
      case "yearMonth": return `${item.year}-${item.month}` ;
      case "id": return item.id;
      case "userName": return item.name;
      case "orgName": return item.orgName;
      case "ediState": return StringToEDIStateDesc[item.ediState];
      case "regDate": return FExtensions.dateToYYYYMMdd(item.regDate);
      default: return ""
    }
  }
  getTableItemSeverity(item: EDIUploadModel): any {
    return FExtensions.getEDIStateSeverity(item.ediState);
  }
  isHeaderLabel(tableHeaderModel: TableHeaderModel): boolean {
    return tableHeaderModel.htmlType == "label";
  }
  isHeaderTag(tableHeaderModel: TableHeaderModel): boolean {
    return tableHeaderModel.htmlType == "tag";
  }

  protected readonly filterTable = FExtensions.filterTable;
  protected readonly tableStyle = FConstants.tableStyle;
  protected readonly filterTableOption = FConstants.filterTableOption;
}
