import {Component} from "@angular/core";
import {FDialogComponentBase} from "../../../../guards/f-dialog-component-base";
import {EdiListService} from "../../../../services/rest/edi-list.service";
import {UserRole} from "../../../../models/rest/user/user-role";
import {EDIUploadPharmaModel} from "../../../../models/rest/edi/edi-upload-pharma-model";
import * as FExtensions from "../../../../guards/f-extensions";
import {EDIUploadResponseModel} from "../../../../models/rest/edi/edi-upload-response-model";
import {Select} from "primeng/select";
import {allEDIStateArray, EDIState} from "../../../../models/rest/edi/edi-state";
import {FormsModule} from "@angular/forms";
import {Button} from "primeng/button";
import {TranslatePipe} from "@ngx-translate/core";
import {Textarea} from "primeng/textarea";
import {EDIUploadModel} from "../../../../models/rest/edi/edi-upload-model";

@Component({
  selector: "app-edi-response-dialog",
  imports: [Select, FormsModule, Button, TranslatePipe, Textarea],
  templateUrl: "./edi-response-dialog.component.html",
  styleUrl: "./edi-response-dialog.component.scss",
  standalone: true,
})
export class EdiResponseDialogComponent extends FDialogComponentBase {
  pharma?: EDIUploadPharmaModel;
  etc: string = "";
  ediUploadModel?: EDIUploadModel;
  ediStateList = allEDIStateArray();
  selectEDIState: EDIState;
  constructor(private thisService: EdiListService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.EdiChanger));
    const dlg = this.dialogService.getInstance(this.ref);
    this.pharma = (dlg.data.pharma as EDIUploadPharmaModel);
    if (this.pharma) {
      this.selectEDIState = this.pharma.ediState;
    } else {
      this.ediUploadModel = (dlg.data.edi as EDIUploadModel);
      this.selectEDIState = this.ediUploadModel.ediState;
    }
  }

  override async ngInit(): Promise<void> {

  }

  async mqttSend(userPK: string | undefined, thisPK: string | undefined, content: string | undefined, ediState: EDIState | undefined): Promise<void> {
    if (userPK == undefined || thisPK == undefined || content == undefined || ediState == undefined) {
      return;
    }
    const ret = await FExtensions.restTry(async() => this.mqttService.postEDIResponse(userPK, thisPK, content, ediState));
//      e => this.fDialogService.warn("notice", e));
//    if (ret.result) {
//      return;
//    }
//    this.fDialogService.warn("notice", ret.msg);
  }
  async postData(): Promise<void> {
    if (!this.postAble) {
      return;
    }
    this.setLoading();
    const ediUploadResponseModel = FExtensions.applyClass(EDIUploadResponseModel, obj => {
      obj.etc = this.etc;
      obj.ediState = this.selectEDIState;
    });
    const ret =
    this.pharma ?
      await FExtensions.restTry(async() => await this.thisService.postData(this.pharma!!.thisPK, ediUploadResponseModel),
        e => this.fDialogService.error("postData", e))
    : await FExtensions.restTry(async() => await this.thisService.postEDINewData(this.ediUploadModel!!.thisPK, ediUploadResponseModel),
        e => this.fDialogService.error("postData", e));
    if (ret.result) {
      await this.mqttSend(ret.data?.userPK, ret.data?.thisPK, `${ret.data?.name}\n${ret.data?.orgName}`, ret.data?.ediState);
      this.ref.close(this.pharma);
      return;
    }
    this.fDialogService.warn("postData", ret.msg);
  }

  get postAble(): boolean {
    if (!this.haveRole) return false;
    if (this.pharma) {
      if (this.pharma.thisPK.length <= 0) return false;
      if (this.pharma.ediState == EDIState.OK) return false;
      if (this.pharma.ediState == EDIState.Reject) return false;
      if (this.pharma.ediState == this.selectEDIState) return false;
    } else {

    }
    return true;
  }
}
