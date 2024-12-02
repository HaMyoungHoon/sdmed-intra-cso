import {Component, ViewChild} from "@angular/core";
import {MedicineService} from "../../../../services/rest/medicine.service";
import {MedicineModel} from "../../../../models/rest/medicine-model";
import {FDialogService} from "../../../../services/common/f-dialog.service";
import {Table} from "primeng/table";
import {SortEvent} from "primeng/api";
import {TableDialogColumn} from "../../../../models/common/table-dialog-column";
import {FComponentBase} from "../../../../guards/f-component-base";

@Component({
  selector: "app-medicine-list",
  templateUrl: "./medicine-list.component.html",
  styleUrl: "./medicine-list.component.scss",
  standalone: false
})
export class MedicineListComponent extends FComponentBase {
  @ViewChild("medicineListTable") medicineListTable!: Table
  initValue?: MedicineModel[];
  medicineModel?: MedicineModel[];
  loading: boolean = true;
  isSorted: boolean | null = null;
  constructor(private medicineService: MedicineService, private fDialogService: FDialogService) {
    super();
  }

  override ngInit(): void {
    this.medicineService.getMedicineAll().then(x => {
      if (x.result) {
        this.initValue = x.data;
        this.medicineModel = x.data;
        this.loading = false;
        return;
      }

      this.fDialogService.warn("get medicine", x.msg);
      this.loading = false;
    }).catch(x => {
      this.fDialogService.error("get medicine", x.message);
      this.loading = false;
    });
  }

  customSort(event: SortEvent): void {
    if (this.isSorted == null) {
      this.isSorted = true;
      this.sortTableData(event);
    } else if (this.isSorted) {
      this.isSorted = false;
      this.sortTableData(event);
    } else if (!this.isSorted) {
      this.isSorted = null;
      if (this.initValue) {
        this.medicineModel = [...this.initValue];
      }
      this.medicineListTable.reset();
    }
  }
  sortTableData(event: any): void {
    event.data.sort((data1: any[], data2: any[]) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      let result: number;
      if (value1 == null && value2 != null) result = -1;
      else if (value1 != null && value2 == null) result = 1;
      else if (value1 == null && value2 == null) result = 0;
      else if (typeof value1 === "string" && typeof value2 === "string") result = value1.localeCompare(value2);
      else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

      return event.order * result;
    });
  }
  filterTable(data: any, options: string): void {
    this.medicineListTable.filterGlobal(data.target.value, options);
  }
  priceHistoryDialogOpen(data: MedicineModel): void {
    const col: TableDialogColumn[] = [];
    col.push(new TableDialogColumn().build("maxPrice", "medicine-list.max-price"))
    col.push(new TableDialogColumn().build("etc", "medicine-list.etc"))
    col.push(new TableDialogColumn().build("applyDate", "medicine-list.apply-date"))
    this.fDialogService.openTable({
      modal: true,
      closable: true,
      closeOnEscape: true,
      draggable: true,
      resizable: true,
      data: {
        cols: col,
        tableData: data.medicinePriceModel,
        selectable: null
      }
    });
  }
}
