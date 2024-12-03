import {Component, ViewChild} from "@angular/core";
import {MedicineService} from "../../../../services/rest/medicine.service";
import {MedicineModel} from "../../../../models/rest/medicine-model";
import {FDialogService} from "../../../../services/common/f-dialog.service";
import {Table} from "primeng/table";
import {TableDialogColumn} from "../../../../models/common/table-dialog-column";
import {FComponentBase} from "../../../../guards/f-component-base";
import {customSort, filterTable, restTry} from '../../../../guards/f-extensions';
import {UserService} from '../../../../services/rest/user.service';
import {UserRole} from '../../../../models/rest/user-role';

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
  isSorted: boolean | null = null;
  constructor(override userService: UserService, override fDialogService: FDialogService, private medicineService: MedicineService) {
    super(userService, fDialogService, Array<UserRole>(UserRole.None));
  }

  override async ngInit(): Promise<void> {
    this.setLoading();
    const ret = await restTry(async() => await this.medicineService.getMedicineAll(),
      e => this.fDialogService.error("get medicine", e.message));
    this.setLoading(false);
    if (ret.result) {
      this.initValue = ret.data ?? [];
      this.medicineModel = ret.data ?? [];
      return;
    }
    this.fDialogService.warn("get medicine", ret.msg);
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
