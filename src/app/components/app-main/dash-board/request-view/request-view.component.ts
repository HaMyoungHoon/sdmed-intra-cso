import {Component, ViewChild} from "@angular/core";
import {calcDateDiffDay, customSort, dateToMonthYYYYMMdd, filterTable, getResponseTypeSeverity, plusDays, restTry} from "../../../../guards/f-extensions";
import {responseTypeToResponseTypeDesc} from "../../../../models/rest/requst/response-type";
import {RequestType, requestTypeToRequestTypeDesc} from "../../../../models/rest/requst/request-type";
import {Calendar} from "primeng/calendar";
import {RequestModel} from "../../../../models/rest/requst/request-model";
import {SelectButtonModel} from "../../../../models/common/select-button-model";
import {DashboardService} from "../../../../services/rest/dashboard.service";
import {UserRole} from "../../../../models/rest/user/user-role";
import {getLocalStorage, setLocalStorage} from "../../../../guards/f-amhohwa";
import * as FConstants from "../../../../guards/f-constants";
import {FComponentBase} from "../../../../guards/f-component-base";

@Component({
  selector: "app-request-view",
  templateUrl: "./request-view.component.html",
  styleUrl: "./request-view.component.scss",
  standalone: false,
})
export class RequestViewComponent extends FComponentBase {
  @ViewChild("startCalendar") startCalendar !: Calendar;
  @ViewChild("endCalendar") endCalendar !: Calendar;
  isSorted: boolean | null = null;
  initValue: RequestModel[] = [];
  viewList: RequestModel[] = [];
  startDate: Date = plusDays(new Date(), -7);
  endDate: Date = new Date();
  viewTypeList: SelectButtonModel[] = [];
  selectedViewType: SelectButtonModel = new SelectButtonModel();
  constructor(private thisService: DashboardService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.Employee));
    this.layoutInit();
  }

  override async ngInit(): Promise<void> {
    if (this.haveRole) {
      await this.refreshData();
    }
  }

  layoutInit(): void {
    this.viewTypeList.push(new SelectButtonModel().apply(x => {
      x.label = "dash-board.header.view-type-my-child";
      x.index = 0;
    }));
    this.viewTypeList.push(new SelectButtonModel().apply(x => {
      x.label = "dash-board.header.view-type-all";
      x.index = 1;
    }));
    this.viewTypeList.push(new SelectButtonModel().apply(x => {
      x.label = "dash-board.header.view-type-date";
      x.index = 2;
    }));
    this.selectedViewType = this.viewTypeList.find(x => x.label == getLocalStorage(FConstants.STORAGE_DASHBOARD_VIEW_TYPE)) ?? this.viewTypeList[0];
  }
  async viewTypeChange(data: any): Promise<void> {
    setLocalStorage(FConstants.STORAGE_DASHBOARD_VIEW_TYPE, this.selectedViewType.label);
  }
  async startDateChange(data: any): Promise<void> {
    if (this.startDate.getTime() > this.endDate.getTime()) {
      const buff = new Date(this.startDate);
      this.startDate = new Date(this.endDate);
      this.endDate = new Date(buff);
    }

    const diffDay = calcDateDiffDay(this.startDate, this.endDate);
    if (diffDay > 366) {
      this.endDate.setTime(this.startDate.getTime() + 365 * 1000 * 24 * 60 * 60);
      this.endCalendar.updateInputfield();
    }
  }
  async endDateChange(data: any): Promise<void> {
    if (this.startDate.getTime() > this.endDate.getTime()) {
      const buff = new Date(this.startDate);
      this.startDate = new Date(this.endDate);
      this.endDate = new Date(buff);
    }

    const diffDay = calcDateDiffDay(this.startDate, this.endDate);
    if (diffDay > 366) {
      this.startDate.setTime(this.endDate.getTime() - 365 * 1000 * 24 * 60 * 60);
      this.startCalendar.updateInputfield();
    }
  }

  async getListMyChild(): Promise<void> {
    this.setLoading();
    const ret = await restTry(async() => await this.thisService.getList(),
      e => this.fDialogService.error("getListMyChild", e));
    this.setLoading(false);
    if (ret.result) {
      this.initValue = ret.data ?? [];
      this.viewList = [...this.initValue];
      return;
    }
    this.fDialogService.warn("getListMyChild", ret.msg);
  }
  async getListAll(): Promise<void> {
    this.setLoading();
    const ret = await restTry(async() => await this.thisService.getListByNoResponse(),
      e => this.fDialogService.error("getListAll", e));
    this.setLoading(false);
    if (ret.result) {
      this.initValue = ret.data ?? [];
      this.viewList = [...this.initValue];
      return;
    }
    this.fDialogService.warn("getListAll")
  }
  async getListBetween(): Promise<void> {
    this.setLoading();
    const startDate = dateToMonthYYYYMMdd(this.startDate);
    const endDate = dateToMonthYYYYMMdd(this.endDate);
    const ret = await restTry(async() => await this.thisService.getListByDate(startDate, endDate),
      e => this.fDialogService.error("getListBetween", e));
    this.setLoading(false);
    if (ret.result) {
      this.initValue = ret.data ?? [];
      this.viewList = [...this.initValue];
      return;
    }
    this.fDialogService.warn("getListBetween")
  }
  async refreshData(): Promise<void> {
    switch (this.selectedViewType.index) {
      case 0: await this.getListMyChild();  break;
      case 1: await this.getListAll();  break;
      default: await  this.getListBetween(); break;
    }
  }

  async move(data: RequestModel): Promise<void> {
    switch (data.requestType) {
      case RequestType.SignUp: await this.signUpMethod(data); break;
      case RequestType.EDIUpload: await this.ediUploadMethod(data); break;
    }
  }

  async signUpMethod(data: RequestModel): Promise<void> {

  }
  async ediUploadMethod(data: RequestModel): Promise<void> {

  }

  protected readonly customSort = customSort;
  protected readonly filterTable = filterTable;
  protected readonly dateToMonthYYYYMMdd = dateToMonthYYYYMMdd;
  protected readonly responseTypeToResponseTypeDesc = responseTypeToResponseTypeDesc;
  protected readonly requestTypeToRequestTypeDesc = requestTypeToRequestTypeDesc;
  protected readonly getResponseTypeSeverity = getResponseTypeSeverity;
}
