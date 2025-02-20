import {Component} from "@angular/core";
import {FComponentBase} from "../../../../../guards/f-component-base";
import {UserRole} from "../../../../../models/rest/user/user-role";
import {LogService} from "../../../../../services/rest/log.service";
import * as FExtensions from "../../../../../guards/f-extensions";
import * as FConstants from "../../../../../guards/f-constants";
import {LogViewModel} from "../../../../../models/rest/log-view-model";
import {PaginatorState} from "primeng/paginator";

@Component({
  selector: "app-log-list",
  templateUrl: "./log-list.component.html",
  styleUrl: "./log-list.component.scss",
  standalone: false
})
export class LogListComponent extends FComponentBase {
  page: number = 0;
  size: number = 10;
  sizeList: number[] = [10, 30, 50];
  totalPage: number = 0;
  totalElement: number = 0;
  viewList: LogViewModel[] = [];
  constructor(private thisService: LogService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.Employee));
  }

  override async ngInit(): Promise<void> {
    await this.getList();
  }

  async getList(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getList(this.page, this.size),
      e => this.fDialogService.error("getList", e));
    this.setLoading(false);
    if (ret.result == true) {
      this.totalPage = ret.data?.totalPages ?? 0;
      this.totalElement = ret.data?.totalElements ?? 0;
      this.viewList = ret.data?.content as LogViewModel[] ?? [];
      return;
    }
    this.fDialogService.warn("getList", ret.msg);
  }
  async paginatorChange(data: PaginatorState): Promise<void> {
    this.page = data.page ?? 0;
    this.size = data.rows ?? 10;
    await this.getList();
  }

  protected readonly tableStyle = FConstants.tableStyle;
  protected readonly dateToYYYYMMdd = FExtensions.dateToYYYYMMdd;
}
