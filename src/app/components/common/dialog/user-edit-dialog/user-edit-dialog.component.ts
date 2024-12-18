import {Component, ElementRef, input, ViewChild} from "@angular/core";
import {UserDataModel} from "../../../../models/rest/user/user-data-model";
import {dateToYearFullString, getFileExt, isImage, restTry, stringToDate, tryCatchAsync} from "../../../../guards/f-extensions";
import {
  allUserRoleDescArray,
  flagToRoleDesc,
  stringArrayToUserRole,
  UserRole,
  userRoleToFlag
} from "../../../../models/rest/user/user-role";
import {allUserStatusDescArray, StatusDescToUserStatus, statusToUserStatusDesc, UserStatus,} from "../../../../models/rest/user/user-status";
import {
  allUserDeptDescArray,
  flagToDeptDesc,
  stringArrayToUserDept,
  userDeptToFlag
} from "../../../../models/rest/user/user-dept";
import {AccordionModule} from "primeng/accordion";
import {NgIf} from "@angular/common";
import {TagModule} from "primeng/tag";
import {TranslatePipe} from "@ngx-translate/core";
import {FormsModule} from "@angular/forms";
import {MultiSelectModule} from "primeng/multiselect";
import {ButtonModule} from "primeng/button";
import {TableModule} from "primeng/table";
import {HospitalModel} from "../../../../models/rest/hospital/hospital-model";
import {ImageModule} from "primeng/image";
import * as FConstants from "../../../../guards/f-constants";
import {InputTextModule} from "primeng/inputtext";
import {ProgressSpinComponent} from "../../progress-spin/progress-spin.component";
import {FDialogComponentBase} from "../../../../guards/f-dialog-component-base";
import {UserInfoService} from "../../../../services/rest/user-info.service";
import {Tooltip} from "primeng/tooltip";
import {transformToBoolean} from "primeng/utils";
import {Select} from "primeng/select";

