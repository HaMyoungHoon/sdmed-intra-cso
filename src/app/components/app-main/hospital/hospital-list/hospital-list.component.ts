import {Component, ElementRef, ViewChild} from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import * as FExtensions from "../../../../guards/f-extensions";
import {HospitalModel} from "../../../../models/rest/hospital/hospital-model";
import {Table} from "primeng/table";
import {UserRole} from "../../../../models/rest/user/user-role";
import {saveAs} from "file-saver";
import {HospitalListService} from "../../../../services/rest/hospital-list.service";
import * as FConstants from "../../../../guards/f-constants";
import {Subject, takeUntil} from "rxjs";
import {TableHeaderModel} from "../../../../models/common/table-header-model";

@Component({
  selector: "app-hospital-list",
  templateUrl: "./hospital-list.component.html",
  styleUrl: "./hospital-list.component.scss",
  standalone: false,
})
export class HospitalListComponent extends FComponentBase {
  @ViewChild("listTable") listTable!: Table;
  @ViewChild("inputUploadExcel") inputUploadExcel!: ElementRef<HTMLInputElement>;
  headerList: TableHeaderModel[] = [];
  selectedHeaders: TableHeaderModel[] = [];
  initValue: HospitalModel[] = [];
  viewList: HospitalModel[] = [];
  isSorted: boolean | null = null;
  constructor(private thisService: HospitalListService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.HospitalChanger));
    this.layoutInit();
  }

  override async ngInit(): Promise<void> {
    await this.getHospitalAll();
  }
  async getHospitalAll(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getList(),
      e => this.fDialogService.error("getHospitalAll", e));
    this.setLoading(false);
    if (ret.result) {
      this.initValue = ret.data ?? [];
      this.viewList = [...this.initValue];
      return;
    }
    this.fDialogService.warn("getHospitalAll", ret.msg);
  }
  async refreshData(): Promise<void> {
    await this.getHospitalAll();
  }
  uploadExcel(): void {
    this.inputUploadExcel.nativeElement.click();
  }
  insertData(): void {
    const isNewTab = this.configService.isNewTab();
    if (isNewTab) {
      window.open(FConstants.HOSPITAL_NEW_URL);
      return;
    }
    const sub = new Subject<any>();
    this.sub.push(sub);
    this.fDialogService.openHospitalAddDialog({
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
      this.initValue.unshift(new HospitalModel().init(x));
      this.viewList.unshift(new HospitalModel().init(x));
    });
  }
  async sampleDown(): Promise<void> {
    this.thisService.getExcelSample().then(x => {
      const blob = URL.createObjectURL(x.body);
      saveAs(blob, "hospitalSampleExcel.xlsx");
    }).catch(x => {
      this.fDialogService.error("sampleDown", x.message);
    });
  }
  async excelSelected(event: any): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.setLoading();
      const ret = await FExtensions.restTry(async() => await this.thisService.postExcel(file),
        e => this.fDialogService.error("excel upload", e));
      this.setLoading(false);
      this.inputUploadExcel.nativeElement.value = "";
      if (ret.result) {
        await this.getHospitalAll();
        this.fDialogService.success("excel upload", ret.data);
        return;
      }
      this.fDialogService.warn("excel upload", ret.msg);
    }
  }
  hospitalEdit(data: HospitalModel): void {
    const isNewTab = this.configService.isNewTab();
    if (isNewTab) {
      window.open(`${FConstants.HOSPITAL_LIST_URL}/${data.thisPK}`);
      return;
    }
    const sub = new Subject<any>();
    this.sub.push(sub);
    this.fDialogService.openHospitalEditDialog({
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
      const initTarget = this.initValue?.findIndex(y => y.thisPK == x.thisPK) ?? -1
      if (initTarget >= 0) {
        new HospitalModel().copyLhsFromRhs(this.initValue[initTarget], x);
      }
      const target = this.viewList.findIndex(y => y.thisPK == x.thisPK) ?? -1
      if (target >= 0) {
        new HospitalModel().copyLhsFromRhs(this.viewList[target], x);
      }
    });
  }

  get filterFields(): string[] {
    return ["code", "orgName", "innerName"];
  }
  get uploadExcelTooltip(): string {
    return "common-desc.excel-upload";
  }
  get sampleDownloadTooltip(): string {
    return "common-desc.sample-download";
  }
  headerSelectChange(data: TableHeaderModel[]): void {
    this.configService.setHospitalListTableHeaderList(this.selectedHeaders);
  }
  layoutInit(): void {
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "hospital-list.table.org-name";
      obj.field = "orgName";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "hospital-list.table.inner-name";
      obj.field = "innerName";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "hospital-list.table.owner-name";
      obj.field = "ownerName";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "hospital-list.table.address";
      obj.field = "address";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "hospital-list.table.etc1";
      obj.field = "etc1";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "hospital-list.table.etc2";
      obj.field = "etc2";
    }));

    this.selectedHeaders = this.configService.getHospitalListTableHeaderList();
    if (this.selectedHeaders.length <= 0) {
      this.selectedHeaders = [...this.headerList];
    }
  }
  getTableItem(item: HospitalModel, tableHeaderModel: TableHeaderModel): string {
    switch (tableHeaderModel.field) {
      case "orgName": return item.orgName;
      case "innerName": return item.innerName;
      case "ownerName": return item.ownerName;
      case "address": return item.address;
      case "etc1": return item.etc1;
      case "etc2": return item.etc2;
      default: return ""
    }
  }

  protected readonly filterTable = FExtensions.filterTable;
  protected readonly tableStyle = FConstants.tableStyle;
  protected readonly filterTableOption = FConstants.filterTableOption;
}
