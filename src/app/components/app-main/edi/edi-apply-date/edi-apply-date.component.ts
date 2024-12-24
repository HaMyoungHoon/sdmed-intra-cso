import { Component } from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {EdiApplyDateService} from "../../../../services/rest/edi-apply-date.service";
import {UserRole} from "../../../../models/rest/user/user-role";
import {EDIApplyDateModel} from "../../../../models/rest/edi/edi-apply-date-model";
import {allEDIApplyDateStateDescArray, EDIApplyDateState, EDIApplyDateStateDescToEDIApplyDateState, StringToEDIApplyDateStateDesc} from "../../../../models/rest/edi/edi-apply-date-state";
import * as FExtensions from "../../../../guards/f-extensions";

@Component({
  selector: "app-edi-apply-date",
  templateUrl: "./edi-apply-date.component.html",
  styleUrl: "./edi-apply-date.component.scss",
  standalone: false
})
export class EdiApplyDateComponent extends FComponentBase {
  viewList: EDIApplyDateModel[] = [];
  selectMonth = new Date();
  constructor(private thisService: EdiApplyDateService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.EdiChanger));
  }

  override async ngInit(): Promise<void> {
    if (this.haveRole) {
      await this.getList();
    } else {
      await this.getUseList();
    }
  }

  async getList(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getList(),
      e => this.fDialogService.error("getList", e));
    this.setLoading(false);
    if (ret.result) {
      this.viewList = ret.data ?? [];
      return;
    }
    this.fDialogService.warn("getList", ret.msg);
  }
  async getUseList(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getUseApplyDate(),
      e => this.fDialogService.error("getUseList", e));
    this.setLoading(false);
    if (ret.result) {
      this.viewList = ret.data ?? [];
      return;
    }
    this.fDialogService.warn("getUseList", ret.msg);
  }
  async insertData(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.postData(FExtensions.dateToMonthYYYYMMdd(this.selectMonth)),
      e => this.fDialogService.error("insertData", e));
    this.setLoading(false);
    if (ret.result) {
      if (ret.data) {
        this.viewList.unshift(ret.data);
      }
      return;
    }
    this.fDialogService.warn("insertData", ret.msg);
  }
  async putData(thisPK: string, ediState: EDIApplyDateState): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.putData(thisPK, ediState),
      e => this.fDialogService.error("putData", e));
    this.setLoading(false);
    if (ret.result) {
      return;
    }
    this.fDialogService.warn("putData", ret.msg);
  }

  applyDateToDesc(state: EDIApplyDateState): string {
    return StringToEDIApplyDateStateDesc[state];
  }
  async applyDateSelect(data: EDIApplyDateModel, event: any): Promise<void> {
    await this.putData(data.thisPK, EDIApplyDateStateDescToEDIApplyDateState[event.value]);
  }

  protected readonly allEDIApplyDateStateDescArray = allEDIApplyDateStateDescArray;
}
