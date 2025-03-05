import { Component } from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {UserRole} from "../../../../models/rest/user/user-role";
import {EdiCheckListService} from "../../../../services/rest/edi-check-list.service";
import * as FExtensions from "../../../../guards/f-extensions";
import * as FConstants from "../../../../guards/f-constants";
import {EdiUploadCheckModel} from "../../../../models/rest/edi/edi-upload-check-model";
import {UserDataModel} from "../../../../models/rest/user/user-data-model";
import {Subject, takeUntil} from "rxjs";
import * as FImageCache from "../../../../guards/f-image-cache";
import {EdiUploadCheckSubModel} from "../../../../models/rest/edi/edi-upload-check-sub-model";
import {StringToEDIStateDesc} from "../../../../models/rest/edi/edi-state";

@Component({
  selector: "app-edi-check-list",
  templateUrl: "./edi-check-list.component.html",
  styleUrl: "./edi-check-list.component.scss",
  standalone: false
})
export class EdiCheckListComponent extends FComponentBase {
  viewList: EdiUploadCheckModel[] = [];
  initList: EdiUploadCheckModel[] = [];
  selectMonth: Date = new Date();
  dateModeList: string[] = [];
  selectDateMode?: string;
  userList: UserDataModel[] = [];
  selectUser?: UserDataModel;
  userModeList: string[] = [];
  selectUserMode?: string;
  isSorted: boolean | null = null;

  constructor(private thisService: EdiCheckListService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.UserChanger, UserRole.Employee, UserRole.EdiChanger));
    this.initLayout();
  }

  override async ngInit(): Promise<void> {
    await this.getUserList();
    await this.getThis();
  }

  initLayout(): void {
    this.dateModeList = ["edi-check-list.date-mode-option1", "edi-check-list.date-mode-option2"];
    this.selectDateMode = "edi-check-list.date-mode-option1";
    this.userModeList = ["edi-check-list.user-mode-option1", "edi-check-list.user-mode-option2"];
    this.selectUserMode = "edi-check-list.user-mode-option1";
  }
  getIsEDIDate(): boolean {
    return this.selectDateMode == "edi-check-list.date-mode-option1";
  }
  getIsMyChild(): boolean {
    return this.selectUserMode == "edi-check-list.user-mode-option1";
  }
  async getUserList(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getUserList(this.getIsMyChild()),
      e => this.fDialogService.error("getUserList", e));
    this.setLoading(false);
    if (ret.result) {
      this.userList = ret.data ?? [];
      this.selectUser = this.userList.length > 0 ? this.userList[0] : undefined;
      return;
    }
    this.fDialogService.warn("getUserList", ret.msg);
  }
  async getThis(): Promise<void> {
//    if (this.getAllUser()) {
//      await this.getList();
//    } else {
//      await this.getData();
//    }
    await this.getData();
  }
  async getList(): Promise<void> {
    const selectUser = this.selectUser;
    if (selectUser == undefined) {
      return;
    }
    this.setLoading();
    await FExtensions.tryCatchAsync(async() => await FImageCache.clearExpiredImage());
    const ret = await FExtensions.restTry(async() =>
        await this.thisService.getList(FExtensions.dateToYYYYMMdd(this.selectMonth), this.getIsEDIDate(), this.getIsMyChild()),
      e => this.fDialogService.error("getList", e));
    this.setLoading(false);
    if (ret.result) {
      this.initList = ret.data ?? [];
      this.viewList = [...this.initList];
      return;
    }
  }
  async getData(): Promise<void> {
    const selectUser = this.selectUser;
    if (selectUser == undefined) {
      return;
    }
    this.setLoading();
    await FExtensions.tryCatchAsync(async() => await FImageCache.clearExpiredImage());
    const ret = await FExtensions.restTry(async() =>
        await this.thisService.getData(FExtensions.dateToYYYYMMdd(this.selectMonth), selectUser.thisPK), e => this.fDialogService.error("getList", e));
    this.setLoading(false);
    if (ret.result) {
      this.initList = ret.data ?? [];
      this.viewList = [...this.initList];
      return;
    }
  }
  async refreshData(): Promise<void> {
    await this.getThis();
  }

  async openData(data: EdiUploadCheckSubModel): Promise<void> {
    if (data.ediPK.length <= 0) {
      return;
    }

    const isNewTab = this.configService.isNewTab();
    if (isNewTab) {
      window.open(`${FConstants.EDI_LIST_URL}/${data.ediPK}`, "_blank", `width=${screen.width}; height=${screen.height};`);
      return;
    }
    const sub = new Subject<any>();
    this.sub.push(sub);
    this.fDialogService.openEDIViewDialog({
      modal: true,
      closable: true,
      closeOnEscape: true,
      draggable: true,
      resizable: true,
      maximizable: true,
      data: data.ediPK
    }).pipe(takeUntil(sub)).subscribe((x): void => {
    });
  }
  requestApplyDate(data: EdiUploadCheckSubModel): string {
    return `${data.reqApplyYear}-${data.reqApplyMonth}-${data.reqApplyDay}`;
  }
  actualApplyDate(data: EdiUploadCheckSubModel): string {
    return `${data.actualApplyYear}-${data.actualApplyMonth}-${data.actualApplyDay}`;
  }
  get filterFields(): string[] {
    return ["id", "name", "hospitalName"];
  }
  get userFilterFields(): string[] {
    return ["id", "name"];
  }
  get downIcon(): string {
    return "pi pi-chevron-down";
  }
  get rightIcon(): string {
    return "pi pi-chevron-right";
  }

  protected readonly customSort = FExtensions.customSort;
  protected readonly tableStyle = FConstants.tableStyle;
  protected readonly getEDIStateSeverity = FExtensions.getEDIStateSeverity;
  protected readonly dateToYYYYMMdd = FExtensions.dateToYYYYMMdd;
	protected readonly StringToEDIStateDesc = StringToEDIStateDesc;
}
