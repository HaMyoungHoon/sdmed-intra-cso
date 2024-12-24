import {Component, ViewChild} from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {UserRole} from "../../../../models/rest/user/user-role";
import {EdiListService} from "../../../../services/rest/edi-list.service";
import * as FExtensions from "../../../../guards/f-extensions";
import {EDIUploadModel} from "../../../../models/rest/edi/edi-upload-model";
import {Table} from "primeng/table";
import {DatePicker} from "primeng/datepicker";
import {ediStateToEDIStateDesc} from "../../../../models/rest/edi/edi-state";

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
  viewList: EDIUploadModel[] = [];
  initList: EDIUploadModel[] = [];
  isSorted: boolean | null = null;
  constructor(private thisService: EdiListService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.Employee, UserRole.EdiChanger));
  }

  override async ngInit(): Promise<void> {
    if (this.haveRole) {
      await this.getList();
    }
  }

  async getList(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getList(FExtensions.dateToMonthYYYYMMdd(this.startDate), FExtensions.dateToMonthYYYYMMdd(this.endDate)),
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

  protected readonly filterTable = FExtensions.filterTable;
  protected readonly customSort = FExtensions.customSort;
  protected readonly ediStateToEDIStateDesc = ediStateToEDIStateDesc;
  protected readonly getEDIStateSeverity = FExtensions.getEDIStateSeverity;
  protected readonly dateToMonthYYYYMMdd = FExtensions.dateToMonthYYYYMMdd;
}