@Component({
  selector: "app-user-edit-dialog",
  imports: [AccordionModule, NgIf, TagModule, TranslatePipe, FormsModule, MultiSelectModule, ButtonModule, TableModule, ImageModule, InputTextModule, ProgressSpinComponent, Tooltip, Select],
  templateUrl: "./user-edit-dialog.component.html",
  styleUrl: "./user-edit-dialog.component.scss",
  standalone: true,
})
export class UserEditDialogComponent extends FDialogComponentBase {
  @ViewChild("taxpayerImageInput") taxpayerImageInput!: ElementRef<HTMLInputElement>
  @ViewChild("bankAccountImageInput") bankAccountImageInput!: ElementRef<HTMLInputElement>
  userDataModel: UserDataModel = new UserDataModel();
  userRoleList: string[] = allUserRoleDescArray();
  userDeptList: string[] = allUserDeptDescArray();
  userStatusList: string[] = allUserStatusDescArray();
  selectedUserRoles: any;
  selectedUserDepts: any;
  selectedUserStatus: string = statusToUserStatusDesc(UserStatus.None);
  selectedHosData: HospitalModel = new HospitalModel();
  constructor(private thisService: UserInfoService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.UserChanger));
    const dlg = this.dialogService.getInstance(this.ref);
    this.userDataModel = dlg.data;
  }
  override async ngInit(): Promise<void> {
    if (this.haveRole) {
      await this.getUserData();
    }
  }

  async getUserData(): Promise<void> {
    const ret = await restTry(async() => await this.thisService.getData(this.userDataModel.thisPK, true, true),
      e => this.fDialogService.error("getUserData", e));
    if (ret.result) {
      this.userDataModel = ret.data ?? new UserDataModel();
      this.selectedUserStatus = statusToUserStatusDesc(ret.data?.status);
      this.selectedUserRoles = flagToRoleDesc(ret.data?.role);
      this.selectedUserDepts = flagToDeptDesc(ret.data?.dept);
      return;
    }
    this.fDialogService.warn("getUserData", ret.msg);
  }
  async saveUserData(): Promise<void> {
    this.userDataModel.role = userRoleToFlag(stringArrayToUserRole(this.selectedUserRoles));
    this.userDataModel.dept = userDeptToFlag(stringArrayToUserDept(this.selectedUserDepts));
    this.userDataModel.status = StatusDescToUserStatus[this.selectedUserStatus];
    this.setLoading();
    const ret = await restTry(async() => await this.thisService.putUser(this.userDataModel),
      e => this.fDialogService.error("saveUserData", e));
    this.setLoading(false);
    if (ret.result) {
      this.ref.close(ret.data);
      return;
    }
    this.fDialogService.warn("saveUserData", ret.msg);
  }
  closeThis(): void {
    this.ref.close();
  }

  get taxpayerImageUrl(): string {
    if (this.userDataModel.taxpayerImageUrl.length > 0) {
      return this.userDataModel.taxpayerImageUrl
    }

    return FConstants.ASSETS_NO_IMAGE;
  }
  taxpayerImageView(): void {
    if (this.userDataModel.taxpayerImageUrl.length <= 0) {
      this.taxpayerImageInput.nativeElement.click();
      return;
    }

    this.fDialogService.openImageView({
      closable: false,
      closeOnEscape: true,
      draggable: true,
      resizable: true,
      data: Array<string>(this.userDataModel.taxpayerImageUrl)
    });
  }
  async taxpayerImageSelected(event: any): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.setLoading();
      const file = input.files[0];
      const ext = await getFileExt(file);
      if (!isImage(ext)) {
        this.setLoading(false);
        this.fDialogService.warn("taxpayerImageView", "only image file");
        return;
      }
      const blobModel = this.thisService.getBlobModel(this.userDataModel.id, file, ext);
      const sasKey = await restTry(async() => await this.commonService.getGenerateSas(blobModel.blobName),
        e => this.fDialogService.error("taxpayerImageView", e));
      if (sasKey.result != true) {
        this.fDialogService.warn("taxpayerImageView", sasKey.msg);
        this.setLoading(false);
        return;
      }

      await tryCatchAsync(async() => await this.azureBlobService.putUpload(file, blobModel.blobName, sasKey.data ?? "", blobModel.mimeType),
        e => this.fDialogService.error("taxpayerImageView", e));
      const ret = await restTry(async() => await this.thisService.putUserTaxImageUrl(this.userDataModel.thisPK, blobModel),
          e => this.fDialogService.error("taxpayerImageView", e));
      this.taxpayerImageInput.nativeElement.value = "";
      this.setLoading(false);
      if (ret.result) {
        this.userDataModel.taxpayerImageUrl = ret.data?.taxpayerImageUrl ?? ""
        return;
      }
      this.fDialogService.warn("taxpayerImageView", ret.msg);
    }
  }
  get bankAccountImageUrl(): string {
    if (this.userDataModel.bankAccountImageUrl.length > 0) {
      return this.userDataModel.bankAccountImageUrl
    }

    return FConstants.ASSETS_NO_IMAGE;
  }
  bankAccountImageView(): void {
    if (this.userDataModel.bankAccountImageUrl.length <= 0) {
      this.bankAccountImageInput.nativeElement.click();
      return;
    }

    this.fDialogService.openImageView({
      closable: false,
      closeOnEscape: true,
      draggable: true,
      resizable: true,
      data: Array<string>(this.userDataModel.bankAccountImageUrl)
    });
  }
  async bankAccountImageSelected(event: any): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.setLoading();
      const file = input.files[0];
      const ext = await getFileExt(file);
      if (!isImage(ext)) {
        this.setLoading(false);
        this.fDialogService.warn("bankAccountImageView", "only image file");
        return;
      }
      const blobModel = this.thisService.getBlobModel(this.userDataModel.id, file, ext);
      const sasKey = await restTry(async() => await this.commonService.getGenerateSas(blobModel.blobName),
        e => this.fDialogService.error("bankAccountImageView", e));
      if (sasKey.result != true) {
        this.fDialogService.warn("bankAccountImageView", sasKey.msg);
        this.setLoading(false);
        return;
      }
      await tryCatchAsync(async() => await this.azureBlobService.putUpload(file, blobModel.blobName, sasKey.data ?? "", blobModel.mimeType),
          e => this.fDialogService.error("bankAccountImageView", e));
      const ret = await restTry(async() => await this.thisService.putUserBankImageUrl(this.userDataModel.thisPK, blobModel),
        e => this.fDialogService.error("bankAccountImageView", e));
      this.bankAccountImageInput.nativeElement.value = "";
      this.setLoading(false);
      if (ret.result) {
        this.userDataModel.bankAccountImageUrl = ret.data?.bankAccountImageUrl ?? ""
        return;
      }
      this.fDialogService.warn("bankAccountImageView", ret.msg);
    }
  }

  multipleEnable = input(true, { transform: (v: any) => transformToBoolean(v) });

  protected readonly stringToDate = stringToDate;
  protected readonly dateToYearFullString = dateToYearFullString;
}
