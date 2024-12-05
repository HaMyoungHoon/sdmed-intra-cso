import {Component, ViewChild} from "@angular/core";
import {MedicineService} from "../../../../services/rest/medicine.service";
import {MedicineModel} from "../../../../models/rest/medicine-model";
import {Table} from "primeng/table";
import {TableDialogColumn} from "../../../../models/common/table-dialog-column";
import {FComponentBase} from "../../../../guards/f-component-base";
import {customSort, filterTable, restTry} from "../../../../guards/f-extensions";

@Component({
  selector: "app-medicine-price-list",
  templateUrl: "./medicine-price-list.component.html",
  styleUrl: "./medicine-price-list.component.scss",
  standalone: false
})
export class MedicinePriceListComponent extends FComponentBase {
  @ViewChild("medicineListTable") medicineListTable!: Table
  initValue: MedicineModel[] = [];
  medicineModel: MedicineModel[] = [];
  isSorted: boolean | null = null;
  constructor(private medicineService: MedicineService) {
    super();
  }

  override async ngInit(): Promise<void> {
    if (this.haveRole) {
      await this.getMedicinePriceList();
      return;
    }
  }
  async getMedicinePriceList(): Promise<void> {
    this.setLoading();
    const ret = await restTry(async() => await this.medicineService.getMedicineAll(),
      e => this.fDialogService.error("get medicine", e));
    this.setLoading(false);
    if (ret.result) {
      this.initValue = ret.data ?? [];
      this.medicineModel = ret.data ?? [];
      return;
    }
    this.fDialogService.warn("get medicine", ret.msg);
  }

  async priceHistoryDialogOpen(data: MedicineModel): Promise<void> {
    const col: TableDialogColumn[] = [];
    col.push(new TableDialogColumn().build("maxPrice", "medicine-price-list.max-price"))
    col.push(new TableDialogColumn().build("ancestorCode", "medicine-price-list.ancestor-code"))
    col.push(new TableDialogColumn().build("applyDate", "medicine-price-list.apply-date"))
    this.setLoading();
    const ret = await restTry(async() => await this.medicineService.getMedicinePriceList(data.kdCode),
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

    return data.medicinePriceModel[0].applyDate;
  }
  disablePriceHistory(data: MedicineModel): boolean {
    return data.medicinePriceModel.length <= 0;
  }

  protected readonly customSort = customSort
  protected readonly filterTable = filterTable;
}
