import {Component, ElementRef, ViewChild} from "@angular/core";
import {MedicineModel} from "../../../../models/rest/medicine/medicine-model";
import {Table} from "primeng/table";
import {TableDialogColumn} from "../../../../models/common/table-dialog-column";
import {FComponentBase} from "../../../../guards/f-component-base";
import * as FExtensions from "../../../../guards/f-extensions";
import {MedicinePriceListService} from "../../../../services/rest/medicine-price-list.service";
import {UserRole} from "../../../../models/rest/user/user-role";
import * as FConstants from "../../../../guards/f-constants";
import {TableHeaderModel} from "../../../../models/common/table-header-model";

@Component({
  selector: "app-medicine-price-list",
  templateUrl: "./medicine-price-list.component.html",
  styleUrl: "./medicine-price-list.component.scss",
  standalone: false
})
export class MedicinePriceListComponent extends FComponentBase {
  @ViewChild("listTable") listTable!: Table;
  @ViewChild("inputPriceUploadExcel") inputPriceUploadExcel!: ElementRef<HTMLInputElement>;
  @ViewChild("inputMainIngredientUploadExcel") inputMainIngredientUploadExcel!: ElementRef<HTMLInputElement>;
  lastApplyDate?: Date;
  headerList: TableHeaderModel[] = [];
  selectedHeaders: TableHeaderModel[] = [];
  applyDate: Date = new Date();
  initValue: MedicineModel[] = [];
  medicineModel: MedicineModel[] = [];
  constructor(private thisService: MedicinePriceListService) {
    super();
    this.layoutInit();
  }

