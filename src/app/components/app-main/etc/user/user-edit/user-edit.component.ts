import {Component, ElementRef, ViewChild} from "@angular/core";
import {FComponentBase} from "../../../../../guards/f-component-base";
import {UserDataModel} from "../../../../../models/rest/user-data-model";
import {allUserRoleDescArray, flagToRoleDesc, stringArrayToUserRole, UserRole} from "../../../../../models/rest/user-role";
import {allUserDeptDescArray, flagToDeptDesc, stringArrayToUserDept} from "../../../../../models/rest/user-dept";
import {allUserStatusDescArray, StatusDescToUserStatus, statusToUserStatusDesc, UserStatus} from "../../../../../models/rest/user-status";
import {HospitalModel} from "../../../../../models/rest/hospital-model";
import {UserInfoService} from "../../../../../services/rest/user-info.service";
import {getFileExt, isImage, restTry, tryCatchAsync, stringToDate, dateToYearFullString} from "../../../../../guards/f-extensions";
import * as FConstants from "../../../../../guards/f-constants";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: "app-user-edit",
  templateUrl: "./user-edit.component.html",
  styleUrl: "./user-edit.component.scss",
  standalone: false,
})
export class UserEditComponent extends FComponentBase {
  @ViewChild("taxpayerImageInput") taxpayerImageInput!: ElementRef<HTMLInputElement>
  @ViewChild("bankAccountImageInput") bankAccountImageInput!: ElementRef<HTMLInputElement>
  userDataModel: UserDataModel = new UserDataModel();
  userRoleList: string[] = allUserRoleDescArray();
  userDeptList: string[] = allUserDeptDescArray();
  userStatusList: string[] = allUserStatusDescArray();
  selectedUserRoles: string[] = [];
  selectedUserDepts: string[] = [];
  selectedUserStatus: string = statusToUserStatusDesc(UserStatus.None);
  selectedHosData: HospitalModel = new HospitalModel();
  constructor(private thisService: UserInfoService, private route: ActivatedRoute) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.UserChanger));
    this.userDataModel.thisPK = this.route.snapshot.params["thisPK"];
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
    const name = this.userDataModel?.name ?? "";
    const mail = this.userDataModel?.mail ?? "";
    const phoneNumber = this.userDataModel?.phoneNumber ?? "";
    const roles = stringArrayToUserRole(this.selectedUserRoles);
    const depts = stringArrayToUserDept(this.selectedUserDepts);
    const status = StatusDescToUserStatus[this.selectedUserStatus];
    this.setLoading();
    // 솔직히 한 방에 해도 되는데 쫌 귀찮쓰
    const ret1 = await restTry(async() => await this.thisService.putUserNameMailPhoneModifyByPK(this.userDataModel.thisPK, name, mail, phoneNumber),
      e => this.fDialogService.error("saveUserData", e));
    if (ret1.result) {
      const ret2 = await restTry(async() => await this.thisService.putUserRoleDeptStatusModifyByPK(this.userDataModel.thisPK, roles, depts, status),
        e => this.fDialogService.error("saveUserData", e));
      this.setLoading(false);
      if (ret2.result) {
        return;
      }
      this.fDialogService.warn("saveUserData", ret2.msg);
      return;
    }
    this.setLoading(false);
    this.fDialogService.warn("saveUserData", ret1.msg);
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

  protected readonly stringToDate = stringToDate;
  protected readonly dateToYearFullString = dateToYearFullString;
}
