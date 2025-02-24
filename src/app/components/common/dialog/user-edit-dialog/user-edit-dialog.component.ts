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
import {UserFileType} from "../../../../models/rest/user/user-file-type";
import {IftaLabel} from "primeng/iftalabel";
import {Divider} from "primeng/divider";
import {ConfirmPopup} from "primeng/confirmpopup";

@Component({
  selector: "app-user-edit-dialog",
  imports: [AccordionModule, NgIf, TagModule, TranslatePipe, FormsModule, MultiSelectModule, ButtonModule, TableModule, ImageModule, InputTextModule, ProgressSpinComponent, Tooltip, Select, CustomPickListComponent, IftaLabel, Divider, ConfirmPopup],
  templateUrl: "./user-edit-dialog.component.html",
  styleUrl: "./user-edit-dialog.component.scss",
  standalone: true,
})
export class UserEditDialogComponent extends FDialogComponentBase {
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
  selectedHosData: HospitalModel = new HospitalModel();
  constructor(private thisService: UserInfoService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.UserChanger));
    const dlg = this.dialogService.getInstance(this.ref);
    this.userDataModel = dlg.data;
  }
  override async ngInit(): Promise<void> {
    await this.getUserData();
    await this.getChildAble();
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
      this.ref.close(this.userDataModel);
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
  closeThis(): void {
    this.ref.close();
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
  accordionValue = ["0", "1", "2"];
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
	protected readonly UserFileType = UserFileType;
}
