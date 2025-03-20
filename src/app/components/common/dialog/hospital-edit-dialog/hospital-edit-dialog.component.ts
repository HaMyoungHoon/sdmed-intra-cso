import {Component, ElementRef, ViewChild} from "@angular/core";
import {FDialogComponentBase} from "../../../../guards/f-dialog-component-base";
import {UserRole} from "../../../../models/rest/user/user-role";
import {HospitalModel} from "../../../../models/rest/hospital/hospital-model";
import {ProgressSpinComponent} from "../../progress-spin/progress-spin.component";
import {ButtonModule} from "primeng/button";
import {TranslatePipe} from "@ngx-translate/core";
import {CardModule} from "primeng/card";
import {NgIf} from "@angular/common";
import * as FExtensions from "../../../../guards/f-extensions";
import {InputTextModule} from "primeng/inputtext";
import {FormsModule} from "@angular/forms";
import {ImageModule} from "primeng/image";
import * as FConstants from "../../../../guards/f-constants";
import {HospitalListService} from "../../../../services/rest/hospital-list.service";
import {Select} from "primeng/select";

@Component({
  selector: "app-hospital-edit-dialog",
  imports: [ProgressSpinComponent, ButtonModule, TranslatePipe, CardModule, NgIf, InputTextModule, FormsModule, ImageModule, Select],
  templateUrl: "./hospital-edit-dialog.component.html",
  styleUrl: "./hospital-edit-dialog.component.scss",
  standalone: true
})
export class HospitalEditDialogComponent extends FDialogComponentBase {
  @ViewChild("imageInput") imageInput!: ElementRef<HTMLInputElement>;
  hospitalModel: HospitalModel = new HospitalModel();
  constructor(private thisService: HospitalListService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.HospitalChanger));
    const dlg = this.dialogService.getInstance(this.ref);
    this.hospitalModel.thisPK = dlg.data.thisPK;
  }

  override async ngInit(): Promise<void> {
    await this.getHospitalData();
  }

  async getHospitalData(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getData(this.hospitalModel.thisPK),
      e => this.fDialogService.error("getHospitalData", e));
    this.setLoading(false);
    if (ret.result) {
      this.hospitalModel = ret.data ?? new HospitalModel();
      return;
    }
    this.fDialogService.warn("getHospitalData", ret.msg);
  }

  async saveData(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.putData(this.hospitalModel),
      e => this.fDialogService.error("saveData", e));
    this.setLoading(false);
    if (ret.result) {
      this.ref.close(ret.data);
      return;
    }
    this.fDialogService.warn("saveData", ret.msg);
  }
  closeThis(): void {
    this.ref.close();
  }

  async imageSelected(event: any): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.setLoading();
      const file = input.files[0];
      const ext = await FExtensions.getFileExt(file);
      if (!FExtensions.isImage(ext)) {
        this.setLoading(false);
        this.fDialogService.warn("imageView", "only image file");
        return;
      }

      const blobName = FExtensions.getHospitalBlobName(ext);
      const blobStorageInfo = await FExtensions.restTry(async() => await this.commonService.getGenerateSas(blobName),
        e => this.fDialogService.error("imageView", e));
      if (blobStorageInfo.result != true || blobStorageInfo.data == undefined) {
        this.fDialogService.warn("imageView", blobStorageInfo.msg);
        this.setLoading(false);
        return;
      }
      const blobModel = FExtensions.getHospitalBlobModel(file, blobStorageInfo.data, blobName, ext);
      let uploadRet = true;
      const azureRet = await FExtensions.tryCatchAsync(async() => await this.azureBlobService.putUpload(file, blobStorageInfo.data, blobModel.blobName, blobModel.mimeType),
        e => {
        this.fDialogService.error("imageView", e);
        uploadRet = false;
      });
      if (azureRet == null || !uploadRet) {
        this.imageInput.nativeElement.value = "";
        this.setLoading(false);
        return;
      }
      const ret = await FExtensions.restTry(async() => await this.thisService.putImage(this.hospitalModel.thisPK, blobModel),
        e => this.fDialogService.error("imageView", e));
      this.imageInput.nativeElement.value = "";
      this.setLoading(false);
      if (ret.result) {
        this.hospitalModel.imageUrl = ret.data?.imageUrl ?? ""
        return;
      }

      this.fDialogService.warn("imageView", ret.msg);
    }
  }
  get imageUrl(): string {
    if (this.hospitalModel.imageUrl.length > 0) {
      return this.hospitalModel.imageUrl;
    }

    return FConstants.ASSETS_NO_IMAGE;
  }
  imageView(): void {
    if (this.hospitalModel.imageUrl.length <= 0) {
      this.imageInput.nativeElement.click();
      return;
    }

    this.fDialogService.openImageView({
      closable: true,
      closeOnEscape: true,
      draggable: true,
      resizable: true,
      maximizable: true,
      data: Array<string>(this.hospitalModel.imageUrl)
    });
  }
}
