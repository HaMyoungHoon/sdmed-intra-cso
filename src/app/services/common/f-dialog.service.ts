import { Injectable } from "@angular/core";
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {MessageService} from "primeng/api";
import {ToastLevel} from "../../models/common/toast-level";
import {ToastItem} from "../../models/common/toast-item";
import {Observable} from "rxjs";
import {TableDialogComponent} from "../../components/common/dialog/table-dialog/table-dialog.component";
import {HtmlEditDialogComponent} from "../../components/common/dialog/html-edit-dialog/html-edit-dialog.component";
import {SignDialogComponent} from "../../components/common/dialog/sign-dialog/sign-dialog.component";
import {UserEditDialogComponent} from "../../components/common/dialog/user-edit-dialog/user-edit-dialog.component";
import {ImageViewDialogComponent} from "../../components/common/dialog/image-view-dialog/image-view-dialog.component";
import {HospitalEditDialogComponent} from "../../components/common/dialog/hospital-edit-dialog/hospital-edit-dialog.component";
import {HospitalAddDialogComponent} from "../../components/common/dialog/hospital-add-dialog/hospital-add-dialog.component";
import {PharmaEditDialogComponent} from "../../components/common/dialog/pharma-edit-dialog/pharma-edit-dialog.component";
import {PharmaAddDialogComponent} from "../../components/common/dialog/pharma-add-dialog/pharma-add-dialog.component";
import {MedicineEditDialogComponent} from "../../components/common/dialog/medicine-edit-dialog/medicine-edit-dialog.component";
import {MedicineAddDialogComponent} from "../../components/common/dialog/medicine-add-dialog/medicine-add-dialog.component";
import {PasswordChangeDialogComponent} from "../../components/common/dialog/password-change-dialog/password-change-dialog.component";
import {QnaViewDialogComponent} from "../../components/common/dialog/qna-view-dialog/qna-view-dialog.component";
import {EdiViewDialogComponent} from "../../components/common/dialog/edi-view-dialog/edi-view-dialog.component";
import {EdiResponseDialogComponent} from "../../components/common/dialog/edi-response-dialog/edi-response-dialog.component";
import {FullScreenFileViewDialogComponent} from "../../components/common/dialog/full-screen-file-view-dialog/full-screen-file-view-dialog.component";
import {UserAddDialogComponentComponent} from "../../components/common/dialog/user-add-dialog-component/user-add-dialog-component.component";
import {Router} from "@angular/router";
import {AppConfigService} from "./app-config.service";
import {
  HospitalTempDetailComponent
} from "../../components/common/dialog/hospital-temp-detail/hospital-temp-detail.component";
import {
  HospitalTempFindComponent
} from "../../components/common/dialog/hospital-temp-find/hospital-temp-find.component";

@Injectable({
  providedIn: "root"
})
export class FDialogService {
  ref?: DynamicDialogRef
  constructor(private dialogService: DialogService, private messageService: MessageService, private appConfig: AppConfigService) { }

