import {Component, ElementRef, ViewChild} from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {HospitalService} from "../../../../services/rest/hospital.service";
import {customSort, ellipsis, filterTable, restTry} from "../../../../guards/f-extensions";
import {HospitalModel} from "../../../../models/rest/hospital-model";
import {Table} from 'primeng/table';
import {UserRole} from '../../../../models/rest/user-role';

@Component({
  selector: "app-hospital-list",
  templateUrl: "./hospital-list.component.html",
  styleUrl: "./hospital-list.component.scss",
  standalone: false,
})
export class HospitalListComponent extends FComponentBase {
  @ViewChild("hospitalListTable") hospitalListTable!: Table;
  @ViewChild("inputUploadExcel") inputUploadExcel!: ElementRef<HTMLInputElement>;
  initValue: HospitalModel[] = [];
  hospitalList: HospitalModel[] = [];
  isSorted: boolean | null = null;
  constructor(private hospitalService: HospitalService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.HospitalChanger));
  }

  override async ngInit(): Promise<void> {
    if (this.haveRole) {
      await this.getHospitalAll();
    }
  }
  async getHospitalAll(): Promise<void> {
    this.setLoading();
    const ret = await restTry(async() => await this.hospitalService.getHospitalAll(),
      e => this.fDialogService.error("getHospitalAll", e.message));
    this.setLoading(false);
    if (ret.result) {
      this.initValue = ret.data ?? [];
      this.hospitalList = ret.data ?? [];
      return;
    }
    this.fDialogService.warn("getHospitalAll", ret.msg);
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
      const ret = await restTry(async() => await this.hospitalService.postDataUploadExcel(file),
        e => this.fDialogService.error("excelSelected", e.message));
      this.setLoading(false);
      input.files = null;
      if (ret.result) {
        await this.getHospitalAll();
        return;
      }
      this.fDialogService.warn("excelSelected", ret.msg);
    }
  }
  hospitalEdit(data: HospitalModel): void {
    this.fDialogService.openUserEditDialog({
      modal: true,
      closable: false,
      closeOnEscape: true,
      draggable: true,
      resizable: true,
      width: "50%",
      height: "80%",
      data: data
    }).subscribe((x): void => {
      const initTarget = this.initValue?.findIndex(y => y.thisPK == x.thisPK) ?? 0
      if (initTarget > 0) {
        new HospitalModel().copyLhsFromRhs(this.initValue[initTarget], x);
      }
      const target = this.hospitalList.findIndex(y => y.thisPK == x.thisPK) ?? 0
      if (target > 0) {
        new HospitalModel().copyLhsFromRhs(this.hospitalList[target], x);
      }
    });
  }

  protected readonly customSort = customSort;
  protected readonly filterTable = filterTable;
  protected readonly ellipsis = ellipsis;
}
