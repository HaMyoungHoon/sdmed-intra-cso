import {Component, ViewChild} from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import * as FExtensions from "../../../../guards/f-extensions";
import * as FConstants from "../../../../guards/f-constants";
import {QnAHeaderModel} from "../../../../models/rest/qna/qna-header-model";
import {QnaListService} from "../../../../services/rest/qna-list.service";
import {UserRole} from "../../../../models/rest/user/user-role";
import {QnAStateToQnAStateDesc} from "../../../../models/rest/qna/qna-state";
import {Calendar} from "primeng/calendar";
import {SelectButtonModel} from "../../../../models/common/select-button-model";
import * as FAmhohwa from "../../../../guards/f-amhohwa";

@Component({
  selector: "app-qna-list",
  templateUrl: "./qna-list.component.html",
  styleUrl: "./qna-list.component.scss",
  standalone: false,
})
export class QnaListComponent extends FComponentBase {
  @ViewChild("startCalendar") startCalendar !: Calendar;
  @ViewChild("endCalendar") endCalendar !: Calendar;
  isSorted: boolean | null = null;
  initValue: QnAHeaderModel[] = [];
  viewList: QnAHeaderModel[] = [];
  startDate: Date = FExtensions.plusDays(new Date(), -7);
  endDate: Date = new Date();
  viewTypeList: SelectButtonModel[] = [];
  selectedViewType: SelectButtonModel = new SelectButtonModel();
  constructor(private thisService: QnaListService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.Employee));
    this.layoutInit();
  }

  override async ngInit(): Promise<void> {
    await this.refreshData();
  }

  layoutInit(): void {
    this.viewTypeList.push(new SelectButtonModel().apply(x => {
      x.label = "qna-list.header.view-type-my-child";
      x.index = 0;
    }));
    this.viewTypeList.push(new SelectButtonModel().apply(x => {
      x.label = "qna-list.header.view-type-all";
      x.index = 1;
    }));
    this.viewTypeList.push(new SelectButtonModel().apply(x => {
      x.label = "qna-list.header.view-type-date";
      x.index = 2;
    }));
    this.selectedViewType = this.viewTypeList.find(x => x.label == FAmhohwa.getLocalStorage(FConstants.STORAGE_QNA_VIEW_TYPE)) ?? this.viewTypeList[0];
  }
  async getListMyChild(): Promise<void> {
    const ret = await FExtensions.restTry(async() => this.thisService.getList(),
      e => this.fDialogService.error("getList", e));
    if (ret.result) {
      this.initValue = ret.data ?? [];
      this.viewList = [...this.initValue];
      return;
    }
    this.fDialogService.warn("getList", ret.msg);
  }
  async getListAll(): Promise<void> {
    const ret = await FExtensions.restTry(async() => this.thisService.getListByNoResponse(),
      e => this.fDialogService.error("getList", e));
    if (ret.result) {
      this.initValue = ret.data ?? [];
      this.viewList = [...this.initValue];
      return;
    }
    this.fDialogService.warn("getList", ret.msg);
  }
  async getListBetween(): Promise<void> {
    const startDate = FExtensions.dateToYYYYMMdd(this.startDate);
    const endDate = FExtensions.dateToYYYYMMdd(this.endDate);
    const ret = await FExtensions.restTry(async() => this.thisService.getListByDate(startDate, endDate),
      e => this.fDialogService.error("getList", e));
    if (ret.result) {
      this.initValue = ret.data ?? [];
      this.viewList = [...this.initValue];
      return;
    }
    this.fDialogService.warn("getList", ret.msg);
  }

  async refreshData(): Promise<void> {
    this.setLoading();
    switch (this.selectedViewType.index) {
      case 0: await this.getListMyChild();  break;
      case 1: await this.getListAll();  break;
      default: await  this.getListBetween(); break;
    }
    this.setLoading(false);
  }
  async viewTypeChange(data: any): Promise<void> {
    FAmhohwa.setLocalStorage(FConstants.STORAGE_QNA_VIEW_TYPE, this.selectedViewType.label);
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
  open(data: QnAHeaderModel): void {
    const isNewTab = this.configService.isNewTab();
    if (isNewTab) {
      window.open(`${FConstants.QNA_LIST}/${data.thisPK}`);
      return;
    }

    this.fDialogService.openQnAViewDialog({
      modal: true,
      closable: false,
      closeOnEscape: true,
      draggable: true,
      resizable: true,
      maximizable: true,
      data: data.thisPK
    }).subscribe((x): void => {
      if (x == null) {
        return;
      }
      const initTarget = this.initValue?.findIndex(y => y.thisPK == x.thisPK) ?? -1
      if (initTarget >= 0) {
        new QnAHeaderModel().copyLhsFromRhs(this.initValue[initTarget], x);
      }
      const target = this.viewList.findIndex(y => y.thisPK == x.thisPK) ?? -1
      if (target >= 0) {
        new QnAHeaderModel().copyLhsFromRhs(this.viewList[target], x);
      }
    });
  }

  get filterFields(): string[] {
    return ["title", "id", "qnaState"];
  }
  get startDateTooltip(): string {
    return "qna-list.header.start-date";
  }
  get endDateTooltip(): string {
    return "qna-list.header.end-date";
  }
  protected readonly customSort = FExtensions.customSort;
  protected readonly filterTable = FExtensions.filterTable;
  protected readonly dateToYYYYMMdd = FExtensions.dateToYYYYMMdd;
  protected readonly getQnAStateSeverity = FExtensions.getQnAStateSeverity;
  protected readonly tableStyle = FConstants.tableStyle;
  protected readonly filterTableOption = FConstants.filterTableOption;
  protected readonly QnAStateToQnAStateDesc = QnAStateToQnAStateDesc;
}
