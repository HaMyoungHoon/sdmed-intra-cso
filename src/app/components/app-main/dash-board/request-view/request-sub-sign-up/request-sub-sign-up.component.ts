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
import {UserFileType} from "../../../../../models/rest/user/user-file-type";
import {IftaLabel} from "primeng/iftalabel";

@Component({
  selector: "app-request-sub-sign-up",
  imports: [NgIf, Accordion, AccordionContent, AccordionHeader, AccordionPanel, Button, CustomPickListComponent, FormsModule, Image, InputText, MultiSelect, ProgressSpinComponent, Select, TableModule, Tooltip, TranslatePipe, IftaLabel],
  templateUrl: "./request-sub-sign-up.component.html",
  styleUrl: "./request-sub-sign-up.component.scss",
  standalone: true,
})
export class RequestSubSignUpComponent extends FComponentBase {
  @Input() requestModel?: RequestModel
  @Output() closeEvent: EventEmitter<RequestModel> = new EventEmitter<RequestModel>();
  @ViewChild("taxpayerImageInput") taxpayerImageInput!: ElementRef<HTMLInputElement>
  @ViewChild("bankAccountImageInput") bankAccountImageInput!: ElementRef<HTMLInputElement>
  @ViewChild("csoReportImageInput") csoReportImageInput!: ElementRef<HTMLInputElement>
  @ViewChild("marketingContractImageInput") marketingContractImageInput!: ElementRef<HTMLInputElement>
  childAble: UserDataModel[] = [];
  userDataModel: UserDataModel = new UserDataModel();
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
    await this.getThisData();
    await this.getChildAble();
  }

  async getThisData(): Promise<void> {
    const buff = this.requestModel;
    if (buff == undefined) {
      return;
    }
    const ret = await FExtensions.restTry(async() => await this.thisService.getData(buff.requestItemPK, true),
      e => this.fDialogService.error("getThisData", e));
    if (ret.result) {
      this.userDataModel = ret.data ?? new UserDataModel();
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
    const ret = await FExtensions.restTry(async() => await FUserInfoMethod.saveUserData(this.userDataModel, this.selectedUserRoles, this.selectedUserDepts, this.selectedUserStatus, this.thisService),
      e => this.fDialogService.error("saveUserData", e));
    this.setLoading(false);
    if (ret.result) {
      this.userDataModel = ret.data ?? new UserDataModel();
      return;
    }
    this.fDialogService.warn("saveUserData", ret.msg);
  }
  closeThis(): void {
    this.closeEvent.emit(this.requestModel);
  }

  userImageUrl(userFileType: UserFileType): string {
    const file = this.userDataModel.fileList.find(x => x.userFileType == userFileType);
    if (file) {
      return FExtensions.blobUrlThumbnail(file.blobUrl, file.mimeType);
    }

    return FConstants.ASSETS_NO_IMAGE;
  }
  userImageTooltip(userFileType: UserFileType): string {
    switch (userFileType) {
      case UserFileType.Taxpayer: return "user-edit.detail.taxpayer-image";
      case UserFileType.BankAccount: return "user-edit.detail.bank-account-image";
      case UserFileType.CsoReport: return "user-edit.detail.cso-report-image";
      case UserFileType.MarketingContract: return "user-edit.detail.marketing-contract-image";
    }
    return "";
  }
  userImageView(userFileType: UserFileType): void {
    const file = this.userDataModel.fileList.find(x => x.userFileType == userFileType);
    let input: ElementRef<HTMLInputElement>;
    switch (userFileType) {
      case UserFileType.Taxpayer: input = this.taxpayerImageInput; break;
      case UserFileType.BankAccount: input = this.bankAccountImageInput; break;
      case UserFileType.CsoReport: input = this.csoReportImageInput; break;
      case UserFileType.MarketingContract: input = this.marketingContractImageInput; break;
      default: return;
    }
    FUserInfoMethod.userImageView(file, input, this.fDialogService);
  }
  async userImageSelected(event: any, userFileType: UserFileType): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await FUserInfoMethod.imageSelected(event, this.userDataModel, userFileType, this.thisService, this.commonService, this.azureBlobService),
      e => this.fDialogService.error(`${userFileType}`, e));
    this.setLoading(false);
    switch (userFileType) {
      case UserFileType.Taxpayer: this.taxpayerImageInput.nativeElement.value = ""; break;
      case UserFileType.BankAccount: this.bankAccountImageInput.nativeElement.value = ""; break;
      case UserFileType.CsoReport: this.csoReportImageInput.nativeElement.value = ""; break;
      case UserFileType.MarketingContract: this.marketingContractImageInput.nativeElement.value = ""; break;
    }
    if (ret.result) {
      if (ret.data) {
        this.userDataModel.fileList.push(ret.data)
      }
      return;
    }
    this.fDialogService.warn(`${userFileType}`, ret.msg);
  }

  multipleEnable = input(true, { transform: (v: any) => transformToBoolean(v) });
  accordionValue = ["0", "1"];

  get filterFields(): string[] {
    return ["id", "name"];
  }
  get filterPlaceHolder(): string {
    return "user-edit.user-pick-list.filter-place-holder";
  }

  protected readonly stringToDate = FExtensions.stringToDate;
  protected readonly dateToYearFullString = FExtensions.dateToYearFullString;
  protected readonly UserFileType = UserFileType;
}
