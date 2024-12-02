import {Component, ElementRef, ViewChild} from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {HospitalService} from "../../../../services/rest/hospital.service";
import {customSort, ellipsis, filterTable, tryCatchAsync} from "../../../../guards/f-extensions";
import {FDialogService} from "../../../../services/common/f-dialog.service";
import {HospitalModel} from "../../../../models/rest/hospital-model";
import {Table} from 'primeng/table';

@Component({
  selector: "app-hospital-list",
  templateUrl: "./hospital-list.component.html",
  styleUrl: "./hospital-list.component.scss",
  standalone: false,
})
export class HospitalListComponent extends FComponentBase {
  @ViewChild("hospitalListTable") hospitalListTable!: Table;
  @ViewChild("inputUploadExcel") inputUploadExcel!: ElementRef<HTMLInputElement>;
  isLoading: boolean = false;
  initValue: HospitalModel[] = [];
  hospitalList: HospitalModel[] = [];
  isSorted: boolean | null = null;
  constructor(private hospitalService: HospitalService, private fDialogService: FDialogService) {
    super();
  }

  override async ngInit(): Promise<void> {
    await this.getHospitalAll();
  }
  setLoading(data: boolean = true): void {
    this.isLoading = data;
  }
  async getHospitalAll(): Promise<void> {
    this.setLoading();
    const ret = await tryCatchAsync(async() => await this.hospitalService.getHospitalAll(),
      e => this.fDialogService.error("getHospitalAll", e.message));
    this.setLoading(false);
    if (ret) {
      if (ret.result) {
        this.initValue = ret.data ?? [];
        this.hospitalList = ret.data ?? [];
        return;
      }
      this.fDialogService.warn("getHospitalAll", ret.msg);
    }
  }
  async refreshHospitalData(): Promise<void> {
    await this.getHospitalAll();
  }
  uploadExcel(): void {
    this.inputUploadExcel.nativeElement.click();
  }
  async excelSelected(event: any): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.setLoading();
      const ret = await tryCatchAsync(async() => this.hospitalService.postDataUploadExcel(file),
        e => this.fDialogService.error("excelSelected", e.message));
      input.files = null;
      this.setLoading(false);
      if (ret) {
        if (ret.result) {
          await this.getHospitalAll();
          return;
        }
        this.fDialogService.warn("excelSelected", ret.msg);
      }
    }
  }
  hospitalEdit(data: HospitalModel): void {

  }

  protected readonly customSort = customSort;
  protected readonly filterTable = filterTable;
  protected readonly ellipsis = ellipsis;
}
