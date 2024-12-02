import {Component, ElementRef, ViewChild} from "@angular/core";
import {UserService} from "../../../../../services/rest/user.service";
import {FDialogService} from "../../../../../services/common/f-dialog.service";
import {FComponentBase} from "../../../../../guards/f-component-base";
import {UserDataModel} from "../../../../../models/rest/user-data-model";
import {statusToUserStatusDesc} from "../../../../../models/rest/user-status";
import {getSeverity, tryCatchAsync} from "../../../../../guards/f-extensions";
import {flagToRoleDesc} from "../../../../../models/rest/user-role";
import {Table} from "primeng/table";
import {SortEvent} from "primeng/api";

@Component({
  selector: "app-user-setting",
  templateUrl: "./user-setting.component.html",
  styleUrl: "./user-setting.component.scss",
  standalone: false
})
export class UserSettingComponent extends FComponentBase {
  @ViewChild("userListTable") userListTable!: Table;
  @ViewChild("inputUploadExcel") inputUploadExcel!: ElementRef<HTMLInputElement>;
  isLoading: boolean = false;
  initValue?: UserDataModel[];
  userDataModel?: UserDataModel[];
  isSorted: boolean | null = null;
  constructor(private userService: UserService, private fDialogService: FDialogService) {
    super();
  }

  override async ngInit(): Promise<void> {
    await this.getUserDataModel();
  }
  setLoading(data: boolean = true): void {
    this.isLoading = data;
  }
  async getUserDataModel(): Promise<void> {
    this.setLoading();
    const ret = await tryCatchAsync(async() => this.userService.getUserAll(),
      e => this.fDialogService.error("getUserAll", e.message))
    this.setLoading(false);
    if (ret) {
      if (ret.result) {
        this.initValue = ret.data;
        this.userDataModel = ret.data;
        return;
      }
      this.fDialogService.warn("getUserAll", ret.msg);
    }
  }

  async refreshUserDataModel(): Promise<void> {
    await this.getUserDataModel();
  }
  uploadExcel(): void {
    this.inputUploadExcel.nativeElement.click();
  }
  async excelSelected(event: any): Promise<void>  {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.setLoading();
      const ret = await tryCatchAsync(async() => this.userService.postDataUploadExcel(file),
        e => this.fDialogService.error("taxpayerImageView", e.message));
      input.files = null;
      this.setLoading(false);
      if (ret) {
        if (ret.result) {
          await this.getUserDataModel();
          return;
        }
        this.fDialogService.warn("taxpayerImageView", ret.msg);
      }
    }
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
        this.userDataModel = [...this.initValue];
      }
      this.userListTable.reset();
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
    this.userListTable.filterGlobal(data.target.value, options);
  }
  userEdit(data: UserDataModel): void {
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
      const initTarget = this.userDataModel?.findIndex(y => y.thisPK == x.thisPK) ?? 0
      if (initTarget > 0) {
        new UserDataModel().copyLhsToRhs(this.initValue!![initTarget], x);
      }
      const target = this.userDataModel?.findIndex(y => y.thisPK == x.thisPK) ?? 0
      if (target > 0) {
        new UserDataModel().copyLhsToRhs(this.userDataModel!![target], x);
      }
    });
  }

  protected readonly statusToUserStatusDesc = statusToUserStatusDesc;
  protected readonly getSeverity = getSeverity;
  protected readonly flagToRoleDesc = flagToRoleDesc;
}
