import {Component, ViewChild} from "@angular/core";
import * as FExtensions from "../../../../guards/f-extensions";
import {allResponseTypeDescArray, ResponseType, ResponseTypeDescToResponseType, responseTypeToResponseTypeDesc,} from "../../../../models/rest/requst/response-type";
import {RequestType, requestTypeToRequestTypeDesc} from "../../../../models/rest/requst/request-type";
import {Calendar} from "primeng/calendar";
import {RequestModel} from "../../../../models/rest/requst/request-model";
import {SelectButtonModel} from "../../../../models/common/select-button-model";
import {DashboardService} from "../../../../services/rest/dashboard.service";
import {UserRole} from "../../../../models/rest/user/user-role";
import * as FAmhohwa from "../../../../guards/f-amhohwa";
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
  requestDrawerVisible: boolean = false;
  responseTypeList: string[] = allResponseTypeDescArray();
  selectedResponseType: string = responseTypeToResponseTypeDesc();
  isSorted: boolean | null = null;
  initValue: RequestModel[] = [];
  viewList: RequestModel[] = [];
  openedRequest?: RequestModel;
  startDate: Date = FExtensions.plusDays(new Date(), -7);
  endDate: Date = new Date();
  viewTypeList: SelectButtonModel[] = [];
  selectedViewType: SelectButtonModel = new SelectButtonModel();
  constructor(private thisService: DashboardService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.Employee));
    this.layoutInit();
  }

  override async ngInit(): Promise<void> {
    await this.refreshData();
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
    this.selectedViewType = this.viewTypeList.find(x => x.label == FAmhohwa.getLocalStorage(FConstants.STORAGE_DASHBOARD_VIEW_TYPE)) ?? this.viewTypeList[0];
  }
  async viewTypeChange(data: any): Promise<void> {
    FAmhohwa.setLocalStorage(FConstants.STORAGE_DASHBOARD_VIEW_TYPE, this.selectedViewType.label);
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
      this.endCalendar.updateInputfield();
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
      this.startCalendar.updateInputfield();
    }
  }

  async getListMyChild(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getList(),
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
    const ret = await FExtensions.restTry(async() => await this.thisService.getListByNoResponse(),
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
    const startDate = FExtensions.dateToYYYYMMdd(this.startDate);
    const endDate = FExtensions.dateToYYYYMMdd(this.endDate);
    const ret = await FExtensions.restTry(async() => await this.thisService.getListByDate(startDate, endDate),
      e => this.fDialogService.error("getListBetween", e));
    this.setLoading(false);
    if (ret.result) {
      this.initValue = ret.data ?? [];
      this.viewList = [...this.initValue];
      return;
    }
    this.fDialogService.warn("getListBetween")
  }
  async putRequestRecep(data: RequestModel): Promise<RequestModel | undefined> {
    if (data.responseType != ResponseType.None) {
      return data;
    }

    const ret = await FExtensions.restTry(async() => await this.thisService.putRequestRecep(data),
      e => this.fDialogService.error("putRequestRecep", e));
    if (ret.result) {
      return ret.data ?? data;
    }
    this.fDialogService.warn("putRequestRecep", ret.msg);
    return undefined;
  }
  async putRequestModelResponseData(data?: RequestModel): Promise<RequestModel | undefined> {
    if (data == null) {
      return data;
    }
    const ret = await FExtensions.restTry(async() => await this.thisService.putRequestModelResponseData(data),
      e => this.fDialogService.error("putRequestModelResponseData", e));
    if (ret.result) {
      return ret.data ?? data;
    }
    this.fDialogService.warn("putRequestModelResponseData", ret.msg);
    return undefined;
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
      case RequestType.QnA: await this.qnAMethod(data); break;
    }
  }

  async requestDrawerReady(data: RequestModel): Promise<boolean> {
    const buff = await this.putRequestRecep(data);
    if (buff == undefined) {
      return false;
    }
    this.openedRequest = buff;
    this.selectedResponseType = responseTypeToResponseTypeDesc(this.openedRequest?.responseType);
    this.requestDrawerVisible = true;
    return true;
  }
  async signUpMethod(data: RequestModel): Promise<void> {
    const isNewTab = this.configService.isNewTab();
    if (isNewTab) {
      window.open(`${FConstants.USER_INFO_URL}/${data.requestItemPK}`);
      return;
    }
    const ready = await this.requestDrawerReady(data);
  }
  async ediUploadMethod(data: RequestModel): Promise<void> {
    const ready = await this.requestDrawerReady(data);
  }
  async qnAMethod(data: RequestModel): Promise<void> {
    const ready = await this.requestDrawerReady(data);
  }
  async openedRequestItemResponseTypeChange(): Promise<void> {
    const responseType = ResponseTypeDescToResponseType[this.selectedResponseType];
    if (this.openedRequest == null) {
      return;
    }
    if (this.openedRequest.responseType == responseType) {
      return;
    }
    this.openedRequest.responseType = responseType;
    const buff = await this.putRequestModelResponseData(this.openedRequest);
    if (buff == undefined) {
      return;
    }
    this.openedRequest = buff;
  }
  async methodComponentCloseEvent(data: RequestModel): Promise<void> {
    const initIndex = this.initValue.findIndex(x => x.thisPK == data.thisPK) ?? -1
    if (initIndex >= 0) {
      new RequestModel().copyLhsFromRhs(this.initValue[initIndex], data);
    }
    const viewIndex = this.viewList.findIndex(x => x.thisPK == data.thisPK) ?? -1;
    if (viewIndex >= 0) {
      new RequestModel().copyLhsFromRhs(this.viewList[viewIndex], data);
    }
    this.openedRequest = undefined;
    this.requestDrawerVisible = false;
  }

  async requestDrawerOnHide(data: RequestModel): Promise<void> {
    await this.methodComponentCloseEvent(data);
  }
  async requestDrawerOnShow(data: any): Promise<void> {
  }

  get startDateTooltip(): string {
    return "dash-board.header.start-date";
  }
  get endDateTooltip(): string {
    return "dash-board.header.end-date";
  }
  get filterFields(): string[] {
    return ["requestDate", "responseType"];
  }

  protected readonly customSort = FExtensions.customSort;
  protected readonly filterTable = FExtensions.filterTable;
  protected readonly dateToMMdd = FExtensions.dateToMMdd;
  protected readonly dateToYYYYMMdd = FExtensions.dateToYYYYMMdd;
  protected readonly responseTypeToResponseTypeDesc = responseTypeToResponseTypeDesc;
  protected readonly requestTypeToRequestTypeDesc = requestTypeToRequestTypeDesc;
  protected readonly getResponseTypeSeverity = FExtensions.getResponseTypeSeverity;
  protected readonly RequestType = RequestType;
  protected readonly tableStyle = FConstants.tableStyle;
  protected readonly filterTableOption = FConstants.filterTableOption;
}
