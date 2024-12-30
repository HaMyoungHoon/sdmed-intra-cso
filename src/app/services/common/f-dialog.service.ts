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

@Injectable({
  providedIn: "root"
})
export class FDialogService {
  ref?: DynamicDialogRef
  constructor(private dialogService: DialogService, private messageService: MessageService) { }

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
  openQnAViewDialog(config: DynamicDialogConfig): Observable<any> {
    this.ref = this.dialogService.open(QnaViewDialogComponent, config);
    return this.ref.onClose;
  }
  openPasswordChangeDialog(config: DynamicDialogConfig): Observable<any> {
    this.ref = this.dialogService.open(PasswordChangeDialogComponent, config);
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
  alertToast(data: ToastItem): void {
    this.add(data.level, data.title, data.detail)
  }
  alert(level: ToastLevel, title: string, detail: string): void {
    this.add(level, title, detail);
  }
  warn(title: string, detail?: string): void {
    if ((detail?.length ?? 0) <= 0) {
      return;
    }
    this.add(ToastLevel.warn, title, detail);
  }
  error(title: string, detail?: string): void {
    if ((detail?.length ?? 0) <= 0) {
      return;
    }
    this.add(ToastLevel.error, title, detail);
  }
  info(title: string, detail?: string): void {
    if ((detail?.length ?? 0) <= 0) {
      return;
    }
    this.add(ToastLevel.info, title, detail);
  }
  success(title: string, detail?: string): void {
    if ((detail?.length ?? 0) <= 0) {
      return;
    }
    this.add(ToastLevel.success, title, detail);
  }

  add(severity: string, title: string, detail?: string): void {
    this.messageService.add({
      severity: severity,
      summary: title,
      detail: detail
    });
  }
}
