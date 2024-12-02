import {Component, ViewChild} from "@angular/core";
import {MedicineService} from "../../../../services/rest/medicine.service";
import {MedicineModel} from "../../../../models/rest/medicine-model";
import {FDialogService} from "../../../../services/common/f-dialog.service";
import {Table} from "primeng/table";
import {TableDialogColumn} from "../../../../models/common/table-dialog-column";
import {FComponentBase} from "../../../../guards/f-component-base";
import {customSort, filterTable} from '../../../../guards/f-extensions';

@Component({
  selector: "app-medicine-list",
  templateUrl: "./medicine-list.component.html",
  styleUrl: "./medicine-list.component.scss",
  standalone: false
})
export class MedicineListComponent extends FComponentBase {
  @ViewChild("medicineListTable") medicineListTable!: Table
  initValue: MedicineModel[] = [];
  medicineModel: MedicineModel[] = [];
  loading: boolean = true;
  isSorted: boolean | null = null;
  constructor(private medicineService: MedicineService, private fDialogService: FDialogService) {
    super();
  }

  override ngInit(): void {
    this.medicineService.getMedicineAll().then(x => {
      if (x.result) {
        this.initValue = x.data ?? [];
        this.medicineModel = x.data ?? [];
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

  protected readonly customSort = customSort
  protected readonly filterTable = filterTable;
}
