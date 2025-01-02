import {Component, ViewChild} from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {UserRole} from "../../../../models/rest/user/user-role";
import {EdiListService} from "../../../../services/rest/edi-list.service";
import * as FExtensions from "../../../../guards/f-extensions";
import {EDIUploadModel} from "../../../../models/rest/edi/edi-upload-model";
import {Table} from "primeng/table";
import {DatePicker} from "primeng/datepicker";
import {ediStateToEDIStateDesc} from "../../../../models/rest/edi/edi-state";
import * as FConstants from "../../../../guards/f-constants";
import {Subject, takeUntil} from "rxjs";

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
    await this.getList();
  }

  async getList(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getList(FExtensions.dateToYYYYMMdd(this.startDate), FExtensions.dateToYYYYMMdd(this.endDate)),
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
      window.open(`${FConstants.EDI_LIST_URL}/${data.thisPK}`);
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
    return ["ediState"];
  }
  get startDatePlaceHolder(): string {
    return "edi-list.header.start-date";
  }
  get endDatePlaceHolder(): string {
    return "edi-list-header.end-date";
  }

  protected readonly filterTable = FExtensions.filterTable;
  protected readonly customSort = FExtensions.customSort;
  protected readonly ediStateToEDIStateDesc = ediStateToEDIStateDesc;
  protected readonly getEDIStateSeverity = FExtensions.getEDIStateSeverity;
  protected readonly dateToYYYYMMdd = FExtensions.dateToYYYYMMdd;
  protected readonly tableStyle = FConstants.tableStyle;
  protected readonly filterTableOption = FConstants.filterTableOption;
}
