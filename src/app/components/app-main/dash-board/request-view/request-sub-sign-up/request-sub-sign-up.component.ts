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
import {Divider} from "primeng/divider";
import {DatePicker} from "primeng/datepicker";
import {Popover} from "primeng/popover";
import {UserTrainingFileAddComponent} from "../../../../common/user-training-file-add/user-training-file-add.component";
import {UserTrainingModel} from "../../../../../models/rest/user/user-training-model";
import {UploadFileBuffModel} from "../../../../../models/common/upload-file-buff-model";

@Component({
  selector: "app-request-sub-sign-up",
    imports: [NgIf, Accordion, AccordionContent, AccordionHeader, AccordionPanel, Button, CustomPickListComponent, FormsModule, Image, InputText, MultiSelect, ProgressSpinComponent, Select, TableModule, Tooltip, TranslatePipe, IftaLabel, Divider, DatePicker, Popover, UserTrainingFileAddComponent],
  templateUrl: "./request-sub-sign-up.component.html",
  styleUrl: "./request-sub-sign-up.component.scss",
  standalone: true,
})
export class RequestSubSignUpComponent extends FComponentBase {
  @ViewChild("userTrainingFileAdd") userTrainingFileAdd!: UserTrainingFileAddComponent;
  @Input() requestModel?: RequestModel
  @Output() closeEvent: EventEmitter<RequestModel> = new EventEmitter();
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
  csoReportDate?: Date;
  contractDate?: Date;
  constructor(private thisService: UserInfoService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.UserChanger));
  }

  override async ngInit(): Promise<void> {
    await this.getThisData();
    await this.getChildAble();
  }
  onError(data: {title: string, msg?: string}): void {
    this.fDialogService.error(data.title, data.msg);
  }
  onWarn(data: {title: string, msg?: string}): void {
    this.fDialogService.warn(data.title, data.msg);
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
      if (this.userDataModel.contractDate) {
        this.contractDate = this.userDataModel.contractDate;
      }
      if (this.userDataModel.csoReportDate) {
        this.csoReportDate = this.userDataModel.csoReportDate;
      }
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
    if (this.contractDate) {
      this.userDataModel.contractDate = this.contractDate;
    }
    if (this.csoReportDate) {
      this.userDataModel.csoReportDate = this.csoReportDate;
    }
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
  trainingImageUrl(): string {
    const file = this.userDataModel.trainingList;
    if (file.length > 0) {
      return FExtensions.blobUrlThumbnail(file[0].blobUrl, file[0].mimeType);
    }
    return FConstants.ASSETS_NO_IMAGE;
  }
  trainingDate(): string {
    const file = this.userDataModel.trainingList;
    if (file.length <= 0) {
      return "";
    }
    return FExtensions.dateToYYYYMMdd(file[0].trainingDate);
  }
  trainingImageTooltip(): string {
    return "user-edit.detail.training-image";
  }
  trainingImageView(): void {
    const file = this.userDataModel.trainingList;
    if (file.length <= 0) {
      return;
    }
    FUserInfoMethod.userTrainingImageView(file, this.fDialogService);
  }
  viewUserTrainingItem(item: UserTrainingModel): void {
    this.fDialogService.openFullscreenFileView({
      closable: false,
      closeOnEscape: true,
      maximizable: true,
      width: "100%",
      height: "100%",
      data: {
        file: FExtensions.userTrainingListToViewModel(this.userDataModel.trainingList),
        index: this.userDataModel.trainingList.findIndex(x => x.thisPK == item.thisPK)
      }
    });
  }
  async userTrainingUpload(data: {file: UploadFileBuffModel, date: Date}): Promise<void> {
    const file = data.file.file;
    if (file == undefined) {
      return;
    }
    this.setLoading();
    const blobName = FExtensions.getUserBlobName(this.userDataModel.id, data.file.ext);
    const blobStorageInfo = await FExtensions.restTry(async() => await this.commonService.getGenerateSas(blobName),
      e => this.fDialogService.error("upload", e));
    if (blobStorageInfo.result != true || blobStorageInfo.data == undefined) {
      this.setLoading(false);
      this.fDialogService.error("upload", blobStorageInfo.msg);
      return;
    }
    const blobModel = FExtensions.getUserBlobModel(file, blobStorageInfo.data, blobName, data.file.ext);
    let uploadRet = true;
    const azureRet = await FExtensions.tryCatchAsync(async() => await this.azureBlobService.putUpload(file, blobStorageInfo.data, blobModel.blobName, blobModel.mimeType),
      e => {
        this.fDialogService.error("upload", e);
        uploadRet = false;
      });
    if (azureRet == null || !uploadRet) {
      this.setLoading(false);
      return;
    }
    const ret = await FExtensions.restTry(async() => await this.thisService.postUserTrainingData(this.userDataModel.thisPK, blobModel, FExtensions.dateToYYYYMMdd(data.date)),
      e => this.fDialogService.error("upload", e));
    this.setLoading(false);
    if (ret.result) {
      if (ret.data) {
        this.userDataModel.trainingList.unshift(ret.data);
        await this.userTrainingFileAdd.readyImage();
      }
      return;
    }
    this.fDialogService.warn("upload", ret.msg);
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
