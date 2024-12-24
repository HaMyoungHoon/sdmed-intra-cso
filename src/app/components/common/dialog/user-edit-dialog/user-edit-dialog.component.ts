import {Component, ElementRef, input, ViewChild} from "@angular/core";
import {UserDataModel} from "../../../../models/rest/user/user-data-model";
import * as FExtensions from "../../../../guards/f-extensions";
import {allUserRoleDescArray, flagToRoleDesc, UserRole} from "../../../../models/rest/user/user-role";
import {allUserStatusDescArray, statusToUserStatusDesc, UserStatus,} from "../../../../models/rest/user/user-status";
import {allUserDeptDescArray, flagToDeptDesc} from "../../../../models/rest/user/user-dept";
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
import {CustomPickListComponent} from "../../custom-pick-list/custom-pick-list.component";
import * as FUserInfoMethod from "../../../../guards/f-user-info-method";

@Component({
  selector: "app-user-edit-dialog",
  imports: [AccordionModule, NgIf, TagModule, TranslatePipe, FormsModule, MultiSelectModule, ButtonModule, TableModule, ImageModule, InputTextModule, ProgressSpinComponent, Tooltip, Select, CustomPickListComponent],
  templateUrl: "./user-edit-dialog.component.html",
  styleUrl: "./user-edit-dialog.component.scss",
  standalone: true,
})
export class UserEditDialogComponent extends FDialogComponentBase {
  @ViewChild("taxpayerImageInput") taxpayerImageInput!: ElementRef<HTMLInputElement>
  @ViewChild("bankAccountImageInput") bankAccountImageInput!: ElementRef<HTMLInputElement>
  childAble: UserDataModel[] = [];
  userDataModel: UserDataModel = new UserDataModel();
  userRoleList: string[] = allUserRoleDescArray();
  userDeptList: string[] = allUserDeptDescArray();
  userStatusList: string[] = allUserStatusDescArray();
  selectedUserRoles: string[] = [];
  selectedUserDepts: string[] = [];
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
      await this.getChildAble();
    }
  }

  async getUserData(): Promise<void> {
    const ret = await FExtensions.restTry(async() => await this.thisService.getData(this.userDataModel.thisPK, true, true),
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
  async getChildAble(): Promise<void> {
    const ret = await FExtensions.restTry(async() => await this.thisService.getListChildAble(this.userDataModel.thisPK),
      e => this.fDialogService.error("getChildAble", e));
    if (ret.result) {
      this.childAble = ret.data ?? [];
      return;
    }
    this.fDialogService.warn("getChildAble", ret.msg);
  }
  async saveUserData(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await FUserInfoMethod.saveUserData(this.userDataModel, this.selectedUserRoles, this.selectedUserDepts, this.selectedUserStatus, this.thisService),
      e => this.fDialogService.error("saveUserData", e));
    this.setLoading(false);
    if (ret.result) {
      this.userDataModel = ret.data ?? new UserDataModel();
      return;
    }
    this.fDialogService.warn("saveUserData", ret.msg);
  }
  async saveUserChildData(): Promise<void> {
    const ret = await FExtensions.restTry(async() => await this.thisService.postChildModify(this.userDataModel.thisPK, this.userDataModel.children.map(x => x.thisPK)),
      e => this.fDialogService.error("saveUserChildData", e));
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
    FUserInfoMethod.userImageView(this.userDataModel.taxpayerImageUrl, this.taxpayerImageInput, this.fDialogService);
  }
  async taxpayerImageSelected(event: any): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await FUserInfoMethod.taxpayerImageSelected(event, this.userDataModel, this.thisService, this.commonService, this.azureBlobService),
      e => this.fDialogService.error("taxpayerImageSelected", e));
    this.setLoading(false);
    this.taxpayerImageInput.nativeElement.value = "";
    if (ret.result) {
      this.userDataModel.taxpayerImageUrl = ret.data?.taxpayerImageUrl ?? ""
      return;
    }
    this.fDialogService.warn("taxpayerImageSelected", ret.msg);
  }
  get bankAccountImageUrl(): string {
    if (this.userDataModel.bankAccountImageUrl.length > 0) {
      return this.userDataModel.bankAccountImageUrl
    }

    return FConstants.ASSETS_NO_IMAGE;
  }
  bankAccountImageView(): void {
    FUserInfoMethod.userImageView(this.userDataModel.bankAccountImageUrl, this.bankAccountImageInput, this.fDialogService);
  }
  async bankAccountImageSelected(event: any): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await FUserInfoMethod.bankAccountImageSelected(event, this.userDataModel, this.thisService, this.commonService, this.azureBlobService),
      e => this.fDialogService.error("bankAccountImageSelected", e));
    this.setLoading(false);
    this.bankAccountImageInput.nativeElement.value = "";
    if (ret.result) {
      this.userDataModel.bankAccountImageUrl = ret.data?.bankAccountImageUrl ?? ""
      return;
    }
    this.fDialogService.warn("bankAccountImageView", ret.msg);
  }

  multipleEnable = input(true, { transform: (v: any) => transformToBoolean(v) });

  protected readonly stringToDate = FExtensions.stringToDate;
  protected readonly dateToYearFullString = FExtensions.dateToYearFullString;
}
