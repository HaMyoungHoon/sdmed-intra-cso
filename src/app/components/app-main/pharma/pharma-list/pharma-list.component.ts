import {Component, ElementRef, ViewChild} from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {UserRole} from "../../../../models/rest/user-role";
import {customSort, ellipsis, filterTable, restTry} from "../../../../guards/f-extensions";
import {Table} from "primeng/table";
import {PharmaModel} from "../../../../models/rest/pharma-model";
import {PharmaService} from "../../../../services/rest/pharma.service";
import {saveAs} from "file-saver";

@Component({
  selector: "app-pharma-list",
  standalone: false,
  templateUrl: "./pharma-list.component.html",
  styleUrl: "./pharma-list.component.scss",
})
export class PharmaListComponent extends FComponentBase {
  @ViewChild("pharmaListTable") pharmaListTable!: Table;
  @ViewChild("inputUploadExcel") inputUploadExcel!: ElementRef<HTMLInputElement>;
  initValue: PharmaModel[] = [];
  pharmaList: PharmaModel[] = [];
  isSorted: boolean | null = null;
  constructor(private pharmaService: PharmaService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.PharmaChanger));
  }

  override async ngInit(): Promise<void> {
    if (this.haveRole) {
      await this.getPharmaAll();
    }
  }
  async getPharmaAll(): Promise<void> {
    this.setLoading();
    const ret = await restTry(async() => await this.pharmaService.getPharmaAll(),
      e => this.fDialogService.error("getPharmaAll", e));
    this.setLoading(false);
    if (ret.result) {
//      this.initValue = ret.data ?? [];
      this.initValue = ret.data?.filter(x => !x.innerName.startsWith("[X]")) ?? [];
//      this.pharmaList = ret.data ?? [];
      this.pharmaList = ret.data?.filter(x => !x.innerName.startsWith("[X]")) ?? [];
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
    this.fDialogService.openPharmaAddDialog({
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
      const initTarget = this.initValue?.findIndex(y => y.thisPK == x.thisPK) ?? 0
      if (initTarget > 0) {
        new PharmaModel().copyLhsFromRhs(this.initValue[initTarget], x);
      }
      const target = this.pharmaList.findIndex(y => y.thisPK == x.thisPK) ?? 0
      if (target > 0) {
        new PharmaModel().copyLhsFromRhs(this.pharmaList[target], x);
      }
    });
  }
  async sampleDown(): Promise<void> {
    this.pharmaService.getSampleDownloadExcel().then(x => {
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
      const ret = await restTry(async() => await this.pharmaService.postDataUploadExcel(file),
        e => this.fDialogService.error("excelSelected", e));
      this.setLoading(false);
      if (ret.result) {
        await this.getPharmaAll();
        return;
      }
      this.fDialogService.warn("excelSelected", ret.msg);
    }
  }
  pharmaEdit(data: PharmaModel): void {
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
        new PharmaModel().copyLhsFromRhs(this.initValue[initTarget], x);
      }
      const target = this.pharmaList.findIndex(y => y.thisPK == x.thisPK) ?? -1
      if (target >= 0) {
        new PharmaModel().copyLhsFromRhs(this.pharmaList[target], x);
      }
    });
  }

  protected readonly customSort = customSort;
  protected readonly filterTable = filterTable;
  protected readonly ellipsis = ellipsis;
}
