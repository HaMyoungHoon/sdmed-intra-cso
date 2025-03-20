import {Component, ElementRef, ViewChild} from "@angular/core";
import {FDialogComponentBase} from "../../../../guards/f-dialog-component-base";
import {UserRole} from "../../../../models/rest/user/user-role";
import {PharmaModel} from "../../../../models/rest/pharma/pharma-model";
import * as FExtensions from "../../../../guards/f-extensions";
import * as FConstants from "../../../../guards/f-constants";
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {ImageModule} from "primeng/image";
import {InputTextModule} from "primeng/inputtext";
import {NgIf} from "@angular/common";
import {ProgressSpinComponent} from "../../progress-spin/progress-spin.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslatePipe} from "@ngx-translate/core";
import {MedicineModel} from "../../../../models/rest/medicine/medicine-model";
import {CheckboxModule} from "primeng/checkbox";
import {IconField} from "primeng/iconfield";
import {InputIcon} from "primeng/inputicon";
import {debounceTime, Subject, Subscription, takeUntil} from "rxjs";
import {PharmaListService} from "../../../../services/rest/pharma-list.service";
import {Select} from "primeng/select";
import {DatePicker} from "primeng/datepicker";
import {CustomPickListComponent} from "../../custom-pick-list/custom-pick-list.component";

@Component({
  selector: "app-pharma-edit-dialog",
  imports: [ButtonModule, CardModule, ImageModule, InputTextModule, NgIf, ProgressSpinComponent, ReactiveFormsModule, TranslatePipe, FormsModule, CheckboxModule, IconField, InputIcon, Select, DatePicker, CustomPickListComponent],
  templateUrl: "./pharma-edit-dialog.component.html",
  styleUrl: "./pharma-edit-dialog.component.scss",
  standalone: true,
})
export class PharmaEditDialogComponent extends FDialogComponentBase {
  @ViewChild("imageInput") imageInput!: ElementRef<HTMLInputElement>;
  pharmaModel: PharmaModel = new PharmaModel();

  medicineSearchLoading: boolean = false;
  isMedicineSearchTypeCode: boolean = false;
  medicineSearchValue: string = "";
  medicineList: MedicineModel[] = [];
  medicineSearchSubject: Subject<string> = new Subject<string>();
  medicineSearchObserver?: Subscription;
  medicineSearchDebounceTime: number = 1000;
  constructor(private thisService: PharmaListService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.PharmaChanger));
    this.initLayoutData();
    const dlg = this.dialogService.getInstance(this.ref);
    this.pharmaModel.thisPK = dlg.data.thisPK;
  }

  override async ngInit(): Promise<void> {
    await this.getPharmaData();
  }
  initLayoutData(): void {
    const sub = new Subject<any>();
    this.sub.push(sub);
    this.medicineSearchObserver = this.medicineSearchSubject.pipe(debounceTime(this.medicineSearchDebounceTime))
      .pipe(takeUntil(sub)).subscribe(async() => {
        this.medicineSearchLoading = false;
        await this.medicineSearch();
      });
  }
  async getPharmaData(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getData(this.pharmaModel.thisPK, true),
      e => this.fDialogService.error("getPharmaData", e));
    this.setLoading(false);
    if (ret.result) {
      this.pharmaModel = ret.data ?? new PharmaModel();
      return;
    }
    this.fDialogService.warn("getPharmaData", ret.msg);
  }
  async saveData(): Promise<void> {
    this.setLoading();
    if (!await this.medicineListModify()) {
      this.setLoading(false);
      return;
    }

    const ret = await FExtensions.restTry(async() => await this.thisService.putData(this.pharmaModel),
      e => this.fDialogService.error("saveData", e));
    this.setLoading(false);
    if (ret.result) {
      this.ref.close(ret.data);
      return;
    }
    this.fDialogService.warn("saveData", ret.msg);
  }
  async medicineListModify(): Promise<boolean> {
    const medicineList = this.pharmaModel.medicineList.map(x => x.thisPK);
    const ret = await FExtensions.restTry(async() => await this.thisService.putMedicine(this.pharmaModel.thisPK, medicineList),
      e => this.fDialogService.error("medicineListModify", e));
    if (ret.result) {
      return true;
    }
    this.fDialogService.warn("medicineListModify", ret.msg);
    return false;
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

      const blobName = FExtensions.getPharmaBlobName(ext);
      const blobStorageInfo = await FExtensions.restTry(async() => await this.commonService.getGenerateSas(blobName),
        e => this.fDialogService.error("imageView", e));
      if (blobStorageInfo.result != true || blobStorageInfo.data == undefined) {
        this.fDialogService.warn("imageView", blobStorageInfo.msg);
        this.setLoading(false);
        return;
      }
      const blobModel = FExtensions.getPharmaBlobModel(file, blobStorageInfo.data, blobName, ext);
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
      const ret = await FExtensions.restTry(async() => await this.thisService.putImage(this.pharmaModel.thisPK, blobModel),
        e => this.fDialogService.error("imageView", e));
      this.imageInput.nativeElement.value = "";
      this.setLoading(false);
      if (ret.result) {
        this.pharmaModel.imageUrl = ret.data?.imageUrl ?? ""
        return;
      }

      this.fDialogService.warn("imageView", ret.msg);
    }
  }
  get imageUrl(): string {
    if (this.pharmaModel.imageUrl.length > 0) {
      return this.pharmaModel.imageUrl;
    }

    return FConstants.ASSETS_NO_IMAGE;
  }
  imageView(): void {
    if (this.pharmaModel.imageUrl.length <= 0) {
      this.imageInput.nativeElement.click();
      return;
    }

    this.fDialogService.openImageView({
      closable: true,
      closeOnEscape: true,
      draggable: true,
      resizable: true,
      maximizable: true,
      data: Array<string>(this.pharmaModel.imageUrl)
    });
  }

  async medicineSearch(): Promise<void> {
    if (this.medicineSearchValue.length <= 0) {
      return;
    }
    const ret = await FExtensions.restTry(async() => await this.thisService.getMedicine(this.medicineSearchValue, this.isMedicineSearchTypeCode),
      e => this.fDialogService.error("medicineSearch", e));
    if (ret.result) {
      this.medicineList = ret.data ?? [];
      this.medicineList = this.medicineList.filter(x => !this.pharmaModel.medicineList.some(y => y.thisPK == x.thisPK))
      return;
    }
    this.fDialogService.warn("medicineSearch", ret.msg);
  }
  get medicineSearchStyle(): string {
    if (this.medicineSearchLoading) return "pi pi-spinner pi-spin";
    else return "pi pi-search"
  }
  get medicineSearchPlaceHolder(): string {
    if (this.isMedicineSearchTypeCode) return "pharma-edit.medicine-pick-list.search-code";
    else return "pharma-edit.medicine-pick-list.search-name";
  }
  async medicineSearchChange(data: any): Promise<void> {
    if (this.isMobile) {
      this.medicineSearchLoading = true;
      this.medicineSearchSubject.next(data.data);
      return;
    }
    if (data.key == "Enter") {
      this.medicineSearchLoading = true;
      await this.medicineSearch();
      this.medicineSearchLoading = false;
    }
  }

  get cardHeader(): string {
    return "pharma-edit.medicine-pick-list.header";
  }
  get filterFields(): string[] {
    return ["code", "kdCode", "innerName"];
  }
  get filterPlaceHolder(): string {
    return "pharma-edit.medicine-pick-list.filter-place-holder";
  }

  protected readonly ellipsis = FExtensions.ellipsis;
}
