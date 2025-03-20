import {Component, ElementRef, ViewChild} from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import * as FExtensions from "../../../../guards/f-extensions";
import {Table} from "primeng/table";
import {MedicineModel} from "../../../../models/rest/medicine/medicine-model";
import {UserRole} from "../../../../models/rest/user/user-role";
import {MedicineListService} from "../../../../services/rest/medicine-list.service";
import {saveAs} from "file-saver";
import * as FConstants from "../../../../guards/f-constants";
import {Subject, takeUntil} from "rxjs";
import {TableHeaderModel} from "../../../../models/common/table-header-model";

@Component({
  selector: "app-medicine-list",
  templateUrl: "./medicine-list.component.html",
  styleUrl: "./medicine-list.component.scss",
  standalone: false,
})
export class MedicineListComponent extends FComponentBase {
  @ViewChild("listTable") listTable!: Table;
  @ViewChild("inputUploadExcel") inputUploadExcel!: ElementRef<HTMLInputElement>;
  headerList: TableHeaderModel[] = [];
  selectedHeaders: TableHeaderModel[] = [];
  initValue: MedicineModel[] = [];
  viewList: MedicineModel[] = [];
  constructor(private thisService: MedicineListService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.MedicineChanger));
    this.layoutInit();
  }

  override async ngInit(): Promise<void> {
    await this.getMedicineAll();
  }

  async getMedicineAll(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getList(),
      e => this.fDialogService.error("getMedicineAll", e));
    this.setLoading(false);
    if (ret.result) {
      this.initValue = ret.data ?? [];
      this.viewList = [...this.initValue];
      return;
    }
    this.fDialogService.warn("getMedicineAll", ret.msg);
  }

  async refreshData(): Promise<void> {
    await this.getMedicineAll();
  }
  uploadExcel(): void {
    this.inputUploadExcel.nativeElement.click();
  }
  insertData(): void {
    const isNewTab = this.configService.isNewTab();
    if (isNewTab) {
      window.open(FConstants.MEDICINE_NEW_URL);
      return;
    }
    const sub = new Subject<any>();
    this.sub.push(sub);
    this.fDialogService.openMedicineAddDialog({
      modal: true,
      closable: true,
      closeOnEscape: true,
      draggable: true,
      resizable: true,
      maximizable: true,
      width: "60%",
    }).pipe(takeUntil(sub)).subscribe((x): void => {
      if (x == null) {
        return;
      }
      this.initValue.unshift(new MedicineModel().init(x));
      this.viewList.unshift(new MedicineModel().init(x));
    });
  }
  async sampleDown(): Promise<void> {
    this.thisService.getExcelSample().then(x => {
      const blob = URL.createObjectURL(x.body);
      saveAs(blob, "medicineSample.xlsx");
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
        await this.getMedicineAll();
        this.fDialogService.success("excel upload", ret.data);
        return;
      }
      this.fDialogService.warn("excel upload", ret.msg);
    }
  }
  medicineEdit(data: MedicineModel): void {
    const isNewTab = this.configService.isNewTab();
    if (isNewTab) {
      window.open(`${FConstants.MEDICINE_LIST_URL}/${data.thisPK}`);
      return;
    }
    const sub = new Subject<any>();
    this.sub.push(sub);
    this.fDialogService.openMedicineEditDialog({
      modal: true,
      closable: true,
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
        new MedicineModel().copyLhsFromRhs(this.initValue[initTarget], x);
      }
      const target = this.viewList.findIndex(y => y.thisPK == x.thisPK) ?? -1
      if (target >= 0) {
        new MedicineModel().copyLhsFromRhs(this.viewList[target], x);
      }
    });
  }

  get filterFields(): string[] {
    return ["orgName", "kdCode", "clientName", "makerName", "maxPrice", "medicineIngredientModel.mainIngredientName"];
  }
  get uploadExcelTooltip(): string {
    return "common-desc.excel-upload";
  }
  get sampleDownloadTooltip(): string {
    return "common-desc.sample-download";
  }
  headerSelectChange(data: TableHeaderModel[]): void {
    if (data.length <= 0) {
      this.selectedHeaders = [];
    }
    this.configService.setMedicineListTableHeaderList(this.selectedHeaders);
  }
  layoutInit(): void {
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "medicine-list.inner-name";
      obj.className = "minW30rem";
      obj.field = "innerName";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "medicine-list.main-ingredient-name";
      obj.className = "minW20rem";
      obj.field = "mainIngredientName";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "medicine-list.kd-code";
      obj.field = "kdCode";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "medicine-list.max-price";
      obj.className = "minW5rem";
      obj.field = "maxPrice";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "medicine-list.charge";
      obj.className = "minW5rem";
      obj.field = "charge";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "medicine-list.standard";
      obj.className = "minW5rem";
      obj.field = "standard";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "medicine-list.etc1";
      obj.className = "minW5rem";
      obj.field = "etc";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "medicine-list.client-name";
      obj.className = "minW5rem";
      obj.field = "clientName";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "medicine-list.maker-name";
      obj.className = "minW5rem";
      obj.field = "makerName";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "medicine-list.custom-price";
      obj.className = "minW5rem";
      obj.field = "customPrice";
    }));

    this.selectedHeaders = this.configService.getMedicineListTableHeaderList();
    if (this.selectedHeaders.length <= 0) {
      this.selectedHeaders = [...this.headerList];
    }
  }
  getTableItem(item: MedicineModel, tableHeaderModel: TableHeaderModel): string {
    switch (tableHeaderModel.field) {
      case "orgName": return item.orgName;
      case "innerName": return item.innerName;
      case "kdCode": return item.kdCode;
      case "clientName": return item.clientName ?? "";
      case "makerName": return item.makerName ?? "";
      case "mainIngredientName": return item.medicineIngredientModel.mainIngredientName;
      case "maxPrice": return item.maxPrice.toString();
      case "customPrice": return item.customPrice.toString();
      case "charge": return item.charge.toString();
      case "standard": return item.standard;
      case "etc": return item.etc1;
      default: return ""
    }
  }

  protected readonly filterTable = FExtensions.filterTable;
  protected readonly tableStyle = FConstants.tableStyle;
  protected readonly filterTableOption = FConstants.filterTableOption;
}
