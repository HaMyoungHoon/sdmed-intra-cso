import {Component, ElementRef, ViewChild} from "@angular/core";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {UserService} from "../../../services/rest/user.service";
import {UserDataModel} from "../../../models/rest/user-data-model";
import {FDialogService} from "../../../services/common/f-dialog.service";
import {dateToYearFullString, restTry, stringToDate} from "../../../guards/f-extensions";
import {allUserRoleDescArray, flagToRoleDesc, stringArrayToUserRole, UserRole} from "../../../models/rest/user-role";
import {allUserStatusDescArray, StatusDescToUserStatus, statusToUserStatusDesc, UserStatus,} from "../../../models/rest/user-status";
import {allUserDeptDescArray, flagToDeptDesc, stringArrayToUserDept} from "../../../models/rest/user-dept";
import {AccordionModule} from "primeng/accordion";
import {NgIf} from "@angular/common";
import {TagModule} from "primeng/tag";
import {TranslatePipe} from "@ngx-translate/core";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {MultiSelectModule} from "primeng/multiselect";
import {Button} from "primeng/button";
import {TableModule} from "primeng/table";
import {HospitalModel} from "../../../models/rest/hospital-model";
import {ImageModule} from "primeng/image";
import * as FConstants from "../../../guards/f-constants";
import {InputTextModule} from "primeng/inputtext";
import {ProgressSpinComponent} from '../progress-spin/progress-spin.component';
import {FDialogComponentBase} from '../../../guards/f-dialog-component-base';