  openSignIn(): Observable<any> {
    this.ref = this.dialogService.open(SignDialogComponent, {
      header: "sign in",
      modal: true,
      closable: true,
      closeOnEscape: false,
    });

    return this.ref.onClose;
  }
  openTable(config: DynamicDialogConfig): Observable<any> {
    this.ref = this.dialogService.open(TableDialogComponent, config);
    return this.ref.onClose;
  }
  openEDIViewDialog(config: DynamicDialogConfig): Observable<any> {
    this.ref = this.dialogService.open(EdiViewDialogComponent, config);
    return this.ref.onClose;
  }
  openEDIResponseDialog(config: DynamicDialogConfig): Observable<any> {
    this.ref = this.dialogService.open(EdiResponseDialogComponent, config);
    return this.ref.onClose;
  }
  openQnAViewDialog(config: DynamicDialogConfig): Observable<any> {
    this.ref = this.dialogService.open(QnaViewDialogComponent, config);
    return this.ref.onClose;
  }
  openHospitalTempFindView(config: DynamicDialogConfig): Observable<any> {
    this.ref = this.dialogService.open(HospitalTempFindComponent, config);
    return this.ref.onClose;
  }
  openHospitalTempDetailView(config: DynamicDialogConfig): Observable<any> {
    this.ref = this.dialogService.open(HospitalTempDetailComponent, config);
    return this.ref.onClose;
  }
  openPasswordChangeDialog(config: DynamicDialogConfig): Observable<any> {
    this.ref = this.dialogService.open(PasswordChangeDialogComponent, config);
    return this.ref.onClose;
  }
  openUserAddDialog(config: DynamicDialogConfig): Observable<any> {
    this.ref = this.dialogService.open(UserAddDialogComponentComponent, config);
    return this.ref.onClose;
  }
  openUserEditDialog(config: DynamicDialogConfig): Observable<any> {
    this.ref = this.dialogService.open(UserEditDialogComponent, config);
    return this.ref.onClose;
  }
  openHospitalEditDialog(config: DynamicDialogConfig): Observable<any> {
    this.ref = this.dialogService.open(HospitalEditDialogComponent, config);
    return this.ref.onClose;
  }
  openHospitalAddDialog(config: DynamicDialogConfig): Observable<any> {
    this.ref = this.dialogService.open(HospitalAddDialogComponent, config);
    return this.ref.onClose;
  }
  openPharmaEditDialog(config: DynamicDialogConfig): Observable<any> {
    this.ref = this.dialogService.open(PharmaEditDialogComponent, config);
    return this.ref.onClose;
  }
  openPharmaAddDialog(config: DynamicDialogConfig): Observable<any> {
    this.ref = this.dialogService.open(PharmaAddDialogComponent, config);
    return this.ref.onClose;
  }
  openMedicineEditDialog(config: DynamicDialogConfig): Observable<any> {
    this.ref = this.dialogService.open(MedicineEditDialogComponent, config);
    return this.ref.onClose;
  }
  openMedicineAddDialog(config: DynamicDialogConfig): Observable<any> {
    this.ref = this.dialogService.open(MedicineAddDialogComponent, config);
    return this.ref.onClose;
  }
  openHtmlEdit(config: DynamicDialogConfig): Observable<any> {
    this.ref = this.dialogService.open(HtmlEditDialogComponent, config);
    return this.ref.onClose;
  }
  openImageView(config: DynamicDialogConfig): Observable<any> {
    this.ref = this.dialogService.open(ImageViewDialogComponent, config);
    return this.ref.onClose;
  }
  openFullscreenFileView(config: DynamicDialogConfig): Observable<any> {
    this.ref = this.dialogService.open(FullScreenFileViewDialogComponent, config);
    return this.ref.onClose;
  }
  alertToast(data: ToastItem): void {
    this.add(data.level, data.title, data.detail, data.text, data.sticky)
  }
  alert(level: ToastLevel, title: string, detail: string, text: any): void {
    this.add(level, title, detail, text, true);
  }
  warn(title: string, detail?: string): void {
    if ((detail?.length ?? 0) <= 0) {
      return;
    }
    const sticky = false;
    const life = this.appConfig.getToastLife();
    this.add(ToastLevel.warn, title, detail, null, sticky, life);
  }
  error(title: string, detail?: string): void {
    if ((detail?.length ?? 0) <= 0) {
      return;
    }
    const sticky = false;
    const life = this.appConfig.getToastLife();
    this.add(ToastLevel.error, title, detail, null, sticky, life);
  }
  info(title: string, detail?: string, text?: any): void {
    if ((detail?.length ?? 0) <= 0) {
      return;
    }

    const sticky = this.appConfig.isInfoSticky();
    const life = this.appConfig.getToastLife();
    this.add(ToastLevel.info, title, detail, text, sticky, life);
  }
  mqttInfo(title: string, detail?: string, text?: any, confirmFn?: (event: MouseEvent, message: any, router: Router) => void, thisData?: any): void {
    if ((detail?.length ?? 0) <= 0) {
      return;
    }
    const sticky = this.appConfig.isInfoSticky();
    const life = this.appConfig.getToastLife();
    this.add(ToastLevel.info, title, detail, text, sticky, life, confirmFn, thisData, "common-desc.move");
  }
  success(title: string, detail?: string, text: string = ""): void {
    if ((detail?.length ?? 0) <= 0) {
      return;
    }
    const sticky = false;
    const life = this.appConfig.getToastLife();
    this.add(ToastLevel.success, title, detail, text, sticky, life);
  }

  add(severity: string, title: string, detail?: string, text?: any, sticky: boolean = false, life: number = 3000,
      confirmFn?: (event: MouseEvent, message: any, router: Router) => void, thisData?: any,
      confirmLabel: string = "common-desc.confirm"): void {
    this.messageService.add({
      severity: severity,
      summary: title,
      detail: detail,
      text: text,
      sticky: sticky,
      life: life,
      data: {
        "this-data": thisData,
        "confirm-label": confirmLabel,
        "confirm-able": confirmFn,
        confirmFn: (event: MouseEvent, message: any, router: Router): void => {
          if (confirmFn) confirmFn(event, message, router);
        }
      }
    });
  }
}
