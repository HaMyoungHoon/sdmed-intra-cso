import {Component, ElementRef, ViewChild} from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {UserRole} from "../../../../models/rest/user/user-role";
import * as FExtensions from "../../../../guards/f-extensions";
import {Table} from "primeng/table";
import {PharmaModel} from "../../../../models/rest/pharma/pharma-model";
import {saveAs} from "file-saver";
import {PharmaListService} from "../../../../services/rest/pharma-list.service";
import * as FConstants from "../../../../guards/f-constants";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: "app-pharma-list",
  standalone: false,
  templateUrl: "./pharma-list.component.html",
  styleUrl: "./pharma-list.component.scss",
})
export class PharmaListComponent extends FComponentBase {
  @ViewChild("listTable") listTable!: Table;
  @ViewChild("inputUploadExcel") inputUploadExcel!: ElementRef<HTMLInputElement>;
  @ViewChild("inputPharmaMedicineUploadExcel") inputPharmaMedicineUploadExcel!: ElementRef<HTMLInputElement>;
  initValue: PharmaModel[] = [];
  viewList: PharmaModel[] = [];
  isSorted: boolean | null = null;
  constructor(private thisService: PharmaListService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.PharmaChanger));
  }

  override async ngInit(): Promise<void> {
    await this.getPharmaAll();
  }
  async getPharmaAll(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getList(),
      e => this.fDialogService.error("getPharmaAll", e));
    this.setLoading(false);
    if (ret.result) {
      this.initValue = ret.data ?? [];
      this.viewList = [...this.initValue];
      return;
    }
    this.fDialogService.warn("getPharmaAll", ret.msg);
  }
  async refreshData(): Promise<void> {
    await this.getPharmaAll();
  }
  uploadExcel(): void {
    this.inputUploadExcel.nativeElement.click();
  }
  insertData(): void {
    const isNewTab = this.configService.isNewTab();
    if (isNewTab) {
      window.open(FConstants.PHARMA_NEW_URL);
      return;
    }
    const sub = new Subject<any>();
    this.sub.push(sub);
    this.fDialogService.openPharmaAddDialog({
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
      this.initValue.unshift(new PharmaModel().init(x));
      this.viewList.unshift(new PharmaModel().init(x));
    });
  }
  async sampleDown(): Promise<void> {
    this.thisService.getExcelSample().then(x => {
      const blob = URL.createObjectURL(x.body);
      saveAs(blob, "pharmaSampleExcel.xlsx");
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
        e => this.fDialogService.error("excelSelected", e));
      this.setLoading(false);
      this.inputUploadExcel.nativeElement.value = "";
      if (ret.result) {
        await this.getPharmaAll();
        return;
      }
      this.fDialogService.warn("excelSelected", ret.msg);
    }
  }
  uploadPharmaMedicineExcel(): void {
    this.inputPharmaMedicineUploadExcel.nativeElement.click();
  }
  pharmaMedicineSampleDown(): void {
    this.thisService.getPharmaMedicineExcelSample().then(x => {
      const blob = URL.createObjectURL(x.body);
      saveAs(blob, "pharmaSampleExcel.xlsx");
    }).catch(x => {
      this.fDialogService.error("sampleDown", x.message);
    });
  }
  async pharmaMedicineExcelSelected(event: any): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.setLoading();
      const ret = await FExtensions.restTry(async() => await this.thisService.postPharmaMedicineExcel(file),
        e => this.fDialogService.error("excelSelected", e));
      this.setLoading(false);
      this.inputPharmaMedicineUploadExcel.nativeElement.value = "";
      if (ret.result) {
        await this.getPharmaAll();
        return;
      }
      this.fDialogService.warn("excelSelected", ret.msg);
    }
  }
  pharmaEdit(data: PharmaModel): void {
    const isNewTab = this.configService.isNewTab();
    if (isNewTab) {
      window.open(`${FConstants.PHARMA_LIST_URL}/${data.thisPK}`);
      return;
    }
    const sub = new Subject<any>();
    this.sub.push(sub);
    this.fDialogService.openPharmaEditDialog({
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
        new PharmaModel().copyLhsFromRhs(this.initValue[initTarget], x);
      }
      const target = this.viewList.findIndex(y => y.thisPK == x.thisPK) ?? -1
      if (target >= 0) {
        new PharmaModel().copyLhsFromRhs(this.viewList[target], x);
      }
    });
  }

  get filterFields(): string[] {
    return ["code", "orgName", "innerName"];
  }
  get uploadExcelTooltip(): string {
    return "pharma-list.post-pharma-data";
  }
  get sampleDownloadTooltip(): string {
    return "common-desc.sample-download";
  }
  get uploadMedicineTooltip(): string {
    return "pharma-list.post-pharma-medicine";
  }
  get pharmaMedicineSampleDownloadTooltip(): string {
    return "pharma-list.sample-pharma-medicine";
  }

  protected readonly customSort = FExtensions.customSort;
  protected readonly filterTable = FExtensions.filterTable;
  protected readonly ellipsis = FExtensions.ellipsis;
  protected readonly tableStyle = FConstants.tableStyle;
  protected readonly filterTableOption = FConstants.filterTableOption;
}
