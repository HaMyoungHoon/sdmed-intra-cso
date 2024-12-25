import {Component, ElementRef, ViewChild} from "@angular/core";
import {MedicineModel} from "../../../../models/rest/medicine/medicine-model";
import {Table} from "primeng/table";
import {TableDialogColumn} from "../../../../models/common/table-dialog-column";
import {FComponentBase} from "../../../../guards/f-component-base";
import * as FExtensions from "../../../../guards/f-extensions";
import {MedicinePriceListService} from "../../../../services/rest/medicine-price-list.service";
import {UserRole} from "../../../../models/rest/user/user-role";

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
  applyDate: Date = new Date();
  initValue: MedicineModel[] = [];
  medicineModel: MedicineModel[] = [];
  isSorted: boolean | null = null;
  constructor(private thisService: MedicinePriceListService) {
    super();
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

    return FExtensions.dateToMonthYYYYMMdd(data.medicinePriceModel[0].applyDate);
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

  protected readonly customSort = FExtensions.customSort
  protected readonly filterTable = FExtensions.filterTable;
  protected readonly dateToMonthYYYYMMdd = FExtensions.dateToMonthYYYYMMdd;
}
