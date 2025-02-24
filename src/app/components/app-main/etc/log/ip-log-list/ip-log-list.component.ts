import { Component } from "@angular/core";
import {FComponentBase} from "../../../../../guards/f-component-base";
import {LogService} from "../../../../../services/rest/log.service";
import {UserRole} from "../../../../../models/rest/user/user-role";
import * as FExtensions from "../../../../../guards/f-extensions";
import {PaginatorState} from "primeng/paginator";
import * as FConstants from "../../../../../guards/f-constants";
import {IPLogModel} from "../../../../../models/rest/ip-log-model";
import {TableHeaderModel} from "../../../../../models/common/table-header-model";
import {dateToMonthFullString} from "../../../../../guards/f-extensions";

@Component({
  selector: "app-ip-log-list",
  templateUrl: "./ip-log-list.component.html",
  styleUrl: "./ip-log-list.component.scss",
  standalone: false
})
export class IPLogListComponent extends FComponentBase {
  headerList: TableHeaderModel[] = [];
  selectedHeaders: TableHeaderModel[] = [];
  page: number = 0;
  size: number = 10;
  sizeList: number[] = [10, 30, 50];
  totalPage: number = 0;
  totalElement: number = 0;
  viewList: IPLogModel[] = [];
  constructor(private thisService: LogService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.Employee));
    this.layoutInit();
  }
  override async ngInit(): Promise<void> {
    await this.getList();
  }

  async getList(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getIPLogList(this.page, this.size),
      e => this.fDialogService.error("getList", e));
    this.setLoading(false);
    if (ret.result == true) {
      this.totalPage = ret.data?.totalPages ?? 0;
      this.totalElement = ret.data?.totalElements ?? 0;
      this.viewList = ret.data?.content as IPLogModel[] ?? [];
      return;
    }
    this.fDialogService.warn("getList", ret.msg);
  }
  async paginatorChange(data: PaginatorState): Promise<void> {
    this.page = data.page ?? 0;
    this.size = data.rows ?? 10;
    await this.getList();
  }
  headerSelectChange(data: TableHeaderModel[]): void {
    if (data.length <= 0) {
      this.selectedHeaders = [];
    }
    this.configService.setIPLogTableHeaderList(this.selectedHeaders);
  }
  layoutInit(): void {
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "ip-log-list.this-index";
      obj.field = "thisIndex";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "ip-log-list.date-time";
      obj.field = "dateTime";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "ip-log-list.method";
      obj.field = "method";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "ip-log-list.request-uri";
      obj.field = "requestUri";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "ip-log-list.forwarded-for";
      obj.field = "forwardedFor";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "ip-log-list.proxy-client-ip";
      obj.field = "proxy-client-ip";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "ip-log-list.wl-proxy-client-ip";
      obj.field = "wlProxyClientIp";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "ip-log-list.http-client-ip";
      obj.field = "httpClientIp";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "ip-log-list.http-forwarded-for";
      obj.field = "httpForwardedFor";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "ip-log-list.remote-addr";
      obj.field = "remoteAddr";
    }));
//    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
//      obj.header = "ip-log-list.local-addr";
//      obj.field = "localAddr";
//    }));
//    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
//      obj.header = "ip-log-list.server-name";
//      obj.field = "serverName";
//    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "ip-log-list.local-name";
      obj.field = "localName";
    }));
//    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
//      obj.header = "ip-log-list.local-port";
//      obj.field = "localPort";
//    }));

    this.selectedHeaders = this.configService.getIPLogListTableHeaderList();
    if (this.selectedHeaders.length <= 0) {
      this.selectedHeaders = [...this.headerList];
    }
  }
  getTableItem(item: IPLogModel, tableHeaderModel: TableHeaderModel): string {
    switch (tableHeaderModel.field) {
      case "thisIndex": return item.thisIndex.toString();
      case "dateTime": return FExtensions.dateToMonthFullString(item.dateTime);
      case "method": return item.method;
      case "requestUri": return item.requestUri;
      case "forwardedFor": return item.forwardedFor ?? "";
      case "proxyClientIp": return item.proxyClientIp ?? "";
      case "wlProxyClientIp": return item.wlProxyClientIp ?? "";
      case "httpClientIp": return item.httpClientIp ?? "";
      case "httpForwardedFor": return item.httpForwardedFor ?? "";
      case "remoteAddr": return item.remoteAddr;
//      case "localAddr": return item.localAddr;
//      case "serverName": return item.serverName ?? "";
      case "localName": return item.localName ?? "";
//      case "localPort": return item.localPort.toString();
      default: return ""
    }
  }

  protected readonly filterTable = FExtensions.filterTable;
  protected readonly tableStyle = FConstants.tableStyle;
}
