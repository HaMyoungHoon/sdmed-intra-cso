import {AfterContentInit, Component, inject, OnDestroy} from "@angular/core";
import {FDialogService} from "../services/common/f-dialog.service";
import {haveRole, UserRole} from "../models/rest/user/user-role";
import * as FExtensions from "./f-extensions";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {TranslateService} from "@ngx-translate/core";
import {CommonService} from "../services/rest/common.service";
import {AzureBlobService} from "../services/rest/azure-blob.service";
import {Subject} from "rxjs";
import {MqttService} from "../services/rest/mqtt.service";
import {ConfirmationService} from "primeng/api";

@Component({
  selector: "f-dialog-component-base",
  template: "",
  standalone: false
})
export abstract class FDialogComponentBase implements AfterContentInit, OnDestroy {
  myRole: number = 0;
  haveRole: boolean = false;
  isLoading: boolean = false;
  isMobile: boolean = false;
  protected sub: Subject<any>[] = [];
  protected roleCheck: boolean = true;
  protected ref: DynamicDialogRef;
  protected dialogService: DialogService;
  protected commonService: CommonService;
  protected confirmService: ConfirmationService;
  protected mqttService: MqttService;
  protected fDialogService: FDialogService;
  protected translateService: TranslateService;
  protected azureBlobService: AzureBlobService;
  protected constructor(protected arrayRole: Array<UserRole> = Array<UserRole>(UserRole.None)) {
    this.ref = inject(DynamicDialogRef);
    this.dialogService = inject(DialogService);
    this.commonService = inject(CommonService);
    this.confirmService = inject(ConfirmationService);
    this.mqttService = inject(MqttService);
    this.fDialogService = inject(FDialogService);
    this.translateService = inject(TranslateService);
    this.azureBlobService = inject(AzureBlobService);
  }

  async ngAfterContentInit(): Promise<void> {
    this.isMobile = !navigator.userAgent.includes("Window");
    if (this.roleCheck) {
      await this.getMyRole();
    }
    await this.ngInit();
  }
  async ngOnDestroy(): Promise<void> {
    await this.ngDestroy();
  }
  async getMyRole(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.commonService.getMyRole(),
      e => this.fDialogService.error("getMyRole", e));
    this.setLoading(false);
    if (ret.result) {
      this.myRole = ret.data ?? 0;
      this.haveRole = haveRole(ret.data, this.arrayRole)
      return;
    }

    this.fDialogService.warn("getMyRole", ret.msg);
    return;
  }

  async ngInit(): Promise<void> {

  }
  async ngDestroy(): Promise<void> {
    for (const buff of this.sub) {
      buff.complete();
    }
  }

  setLoading(data: boolean = true): void {
    this.isLoading = data;
  }

  confirmCall(event: Event, header: string = "", message: string = "", rejectLabel: string = "", acceptLabel: string = "", accept?: () => void, reject?: () => void): void {
    this.confirmService.confirm({
      target: event.target as EventTarget,
      message: message,
      header: "",
      closable: false,
      closeOnEscape: false,
      icon: "pi pi-exclamation-triangle",
      rejectButtonProps: {
        label: rejectLabel,
        severity: "secondary"
      },
      acceptButtonProps: {
        label: acceptLabel
      },
      accept: (): void => {
        if (accept) accept();
      },
      reject: (): void => {
        if (reject) reject();
      }
    });
  }
}
