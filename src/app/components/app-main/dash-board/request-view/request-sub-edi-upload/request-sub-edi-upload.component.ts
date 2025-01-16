import {Component, EventEmitter, input, Input, Output, ViewChild} from "@angular/core";
import {FComponentBase} from "../../../../../guards/f-component-base";
import {RequestModel} from "../../../../../models/rest/requst/request-model";
import {UserRole} from "../../../../../models/rest/user/user-role";
import * as FExtensions from "../../../../../guards/f-extensions";
import {EDIUploadModel} from "../../../../../models/rest/edi/edi-upload-model";
import {EDIUploadPharmaModel} from "../../../../../models/rest/edi/edi-upload-pharma-model";
import {EDIUploadPharmaMedicineModel} from "../../../../../models/rest/edi/edi-upload-pharma-medicine-model";
import {EDIState} from "../../../../../models/rest/edi/edi-state";
import {transformToBoolean} from "primeng/utils";
import {EDIUploadFileModel} from "../../../../../models/rest/edi/edi-upload-file-model";
import {saveAs} from "file-saver";
import * as FConstants from "../../../../../guards/f-constants";
import {FullscreenFileViewComponent} from "../../../../common/fullscreen-file-view/fullscreen-file-view.component";
import {EdiListService} from "../../../../../services/rest/edi-list.service";
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from "primeng/accordion";
import {Button} from "primeng/button";
import {GalleriaModule} from "primeng/galleria";
import {NgForOf, NgIf} from "@angular/common";
import {PrimeTemplate} from "primeng/api";
import {ProgressSpinComponent} from "../../../../common/progress-spin/progress-spin.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TableModule} from "primeng/table";
import {Tag} from "primeng/tag";
import {Tooltip} from "primeng/tooltip";
import {TranslatePipe} from "@ngx-translate/core";
import {Subject, takeUntil} from "rxjs";
import {Textarea} from "primeng/textarea";
import {EDIUploadResponseModel} from "../../../../../models/rest/edi/edi-upload-response-model";
import {Select} from "primeng/select";
import {AddTextOptionModel} from "../../../../../models/common/add-text-option-model";
import {allTextPositionDesc, DescToTextPosition, TextPosition, TextPositionToTextPositionDesc} from "../../../../../models/common/text-position";
import {InputText} from "primeng/inputtext";
import {IftaLabel} from "primeng/iftalabel";
import {ImageModifyViewComponent} from "../../../../common/image-modify-view/image-modify-view.component";

