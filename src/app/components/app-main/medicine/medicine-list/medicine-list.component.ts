import {Component, ElementRef, ViewChild} from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {customSort, ellipsis, filterTable, restTry} from "../../../../guards/f-extensions";
import {Table} from "primeng/table";
import {MedicineModel} from "../../../../models/rest/medicine-model";
import {UserRole} from "../../../../models/rest/user-role";
import {MedicineListService} from "../../../../services/rest/medicine-list.service";
import {saveAs} from "file-saver";

@Component({
  selector: "app-medicine-list",
  templateUrl: "./medicine-list.component.html",
  styleUrl: "./medicine-list.component.scss",
  standalone: false,
})
export class MedicineListComponent extends FComponentBase {
  @ViewChild("listTable") listTable!: Table;
  @ViewChild("inputUploadExcel") inputUploadExcel!: ElementRef<HTMLInputElement>;
  initValue: MedicineModel[] = [];
  viewList: MedicineModel[] = [];
  isSorted: boolean | null = null;
  constructor(private thisService: MedicineListService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.MedicineChanger));
  }

  override async ngInit(): Promise<void> {
    if (!this.haveRole) {
      await this.getMedicineAll();
    }
  }

  async getMedicineAll(): Promise<void> {
    this.setLoading();
    const ret = await restTry(async() => await this.thisService.getList(),
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
    this.fDialogService.openMedicineAddDialog({
      modal: true,
      closable: false,
      closeOnEscape: true,
      draggable: true,
      resizable: true,
      width: "50%",
      height: "80%",
    }).subscribe((x): void => {
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
      const ret = await restTry(async() => await this.thisService.postExcel(file),
        e => this.fDialogService.error("excelSelected", e));
      this.setLoading(false);
      if (ret.result) {
        await this.getMedicineAll();
        return;
      }
      this.fDialogService.warn("excelSelected", ret.msg);
    }
  }
  medicineEdit(data: MedicineModel): void {
    this.fDialogService.openPharmaEditDialog({
      modal: true,
      closable: false,
      closeOnEscape: true,
      draggable: true,
      resizable: true,
      width: "50%",
      height: "80%",
      data: data
    }).subscribe((x): void => {
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

  protected readonly customSort = customSort;
  protected readonly filterTable = filterTable;
  protected readonly ellipsis = ellipsis;
}
