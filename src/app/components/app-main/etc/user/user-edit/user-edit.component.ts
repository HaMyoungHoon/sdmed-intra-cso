import {Component, ElementRef, input, ViewChild} from "@angular/core";
import {FComponentBase} from "../../../../../guards/f-component-base";
import {UserDataModel} from "../../../../../models/rest/user/user-data-model";
import {allUserRoleDescArray, flagToRoleDesc, UserRole} from "../../../../../models/rest/user/user-role";
import {allUserDeptDescArray, flagToDeptDesc} from "../../../../../models/rest/user/user-dept";
import {allUserStatusDescArray, statusToUserStatusDesc, UserStatus} from "../../../../../models/rest/user/user-status";
import {HospitalModel} from "../../../../../models/rest/hospital/hospital-model";
import {UserInfoService} from "../../../../../services/rest/user-info.service";
import * as FExtensions from "../../../../../guards/f-extensions";
import * as FConstants from "../../../../../guards/f-constants";
import {ActivatedRoute} from "@angular/router";
import {transformToBoolean} from "primeng/utils";
import * as FUserInfoMethod from "../../../../../guards/f-user-info-method";
import {allResponseTypeDescArray, ResponseTypeDescToResponseType, responseTypeToResponseTypeDesc} from "../../../../../models/rest/requst/response-type";
import {requestTypeToRequestTypeDesc} from "../../../../../models/rest/requst/request-type";
import {RequestModel} from "../../../../../models/rest/requst/request-model";
import {DashboardService} from "../../../../../services/rest/dashboard.service";
import {UserFileType} from "../../../../../models/rest/user/user-file-type";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: "app-user-edit",
  templateUrl: "./user-edit.component.html",
  styleUrl: "./user-edit.component.scss",
  standalone: false,
})
export class UserEditComponent extends FComponentBase {
  @ViewChild("taxpayerImageInput") taxpayerImageInput!: ElementRef<HTMLInputElement>
  @ViewChild("bankAccountImageInput") bankAccountImageInput!: ElementRef<HTMLInputElement>
  @ViewChild("csoReportImageInput") csoReportImageInput!: ElementRef<HTMLInputElement>
  @ViewChild("marketingContractImageInput") marketingContractImageInput!: ElementRef<HTMLInputElement>
  requestModel?: RequestModel;
  responseTypeList: string[] = allResponseTypeDescArray();
  selectedResponseType: string = responseTypeToResponseTypeDesc();
  childAble: UserDataModel[] = [];
  userDataModel: UserDataModel = new UserDataModel();
  userRoleList: string[] = allUserRoleDescArray();
  userDeptList: string[] = allUserDeptDescArray();
  userStatusList: string[] = allUserStatusDescArray();
  selectedUserRoles: string[] = [];
  selectedUserDepts: string[] = [];
  selectedUserStatus: string = statusToUserStatusDesc(UserStatus.None);
  selectedHosData: HospitalModel = new HospitalModel();
  constructor(private thisService: UserInfoService, private dashboardService: DashboardService, private route: ActivatedRoute) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.UserChanger));
    this.userDataModel.thisPK = this.route.snapshot.params["thisPK"];
  }
  override async ngInit(): Promise<void> {
    this.subscribeRouter();
  }
  subscribeRouter(): void {
    const sub = new Subject<any>();
    this.sub.push(sub);
    this.route.params.pipe(takeUntil(sub)).subscribe(async(x) => {
      this.userDataModel.thisPK = x["thisPK"];
      await this.refreshData();
    });
  }

  async refreshData(): Promise<void> {
    this.setLoading();
    await this.getRequestModel();
    await this.getUserData();
    await this.getChildAble();
    this.setLoading(false);
  }
  async getRequestModel(): Promise<void> {
    const ret = await FExtensions.restTry(async() => await this.dashboardService.getRequestData(this.userDataModel.thisPK),
      e => this.fDialogService.error("getRequestModel", e));
    if (ret.result) {
      this.requestModel = ret.data;
      this.selectedResponseType = responseTypeToResponseTypeDesc(this.requestModel?.responseType);
      return;
    }
    this.fDialogService.warn("getRequestModel", ret.msg);
  }
  async putRequestModelResponseData(data?: RequestModel): Promise<RequestModel | undefined> {
    if (data == null) {
      return data;
    }
    const ret = await FExtensions.restTry(async() => await this.dashboardService.putRequestModelResponseData(data),
      e => this.fDialogService.error("putRequestModelResponseData", e));
    if (ret.result) {
      return ret.data ?? data;
    }
    this.fDialogService.warn("putRequestModelResponseData", ret.msg);
    return undefined;
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

  async requestItemResponseTypeChange(): Promise<void> {
    const responseType = ResponseTypeDescToResponseType[this.selectedResponseType];
    if (this.requestModel == null) {
      return;
    }
    if (this.requestModel.responseType == responseType) {
      return;
    }
    this.requestModel.responseType = responseType;
    const buff = await this.putRequestModelResponseData(this.requestModel);
    if (buff == undefined) {
      return;
    }
    this.requestModel = buff;
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
  async passwordInit(event: Event): Promise<void> {
    this.translateService.get(["user-edit.password-init", "user-edit.password-init-sure", "common-desc.cancel", "common-desc.confirm"]).subscribe(x => {
      this.confirmCall(event, x["user-edit.password-init"], x["user-edit.password-init-sure"], x["common-desc.cancel"], x["common-desc.confirm"], async() => {
        this.setLoading();
        const ret = await FExtensions.restTry(async() => await this.thisService.putPasswordInit(this.userDataModel.thisPK),
          e => this.fDialogService.error("password init"));
        this.setLoading(false);
        if (ret.result) {
          this.fDialogService.info("password init", ret.data);
          return;
        }
        this.fDialogService.warn("password init", ret.msg);
      });
    });
  }
  async saveUserChildData(): Promise<void> {
    const ret = await FExtensions.restTry(async() => await this.thisService.postChildModify(this.userDataModel.thisPK, this.userDataModel.children.map(x => x.thisPK)),
      e => this.fDialogService.error("saveUserChildData", e));
    this.setLoading(false);
    if (ret.result) {
      return;
    }
    this.fDialogService.warn("saveUserData", ret.msg);
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
  accordionValue: string | number | string[] | number[] = ["0", "1", "2"];
  get filterFields(): string[] {
    return ["id", "name"];
  }
  get filterPlaceHolder(): string {
    return "user-edit.user-pick-list.filter-place-holder";
  }
  get isAdmin(): boolean {
    return ((this.myRole & UserRole.Admin.valueOf()) != 0) || ((this.myRole & UserRole.CsoAdmin.valueOf()) != 0)
  }

  protected readonly stringToDate = FExtensions.stringToDate;
  protected readonly dateToYearFullString = FExtensions.dateToYearFullString;
	protected readonly responseTypeToResponseTypeDesc = responseTypeToResponseTypeDesc;
	protected readonly requestTypeToRequestTypeDesc = requestTypeToRequestTypeDesc;
  protected readonly dateToYYYYMMdd = FExtensions.dateToYYYYMMdd;
  protected readonly UserFileType = UserFileType;
}