  override async ngInit(): Promise<void> {
    await this.getMedicinePriceList();
  }
  async getMedicinePriceList(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getList(),
      e => this.fDialogService.error("get medicine", e));
    this.setLoading(false);
    if (ret.result) {
      this.initValue = ret.data ?? [];
      this.medicineModel = [...this.initValue];
      await this.getLastApplyDate();
      return;
    }
    this.fDialogService.warn("get medicine", ret.msg);
  }
  async getLastApplyDate(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getMedicinePriceApplyDate(),
      e => this.fDialogService.error("getLastApplyDate", e));
    this.setLoading(false);
    if (ret.result) {
      this.lastApplyDate = FExtensions.stringToDate(ret.data);
      return;
    }
    this.fDialogService.warn("getLastApplyDate", ret.data);
  }

  async priceHistoryDialogOpen(data: MedicineModel): Promise<void> {
    if (this.disablePriceHistory(data)) {
      return;
    }
    const col: TableDialogColumn[] = [];
    col.push(new TableDialogColumn().build("maxPrice", "medicine-price-list.max-price"))
    col.push(new TableDialogColumn().build("ancestorCode", "medicine-price-list.ancestor-code"))
    col.push(new TableDialogColumn().build("applyDate", "medicine-price-list.apply-date"))
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getHistoryList(data.kdCode),
    e => this.fDialogService.error("priceList", e));
    this.setLoading(false);
    if (!ret.result) {
      this.fDialogService.warn("priceList", ret.msg);
    }
    this.fDialogService.openTable({
      modal: true,
      closable: true,
      closeOnEscape: true,
      draggable: true,
      resizable: true,
      data: {
        cols: col,
        tableData: ret.data ?? [],
        selectable: null
      }
    });
  }
  getApplyDate(data: MedicineModel): string {
    if (data.medicinePriceModel.length <= 0) {
      return "None";
    }

    return FExtensions.dateToYYYYMMdd(data.medicinePriceModel[0].applyDate);
  }
  disablePriceHistory(data: MedicineModel): boolean {
    return data.medicinePriceModel.length <= 0;
  }

  async refresh(): Promise<void> {
    return await this.getMedicinePriceList();
  }
  async uploadPriceExcel(): Promise<void> {
    this.inputPriceUploadExcel.nativeElement.click();
  }
  async uploadMainIngredientExcel(): Promise<void> {
    this.inputMainIngredientUploadExcel.nativeElement.click();
  }
  async priceExcelSelected(event: any): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.setLoading();
      const file = input.files[0];
      const ret = await FExtensions.restTry(async() => await this.thisService.postMedicinePriceUpload(FExtensions.dateToYearFullString(this.applyDate), file),
        e => this.fDialogService.error("uploadPriceExcel", e));
      this.inputPriceUploadExcel.nativeElement.value = "";
      if (ret.result) {
        await this.refresh();
        return;
      }
      this.fDialogService.warn("uploadPriceExcel", ret.msg);
      this.setLoading(false);
    }
  }
  async mainIngredientExcelSelected(event: any): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.setLoading();
      const file = input.files[0];
      const ret = await FExtensions.restTry(async() => await this.thisService.postMedicineIngredientUpload(file),
        e => this.fDialogService.error("uploadPriceExcel", e));
      this.inputMainIngredientUploadExcel.nativeElement.value = "";
      if (ret.result) {
        await this.refresh();
        return;
      }
      this.fDialogService.warn("uploadPriceExcel", ret.msg);
      this.setLoading(false);
    }
  }

  get isAdmin(): boolean {
    return ((this.myRole & UserRole.Admin.valueOf()) != 0) || ((this.myRole & UserRole.CsoAdmin.valueOf()) != 0)
  }

  get filterFields(): string[] {
    return ["orgName", "kdCode", "clientName", "makerName", "maxPrice", "medicineIngredientModel.mainIngredientName"];
  }
  get uploadPriceTooltip(): string {
    return "medicine-price-list.price-excel";
  }
  get uploadMainIngredient(): string {
    return "medicine-price-list.main-ingredient-excel";
  }

  tableNgClass(item: MedicineModel): {"zero-price": boolean, "click-tr": boolean} {
    return {
      "zero-price": item.maxPrice === 0,
      "click-tr": !this.disablePriceHistory(item),
    };
  }
  headerSelectChange(data: TableHeaderModel[]): void {
    if (data.length <= 0) {
      this.selectedHeaders = [];
    }
    this.configService.setMedicinePriceListTableHeaderList(this.selectedHeaders);
  }
  layoutInit(): void {
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "medicine-price-list.inner-name";
      obj.className = "minW30rem";
      obj.field = "innerName";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "medicine-price-list.main-ingredient-name";
      obj.className = "minW20rem";
      obj.field = "mainIngredientName";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "medicine-price-list.kd-code";
      obj.field = "kdCode";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "medicine-price-list.max-price";
      obj.className = "minW5rem";
      obj.field = "maxPrice";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "medicine-price-list.charge";
      obj.className = "minW5rem";
      obj.field = "charge";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "medicine-price-list.standard";
      obj.className = "minW5rem";
      obj.field = "standard";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "medicine-price-list.etc1";
      obj.className = "minW5rem";
      obj.field = "etc";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "medicine-price-list.client-name";
      obj.className = "minW5rem";
      obj.field = "clientName";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "medicine-price-list.maker-name";
      obj.className = "minW5rem";
      obj.field = "makerName";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "medicine-price-list.custom-price";
      obj.className = "minW5rem";
      obj.field = "customPrice";
    }));
    this.headerList.push(FExtensions.applyClass(TableHeaderModel, obj => {
      obj.header = "medicine-price-list.apply-date";
      obj.className = "minW5rem";
      obj.field = "applyDate";
    }));

    this.selectedHeaders = this.configService.getMedicinePriceListTableHeaderList();
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
      case "standard": return item.medicineSubModel.standard;
      case "applyDate": return this.getApplyDate(item);
      case "etc": return item.medicineSubModel.etc1;
      default: return ""
    }
  }

  protected readonly filterTable = FExtensions.filterTable;
  protected readonly dateToYYYYMMdd = FExtensions.dateToYYYYMMdd;
  protected readonly tableStyle = FConstants.tableStyle;
  protected readonly filterTableOption = FConstants.filterTableOption;
}