@Component({
  selector: "app-request-sub-edi-upload",
  imports: [Accordion, AccordionContent, AccordionHeader, AccordionPanel, Button, FullscreenFileViewComponent, GalleriaModule, NgForOf, NgIf, PrimeTemplate, ProgressSpinComponent, ReactiveFormsModule, TableModule, Tag, Tooltip, TranslatePipe, FormsModule, Textarea, Select, InputText, IftaLabel, ImageModifyViewComponent],
  templateUrl: "./request-sub-edi-upload.component.html",
  styleUrl: "./request-sub-edi-upload.component.scss",
  standalone: true,
})
export class RequestSubEdiUploadComponent extends FComponentBase {
  @Input() requestModel?: RequestModel
  @Output() closeEvent: EventEmitter<RequestModel> = new EventEmitter<RequestModel>();
  @ViewChild("fullscreenFileView") fullscreenFileView!: FullscreenFileViewComponent;
  @ViewChild("imageModifyView") imageModifyView!: ImageModifyViewComponent;
  uploadModel: EDIUploadModel = new EDIUploadModel();
  pharmaStateList: string[] = [];
  fontSize: number = 12;
  activeIndex: number = 0;
  selectPrintPharma?: EDIUploadPharmaModel;
  selectTextPosition: string = TextPositionToTextPositionDesc[TextPosition.LT];
  backColor: string = "#FFFFFF";
  textColor: string = "#000000";
  constructor(private thisService: EdiListService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.Employee));
  }

  override async ngInit(): Promise<void> {
    await this.getData();
  }

  async getData(): Promise<void> {
    const thisPK = this.requestModel?.requestItemPK;
    if (thisPK == null) {
      return;
    }
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getData(thisPK),
      e => this.fDialogService.error("getData", e));
    this.setLoading(false);
    if (ret.result) {
      this.uploadModel = ret.data ?? new EDIUploadModel();
      this.pharmaStateList = [...this.uploadModel.pharmaList.map(x => x.ediState)];
      if (this.uploadModel.pharmaList.length >= 1) {
        this.selectPrintPharma = this.uploadModel.pharmaList[0];
      }
      return;
    }
    this.fDialogService.warn("getData", ret.msg);
  }

  getApplyDate(): string {
    return `${this.uploadModel.year}-${this.uploadModel.month}`;
  }
  getPharmaApplyDate(pharma: EDIUploadPharmaModel): string {
    return `${pharma.year}-${pharma.month}`;
  }
  getMedicineApplyDate(medicine: EDIUploadPharmaMedicineModel): string {
    return FExtensions.dateToYYYYMMdd(FExtensions.stringToDate(`${medicine.year}-${medicine.month}-${medicine.day}`));
  }

  responsePharma(pharma: EDIUploadPharmaModel): void {
    const sub = new Subject<any>();
    this.sub.push(sub);
    this.fDialogService.openEDIResponseDialog({
      modal: true,
      closable: false,
      closeOnEscape: true,
      draggable: true,
      resizable: true,
      maximizable: true,
      data: pharma
    }).pipe(takeUntil(sub)).subscribe(async (x): Promise<void> => {
      if (x == null) {
        return;
      }
      await this.getData();
    });
  }
  async pharmaModify(pharma: EDIUploadPharmaModel): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => this.thisService.putPharmaData(pharma.thisPK, pharma),
      e => this.fDialogService.error("pharmaModify", e));
    this.setLoading(false);
    if (ret.result) {
      return;
    }
    this.fDialogService.warn("pharmaModify", ret.msg);
  }
  async medicineModify(medicine: EDIUploadPharmaMedicineModel): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.putPharmaMedicineData(medicine.thisPK, medicine),
      e => this.fDialogService.error("medicineModify", e));
    this.setLoading(false);
    if (ret.result) {
      return;
    }
    this.fDialogService.warn("medicineModify", ret.msg);
  }
  modifyDisable(pharma: EDIUploadPharmaModel): boolean {
    return pharma.ediState == EDIState.OK || pharma.ediState == EDIState.Reject;
  }
  async removeMedicine(pharma: EDIUploadPharmaModel, medicine: EDIUploadPharmaMedicineModel): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.deletePharmaMedicineData(medicine.thisPK),
      e => this.fDialogService.error("removeMedicine", e));
    this.setLoading(false);
    if (ret.result) {
      const findIndex = pharma.medicineList.findIndex(x => x.thisPK == medicine.thisPK);
      pharma.medicineList.splice(findIndex, 1);
      return;
    }
    this.fDialogService.warn("removeMedicine", ret.msg);
  }

  multipleEnable = input(true, { transform: (v: any) => transformToBoolean(v) });
  accordionPharmaIndex(item: EDIUploadPharmaModel): string {
    return `${this.uploadModel.pharmaList.findIndex(x => x.thisPK == item.thisPK)}`;
  }
  accordionResponseIndex(item: EDIUploadResponseModel): string {
    return `${this.uploadModel.responseList.findIndex(x => x.thisPK == item.thisPK)}`;
  }

  getBlobUrl(item: EDIUploadFileModel): string {
    const ext = FExtensions.getExtMimeType(item.mimeType);
    if (FExtensions.isImage(ext)) {
      return item.blobUrl;
    }
    return FExtensions.extToBlobUrl(ext);
  }
  async viewEDIItem(data: EDIUploadFileModel[], item: EDIUploadFileModel): Promise<void> {
    await this.fullscreenFileView.show(FExtensions.ediFileListToViewModel(data), data.findIndex(x => x.thisPK == item.thisPK));
  }
  async downloadEDIFile(item: EDIUploadFileModel): Promise<void> {
    if (this.selectPrintPharma == null) {
      return;
    }
    this.setLoading();
    const ret = await FExtensions.tryCatchAsync(async() => await this.commonService.downloadFile(item.blobUrl),
      e => this.fDialogService.error("downloadFile", e));
    try {
      if (ret && ret.body) {
        const filename = `${this.getApplyDate()}_${this.uploadModel.orgName}_${this.selectPrintPharma.orgName}`;
        const blob = await FExtensions.blobAddText(ret.body, filename, item.mimeType, this.addTextOptionMerge());
        saveAs(blob, `${FExtensions.ableFilename(filename)}.${FExtensions.getMimeTypeExt(item.mimeType)}`);
      }
    } catch (e: any) {
      this.fDialogService.warn("download", e?.message?.toString());
    }
    this.setLoading(false);
  }
  async removeEDIFile(item: EDIUploadFileModel): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.deleteEDIFile(item.thisPK),
      e => this.fDialogService.error("delete", e));
    this.setLoading(false);
    if (ret.result) {
      const index = this.uploadModel.fileList.indexOf(item);
      if (index == this.uploadModel.fileList.length - 1) {
        if (this.uploadModel.fileList.length - 1 > 0) {
          this.activeIndex = this.uploadModel.fileList.length - 2;
        } else {
          this.activeIndex = 0;
        }
      }
      if (index >= 0) {
        this.uploadModel.fileList = [...this.uploadModel.fileList.filter(x => x.thisPK != item.thisPK)];
      }
      return;
    }
    this.fDialogService.warn("delete", ret.msg);
  }
  async imageModify(): Promise<void> {
    if (this.selectPrintPharma == null) {
      return;
    }
    const buff = this.uploadModel.fileList.filter(x => FExtensions.isImageMimeType(x.mimeType));
    const filename = `${this.getApplyDate()}_${this.uploadModel.orgName}_${this.selectPrintPharma.orgName}`;
    await this.imageModifyView.show(FExtensions.ediFileListToViewModel(buff), filename, this.addTextOptionMerge());
  }
  async allDownload(): Promise<void> {
    if (this.selectPrintPharma == null) {
      return;
    }
    this.setLoading();
    for (const item of this.uploadModel.fileList) {
      const ret = await FExtensions.tryCatchAsync(async() => await this.commonService.downloadFile(item.blobUrl),
        e => this.fDialogService.error("downloadFile", e));
      try {
        if (ret && ret.body) {
          const filename = `${this.getApplyDate()}_${this.uploadModel.orgName}_${this.selectPrintPharma.orgName}`;
          const blob = await FExtensions.blobAddText(ret.body, filename, item.mimeType, this.addTextOptionMerge());
          saveAs(blob, `${FExtensions.ableFilename(filename)}.${FExtensions.getMimeTypeExt(item.mimeType)}`);
        }
      } catch (e: any) {
        this.fDialogService.warn("download", e?.message?.toString());
      }
    }
    this.setLoading(false);
  }
  addTextOptionMerge(): AddTextOptionModel {
    return FExtensions.applyClass(AddTextOptionModel, obj => {
      obj.textPosition = DescToTextPosition[this.selectTextPosition];
      obj.fontSize = this.fontSize;
      obj.textBackground = FExtensions.hexColorWithAlpha(this.backColor, 127);
      obj.textColor = FExtensions.hexColorWithAlpha(this.textColor, 255);
    });
  }

  get downloadFileTooltip(): string {
    return "common-desc.save";
  }
  get removeFileTooltip(): string {
    return "common-desc.remove";
  }
  get textColorTooltip(): string {
    return "common-desc.text-color";
  }
  get imageModifyVisible(): boolean {
    return this.uploadModel.fileList.filter(x => FExtensions.isImageMimeType(x.mimeType)).length > 0;
  }
  get imageModifyDisable(): boolean {
    return this.selectPrintPharma == null;
  }
  protected readonly dateToYYYYMMdd = FExtensions.dateToYYYYMMdd
  protected readonly ellipsis = FExtensions.ellipsis;
  protected readonly getEDIStateSeverity = FExtensions.getEDIStateSeverity;
  protected readonly galleriaContainerStyle = FConstants.galleriaContainerStyle;
  protected readonly tableStyle = FConstants.tableStyle;
  protected readonly allTextPositionDesc = allTextPositionDesc;
}
