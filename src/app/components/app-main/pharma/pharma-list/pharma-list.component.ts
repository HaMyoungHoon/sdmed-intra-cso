import {Component, ElementRef, ViewChild} from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {UserRole} from "../../../../models/rest/user-role";
import {customSort, ellipsis, filterTable, restTry} from "../../../../guards/f-extensions";
import {Table} from "primeng/table";
import {PharmaModel} from "../../../../models/rest/pharma-model";
import {PharmaService} from "../../../../services/rest/pharma.service";

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
      this.initValue = ret.data ?? [];
      this.pharmaList = ret.data ?? [];
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

  }
  async excelSelected(event: any): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.setLoading();
      const ret = await restTry(async() => this.pharmaService.postDataUploadExcel(file),
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

  }

  protected readonly customSort = customSort;
  protected readonly filterTable = filterTable;
  protected readonly ellipsis = ellipsis;
}
