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

@Component({
  selector: "app-user-edit",
  templateUrl: "./user-edit.component.html",
  styleUrl: "./user-edit.component.scss",
  standalone: false,
})
export class UserEditComponent extends FComponentBase {
  @ViewChild("taxpayerImageInput") taxpayerImageInput!: ElementRef<HTMLInputElement>
  @ViewChild("bankAccountImageInput") bankAccountImageInput!: ElementRef<HTMLInputElement>
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
  async saveUserChildData(): Promise<void> {
    const ret = await FExtensions.restTry(async() => await this.thisService.postChildModify(this.userDataModel.thisPK, this.userDataModel.children.map(x => x.thisPK)),
      e => this.fDialogService.error("saveUserChildData", e));
    this.setLoading(false);
    if (ret.result) {
      return;
    }
    this.fDialogService.warn("saveUserData", ret.msg);
  }

  get taxpayerImageUrl(): string {
    if (this.userDataModel.taxpayerImageUrl.length > 0) {
      return this.userDataModel.taxpayerImageUrl
    }

    return FConstants.ASSETS_NO_IMAGE;
  }
  get taxpayerTooltip(): string {
    return "user-edit.detail.taxpayer-image";
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
  get bankAccountTooltip(): string {
    return "user-edit.detail.bank-account-image";
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
  accordionValue: string | number | string[] | number[] = ["0", "1", "2"];
  get filterFields(): string[] {
    return ["id", "name"];
  }
  get filterPlaceHolder(): string {
    return "user-edit.user-pick-list.filter-place-holder";
  }

  protected readonly stringToDate = FExtensions.stringToDate;
  protected readonly dateToYearFullString = FExtensions.dateToYearFullString;
	protected readonly responseTypeToResponseTypeDesc = responseTypeToResponseTypeDesc;
	protected readonly requestTypeToRequestTypeDesc = requestTypeToRequestTypeDesc;
  protected readonly dateToYYYYMMdd = FExtensions.dateToYYYYMMdd;
}