@Component({
  selector: "app-user-edit-dialog",
  imports: [AccordionModule, NgIf, TagModule, TranslatePipe, DropdownModule, FormsModule, MultiSelectModule, Button, TableModule, ImageModule, InputTextModule, ProgressSpinComponent],
  templateUrl: "./user-edit-dialog.component.html",
  styleUrl: "./user-edit-dialog.component.scss",
  standalone: true,
})
export class UserEditDialogComponent extends FDialogComponentBase {
  @ViewChild("taxpayerImageInput") taxpayerImageInput!: ElementRef<HTMLInputElement>
  @ViewChild("bankAccountImageInput") bankAccountImageInput!: ElementRef<HTMLInputElement>
  name: string = "";
  mail: string = "";
  phoneNumber: string = "";
  userDataModel?: UserDataModel;
  userRoleList: string[] = [];
  userDeptList: string[] = [];
  userStatusList: string[] = [];
  selectedUserRoles: any;
  selectedUserDepts: any;
  selectedUserStatus: string = statusToUserStatusDesc(UserStatus.None);
  selectedHosData?: HospitalModel
  constructor(override ref: DynamicDialogRef, override dialogService: DialogService, override userService: UserService, override fDialogService: FDialogService) {
    super(ref, dialogService, userService, fDialogService, Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.UserChanger));
    this.initLayoutData();
    const dlg = this.dialogService.getInstance(ref);
    this.userDataModel = dlg.data;
  }
  override async ngInit(): Promise<void> {
    if (this.haveRole) {
      await this.getUserData();
    }
  }

  initLayoutData(): void {
    this.userRoleList = allUserRoleDescArray();
    this.userDeptList = allUserDeptDescArray();
    this.userStatusList = allUserStatusDescArray();
  }
  async getUserData(): Promise<void> {
    const data = this.userDataModel;
    if (data == null) {
      return;
    }
    const ret = await restTry(async() => await this.userService.getUserDataByPK(data.thisPK, true, true),
      e => this.fDialogService.error("getUserData", e.message));
    if (ret.result) {
      this.userDataModel = ret.data;
      this.name = this.userDataModel?.name ?? "";
      this.mail = this.userDataModel?.mail ?? "";
      this.selectedUserStatus = statusToUserStatusDesc(ret.data?.status);
      this.selectedUserRoles = flagToRoleDesc(ret.data?.role);
      this.selectedUserDepts = flagToDeptDesc(ret.data?.dept);
      return;
    }
    this.fDialogService.warn("getUserData", ret.msg);
  }
  async saveUserData(): Promise<void> {
    const buff = this.userDataModel
    if (buff == null) {
      return;
    }

    const roles = stringArrayToUserRole(this.selectedUserRoles);
    const depts = stringArrayToUserDept(this.selectedUserDepts);
    const status = StatusDescToUserStatus[this.selectedUserStatus];
    this.setLoading();
    // 솔직히 한 방에 해도 되는데 쫌 귀찮쓰
    const ret1 = await restTry(async() => await this.userService.putUserNameMailPhoneModifyByPK(buff.thisPK, this.name, this.mail, this.phoneNumber),
        e => this.fDialogService.error("saveUserData", e.message));
    if (ret1.result) {
      const ret2 = await restTry(async() => await this.userService.putUserRoleDeptStatusModifyByPK(buff.thisPK, roles, depts, status),
        e => this.fDialogService.error("saveUserData", e.message));
      this.setLoading(false);
      if (ret2.result) {
        this.ref.close(ret2.data);
        return;
      }
      this.fDialogService.warn("saveUserData", ret2.msg);
      return;
    }
    this.setLoading(false);
    this.fDialogService.warn("saveUserData", ret1.msg);
  }
  closeThis(): void {
    this.ref.close(this.userDataModel);
  }

  get taxpayerImageUrl(): string {
    if (this.userDataModel?.taxpayerImageUrl?.length ?? 0 > 0) {
      return this.userDataModel!!.taxpayerImageUrl
    }

    return FConstants.ASSETS_NO_IMAGE;
  }
  taxpayerImageView(): void {
    const buff = this.userDataModel;
    if (buff == null) {
      return;
    }

    if (buff.taxpayerImageUrl.length <= 0) {
      this.taxpayerImageInput.nativeElement.click();
      return;
    }

    this.fDialogService.openImageView({
      closable: false,
      closeOnEscape: true,
      draggable: true,
      resizable: true,
      data: buff.taxpayerImageUrl
    });
  }
  async taxpayerImageSelected(event: any): Promise<void> {
    const buff = this.userDataModel;
    if (buff == null) {
      return;
    }
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.setLoading();
      const ret = await restTry(async() => await this.userService.putUserTaxImageUploadByPK(buff.thisPK, file),
        e => this.fDialogService.error("taxpayerImageView", e.message));
      this.setLoading(false);
      if (ret.result) {
        this.userDataModel!!.taxpayerImageUrl = ret.data?.taxpayerImageUrl ?? ""
        return;
      }

      this.fDialogService.warn("taxpayerImageView", ret.msg);
    }
  }
  get bankAccountImageUrl(): string {
    if (this.userDataModel?.bankAccountImageUrl?.length ?? 0 > 0) {
      return this.userDataModel!!.bankAccountImageUrl
    }

    return FConstants.ASSETS_NO_IMAGE;
  }
  bankAccountImageView(): void {
    const buff = this.userDataModel;
    if (buff == null) {
      return;
    }

    if (buff.bankAccountImageUrl.length <= 0) {
      this.bankAccountImageInput.nativeElement.click();
      return;
    }

    this.fDialogService.openImageView({
      closable: false,
      closeOnEscape: true,
      draggable: true,
      resizable: true,
      data: buff.bankAccountImageUrl
    });
  }
  async bankAccountImageSelected(event: any): Promise<void> {
    const buff = this.userDataModel;
    if (buff == null) {
      return;
    }
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.setLoading();
      const ret = await restTry(async() => await this.userService.putUserBankImageUploadByPK(buff.thisPK, file),
        e => this.fDialogService.error("bankAccountImageView", e.message));
    this.setLoading(false);
    if (ret.result) {
      this.userDataModel!!.bankAccountImageUrl = ret.data?.bankAccountImageUrl ?? ""
      return;
    }

    this.fDialogService.warn("bankAccountImageView", ret.msg);
    }
  }

  hosListSelection(): void {

  }

  protected readonly stringToDate = stringToDate;
  protected readonly dateToYearFullString = dateToYearFullString;
}
