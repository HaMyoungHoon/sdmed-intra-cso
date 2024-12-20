import {Component, ElementRef, EventEmitter, input, Input, Output, ViewChild} from "@angular/core";
import {RequestModel} from "../../../../../models/rest/requst/request-model";
import {allUserRoleDescArray, flagToRoleDesc, UserRole} from "../../../../../models/rest/user/user-role";
import {FComponentBase} from "../../../../../guards/f-component-base";
import {UserDataModel} from "../../../../../models/rest/user/user-data-model";
import {NgIf} from "@angular/common";
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from "primeng/accordion";
import {Button} from "primeng/button";
import {CustomPickListComponent} from "../../../../common/custom-pick-list/custom-pick-list.component";
import {FormsModule} from "@angular/forms";
import {Image} from "primeng/image";
import {InputText} from "primeng/inputtext";
import {MultiSelect} from "primeng/multiselect";
import {ProgressSpinComponent} from "../../../../common/progress-spin/progress-spin.component";
import {Select} from "primeng/select";
import {TableModule} from "primeng/table";
import {Tooltip} from "primeng/tooltip";
import {TranslatePipe} from "@ngx-translate/core";
import {allUserDeptDescArray, flagToDeptDesc} from "../../../../../models/rest/user/user-dept";
import {allUserStatusDescArray, statusToUserStatusDesc, UserStatus} from "../../../../../models/rest/user/user-status";
import {UserInfoService} from "../../../../../services/rest/user-info.service";
import * as FConstants from "../../../../../guards/f-constants";
import * as FUserInfoMethod from "../../../../../guards/f-user-info-method";
import * as FExtensions from "../../../../../guards/f-extensions";
import {transformToBoolean} from "primeng/utils";

@Component({
  selector: "app-request-sub-sign-up",
  imports: [NgIf, Accordion, AccordionContent, AccordionHeader, AccordionPanel, Button, CustomPickListComponent, FormsModule, Image, InputText, MultiSelect, ProgressSpinComponent, Select, TableModule, Tooltip, TranslatePipe],
  templateUrl: "./request-sub-sign-up.component.html",
  styleUrl: "./request-sub-sign-up.component.scss",
  standalone: true,
})
export class RequestSubSignUpComponent extends FComponentBase {
  @Input() requestModel?: RequestModel
  @Output() closeEvent: EventEmitter<RequestModel> = new EventEmitter<RequestModel>();
  @ViewChild("taxpayerImageInput") taxpayerImageInput!: ElementRef<HTMLInputElement>
  @ViewChild("bankAccountImageInput") bankAccountImageInput!: ElementRef<HTMLInputElement>
  childAble: UserDataModel[] = [];
  thisData: UserDataModel = new UserDataModel();
  userRoleList: string[] = allUserRoleDescArray();
  userDeptList: string[] = allUserDeptDescArray();
  userStatusList: string[] = allUserStatusDescArray();
  selectedUserRoles: string[] = [];
  selectedUserDepts: string[] = [];
  selectedUserStatus: string = statusToUserStatusDesc(UserStatus.None);
  constructor(private thisService: UserInfoService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.UserChanger));
  }

  override async ngInit(): Promise<void> {
    if (this.haveRole) {
      await this.getThisData();
      await this.getChildAble();
    }
  }

  async getThisData(): Promise<void> {
    const buff = this.requestModel;
    if (buff == undefined) {
      return;
    }
    const ret = await FExtensions.restTry(async() => await this.thisService.getData(buff.requestItemPK),
      e => this.fDialogService.error("getThisData", e));
    if (ret.result) {
      this.thisData = ret.data ?? new UserDataModel();
      this.selectedUserStatus = statusToUserStatusDesc(ret.data?.status);
      this.selectedUserRoles = flagToRoleDesc(ret.data?.role);
      this.selectedUserDepts = flagToDeptDesc(ret.data?.dept);
      return;
    }
    this.fDialogService.warn("getThisData", ret.msg);
  }
  async getChildAble(): Promise<void> {
    const buff = this.requestModel;
    if (buff == undefined) {
      return;
    }

    const ret = await FExtensions.restTry(async() => await this.thisService.getListChildAble(buff.requestItemPK),
      e => this.fDialogService.error("getChildAble", e));
    if (ret.result) {
      this.childAble = ret.data ?? [];
      return;
    }
    this.fDialogService.warn("getChildAble", ret.msg);
  }
  async saveUserData(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await FUserInfoMethod.saveUserData(this.thisData, this.selectedUserRoles, this.selectedUserDepts, this.selectedUserStatus, this.thisService),
      e => this.fDialogService.error("saveUserData", e));
    this.setLoading(false);
    if (ret.result) {
      this.thisData = ret.data ?? new UserDataModel();
      return;
    }
    this.fDialogService.warn("saveUserData", ret.msg);
  }
  closeThis(): void {
    this.closeEvent.emit(this.requestModel);
  }

  get taxpayerImageUrl(): string {
    if (this.thisData.taxpayerImageUrl.length > 0) {
      return this.thisData.taxpayerImageUrl
    }

    return FConstants.ASSETS_NO_IMAGE;
  }
  taxpayerImageView(): void {
    FUserInfoMethod.userImageView(this.thisData.taxpayerImageUrl, this.taxpayerImageInput, this.fDialogService);
  }
  async taxpayerImageSelected(event: any): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await FUserInfoMethod.taxpayerImageSelected(event, this.thisData, this.thisService, this.commonService, this.azureBlobService),
      e => this.fDialogService.error("taxpayerImageSelected", e));
    this.setLoading(false);
    this.taxpayerImageInput.nativeElement.value = "";
    if (ret.result) {
      this.thisData.taxpayerImageUrl = ret.data?.taxpayerImageUrl ?? ""
      return;
    }
    this.fDialogService.warn("taxpayerImageSelected", ret.msg);
  }
  get bankAccountImageUrl(): string {
    if (this.thisData.bankAccountImageUrl.length > 0) {
      return this.thisData.bankAccountImageUrl
    }

    return FConstants.ASSETS_NO_IMAGE;
  }
  bankAccountImageView(): void {
    FUserInfoMethod.userImageView(this.thisData.bankAccountImageUrl, this.bankAccountImageInput, this.fDialogService);
  }
  async bankAccountImageSelected(event: any): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await FUserInfoMethod.bankAccountImageSelected(event, this.thisData, this.thisService, this.commonService, this.azureBlobService),
      e => this.fDialogService.error("bankAccountImageSelected", e));
    this.setLoading(false);
    this.bankAccountImageInput.nativeElement.value = "";
    if (ret.result) {
      this.thisData.bankAccountImageUrl = ret.data?.bankAccountImageUrl ?? ""
      return;
    }
    this.fDialogService.warn("bankAccountImageView", ret.msg);
  }

  multipleEnable = input(true, { transform: (v: any) => transformToBoolean(v) });

  protected readonly stringToDate = FExtensions.stringToDate;
  protected readonly dateToYearFullString = FExtensions.dateToYearFullString;
}
