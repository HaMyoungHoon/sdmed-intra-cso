import {Component, input, ViewChild} from "@angular/core";
import {FDialogComponentBase} from "../../../../guards/f-dialog-component-base";
import {UserRole} from "../../../../models/rest/user/user-role";
import {EdiListService} from "../../../../services/rest/edi-list.service";
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from "primeng/accordion";
import {Button} from "primeng/button";
import {FormsModule} from "@angular/forms";
import {FullscreenFileViewComponent} from "../../fullscreen-file-view/fullscreen-file-view.component";
import {GalleriaModule} from "primeng/galleria";
import {NgForOf, NgIf} from "@angular/common";
import {MenuItem, MenuItemCommandEvent, PrimeTemplate} from "primeng/api";
import {ProgressSpinComponent} from "../../progress-spin/progress-spin.component";
import {TableModule} from "primeng/table";
import {Tag} from "primeng/tag";
import {Tooltip} from "primeng/tooltip";
import {TranslatePipe} from "@ngx-translate/core";
import {EDIUploadModel} from "../../../../models/rest/edi/edi-upload-model";
import {EDIState} from "../../../../models/rest/edi/edi-state";
import * as FExtensions from "../../../../guards/f-extensions";
import {EDIUploadPharmaModel} from "../../../../models/rest/edi/edi-upload-pharma-model";
import {EDIUploadPharmaMedicineModel} from "../../../../models/rest/edi/edi-upload-pharma-medicine-model";
import {transformToBoolean} from "primeng/utils";
import {EDIUploadFileModel} from "../../../../models/rest/edi/edi-upload-file-model";
import {saveAs} from "file-saver";
import * as FConstants from "../../../../guards/f-constants";
import {Textarea} from "primeng/textarea";
import {EDIUploadResponseModel} from "../../../../models/rest/edi/edi-upload-response-model";
import {Subject, takeUntil} from "rxjs";
import {Select} from "primeng/select";
import {allTextPositionDesc, DescToTextPosition, TextPosition, TextPositionToTextPositionDesc} from "../../../../models/common/text-position";
import {IftaLabel} from "primeng/iftalabel";
import {InputText} from "primeng/inputtext";
import {AddTextOptionModel} from "../../../../models/common/add-text-option-model";
import {ImageModifyViewComponent} from "../../image-modify-view/image-modify-view.component";
import {ContextMenu} from "primeng/contextmenu";
import {Ripple} from "primeng/ripple";
import * as FImageCache from "../../../../guards/f-image-cache";
import {HttpResponse} from "@angular/common/http";
import {ColorPicker} from "primeng/colorpicker";

@Component({
  selector: "app-edi-view-dialog",
  imports: [Accordion, AccordionContent, AccordionHeader, AccordionPanel, Button, FormsModule, FullscreenFileViewComponent, GalleriaModule, NgForOf, NgIf, PrimeTemplate, ProgressSpinComponent, TableModule, Tag, Tooltip, TranslatePipe, Textarea, Select, IftaLabel, InputText, ImageModifyViewComponent, ContextMenu, Ripple, ColorPicker
  ],
  templateUrl: "./edi-view-dialog.component.html",
  styleUrl: "./edi-view-dialog.component.scss",
  standalone: true,
})
export class EdiViewDialogComponent extends FDialogComponentBase {
  @ViewChild("fullscreenFileView") fullscreenFileView!: FullscreenFileViewComponent;
  @ViewChild("imageModifyView") imageModifyView!: ImageModifyViewComponent;
  thisPK: string = "";
  uploadModel: EDIUploadModel = new EDIUploadModel();
  pharmaStateList: string[] = [];
  fontSize: number = 0;
  activeIndex: number = 0;
  selectPrintPharma?: EDIUploadPharmaModel;
  selectTextPosition: string = TextPositionToTextPositionDesc[TextPosition.LT];
  backColor: string = "#FFFFFF";
  textColor: string = "#000000";
  contextMenu: MenuItem[] = [];
  imageCacheUrl: {blobUrl: string, objectUrl: string}[] = [];
  constructor(private thisService: EdiListService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.EdiChanger));
    const dlg = this.dialogService.getInstance(this.ref);
    this.thisPK = dlg.data;
  }

  override async ngInit(): Promise<void> {
    await this.getData();
  }
  override async ngDestroy(): Promise<void> {
    this.imageCacheClear();
  }
  onError(data: {title: string, msg: string}): void {
    this.fDialogService.error(data.title, data.msg);
  }
  contextMenuOnShow(): void {
    this.initMenu();
  }
  initMenu(): void {
    this.contextMenu = [
      {
        label: "edi-view.image-modify",
        icon: "pi pi-wrench",
        command: async(_: MenuItemCommandEvent): Promise<void> => {
          await this.imageModify();
        },
        disabled: this.imageModifyDisable,
        visible: this.imageModifyVisible,
      },
      {
        separator: true,
        visible: this.imageModifyVisible,
      },
      {
        label: "edi-view.all-download-with-watermark",
        icon: "pi pi-download",
        command: async(_: MenuItemCommandEvent): Promise<void> => {
          await this.allDownload(true);
        },
      },
      {
        label: "edi-view.all-download-without-watermark",
        icon: "pi pi-download",
        command: async(_: MenuItemCommandEvent): Promise<void> => {
          await this.allDownload(false);
        },
      },
      {
        separator: true
      },
      {
        label: "edi-view.download-with-watermark",
        icon: "pi pi-download",
        command: async(_: MenuItemCommandEvent): Promise<void> => {
          await this.downloadEDIFile(this.uploadModel.fileList[this.activeIndex], true);
        },
      },
      {
        label: "edi-view.download-without-watermark",
        icon: "pi pi-download",
        command: async(_: MenuItemCommandEvent): Promise<void> => {
          await this.downloadEDIFile(this.uploadModel.fileList[this.activeIndex], false);
        },
      },
    ]
  }

  async getData(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getData(this.thisPK),
      e => this.fDialogService.error("getData", e));
    if (ret.result) {
      this.uploadModel = ret.data ?? new EDIUploadModel();
      this.pharmaStateList = [...this.uploadModel.pharmaList.map(x => x.ediState)];
      if (this.uploadModel.pharmaList.length >= 1) {
        this.selectPrintPharma = this.uploadModel.pharmaList[0];
      }
      await this.readyImage();
      this.setLoading(false);
      return;
    }
    this.setLoading(false);
    this.fDialogService.warn("getData", ret.msg);
  }
  imageCacheClear(): void {
    this.imageCacheUrl.forEach(x => {
      URL.revokeObjectURL(x.objectUrl);
    });
    this.imageCacheUrl = [];
  }
  async readyImage(): Promise<void> {
    this.imageCacheClear();
    for (let ediFile of this.uploadModel.fileList) {
      const ext = FExtensions.getExtMimeType(ediFile.mimeType);
      if (!FExtensions.isImage(ext)) {
        this.imageCacheUrl.push({
          blobUrl: ediFile.blobUrl,
          objectUrl: FExtensions.extToBlobUrl(ext)
        });
      } else {
        let blobBuff = await FImageCache.getImage(ediFile.blobUrl);
        if (blobBuff == undefined) {
          const ret: HttpResponse<Blob> | null = await FExtensions.tryCatchAsync(async (): Promise<HttpResponse<Blob>> => await this.commonService.downloadFile(ediFile.blobUrl),
            e => this.fDialogService.error("downloadFile", e));
          if (ret && ret.body) {
            blobBuff = ret.body;
            await FImageCache.putImage(ediFile.blobUrl, blobBuff);
          } else {
            this.imageCacheUrl.push({
              blobUrl: ediFile.blobUrl,
              objectUrl: FConstants.ASSETS_NO_IMAGE
            });
            continue;
          }
        }
        this.imageCacheUrl.push({
          blobUrl: ediFile.blobUrl,
          objectUrl: URL.createObjectURL(blobBuff)
        });
      }
    }
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

  responseNewEDI(): void {
    const sub = new Subject<any>();
    this.sub.push(sub);
    this.fDialogService.openEDIResponseDialog({
      modal: true,
      closable: false,
      closeOnEscape: true,
      draggable: true,
      data: {
        edi: this.uploadModel,
      },
    }).pipe(takeUntil(sub)).subscribe(async (x): Promise<void> => {
      if (x == null) {
        return;
      }
      await this.getData();
    });
  }
  newEDIModifyDisable(): boolean {
    if (this.uploadModel.ediState == EDIState.OK || this.uploadModel.ediState == EDIState.Reject) {
      return true;
    }

    return this.uploadModel.etc.length <= 0;
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
      data: {
        pharma: pharma,
      },
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
    return this.imageCacheUrl.find(x => x.blobUrl == item.blobUrl)?.objectUrl ?? FConstants.ASSETS_NO_IMAGE;
  }
  async viewEDIItem(data: EDIUploadFileModel[], item: EDIUploadFileModel): Promise<void> {
    await this.fullscreenFileView.show(FExtensions.ediFileListToViewModel(data), data.findIndex(x => x.thisPK == item.thisPK));
  }
  async mqttSend(userPK: string | undefined, thisPK: string | undefined, content: string | undefined): Promise<void> {
    if (userPK == undefined || thisPK == undefined || content == undefined) {
      return;
    }
    const ret = await FExtensions.restTry(async() => this.mqttService.postEDIFileDelete(userPK, thisPK, content));
//      e => this.fDialogService.warn("notice", e));
//    if (ret.result) {
//      return;
//    }
//    this.fDialogService.warn("notice", ret.msg);
  }
  async downloadImageFile(item: EDIUploadFileModel, withWatermark: boolean = true): Promise<void> {
    const pharmaName = this.selectPrintPharma?.orgName ?? this.uploadModel.etc;
    let blobBuff = await FImageCache.getImage(item.blobUrl);
    if (blobBuff == undefined) {
      const ret = await FExtensions.tryCatchAsync(async() => await this.commonService.downloadFile(item.blobUrl),
        e => this.fDialogService.error("downloadFile", e));
      if (ret && ret.body) {
        blobBuff = ret.body;
        await FImageCache.putImage(item.blobUrl, blobBuff);
      } else {
        this.fDialogService.warn("download", "edi file download fail");
        return;
      }
    }
    try {
      const filename = `${this.getApplyDate()}_${this.uploadModel.orgName}_${pharmaName}`;
      const blob = withWatermark ? await FExtensions.blobAddText(blobBuff, filename, item.mimeType, this.addTextOptionMerge()) : blobBuff;
      saveAs(blob, `${FExtensions.ableFilename(filename)}.${FExtensions.getMimeTypeExt(item.mimeType)}`);
    } catch (e: any) {
      this.fDialogService.warn("download", e?.message?.toString());
    }
  }
  async downloadEDIFile(item: EDIUploadFileModel, withWatermark: boolean = true): Promise<void> {
    this.setLoading();
    const ext = FExtensions.getExtMimeType(item.mimeType);
    if (FExtensions.isImage(ext)) {
      await this.downloadImageFile(item);
    } else {
      const ret = await FExtensions.tryCatchAsync(async() => await this.commonService.downloadFile(item.blobUrl),
        e => this.fDialogService.error("downloadFile", e));
      try {
        if (ret && ret.body) {
          const pharmaName = this.selectPrintPharma?.orgName ?? this.uploadModel.etc;
          const filename = `${this.getApplyDate()}_${this.uploadModel.orgName}_${pharmaName}`;
          const blob = withWatermark ? await FExtensions.blobAddText(ret.body, filename, item.mimeType, this.addTextOptionMerge()) : ret.body;
          saveAs(blob, `${FExtensions.ableFilename(filename)}.${FExtensions.getMimeTypeExt(item.mimeType)}`);
        }
      } catch (e: any) {
        this.fDialogService.warn("download", e?.message?.toString());
      }
    }
    this.setLoading(false);
  }
  async removeEDIFile(item: EDIUploadFileModel): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.deleteEDIFile(item.thisPK),
      e => this.fDialogService.error("delete", e));
    this.setLoading(false);
    if (ret.result) {
      await this.mqttSend(this.uploadModel.userPK, this.uploadModel.thisPK, item.originalFilename);
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
    const pharmaName = this.selectPrintPharma?.orgName ?? this.uploadModel.etc;
    const buff = this.uploadModel.fileList.filter(x => FExtensions.isImageMimeType(x.mimeType));
    const filename = `${this.getApplyDate()}_${this.uploadModel.orgName}_${pharmaName}`;
    await this.imageModifyView.show(FExtensions.ediFileListToViewModel(buff), filename, this.addTextOptionMerge());
  }
  async allDownload(withWatermark: boolean = true): Promise<void> {
    this.setLoading();
    for (const item of this.uploadModel.fileList) {
      const ext = FExtensions.getExtMimeType(item.mimeType);
      if (FExtensions.isImage(ext)) {
        await this.downloadImageFile(item);
      } else {
        const ret = await FExtensions.tryCatchAsync(async () => await this.commonService.downloadFile(item.blobUrl),
          e => this.fDialogService.error("downloadFile", e));
        try {
          if (ret && ret.body) {
            const pharmaName = this.selectPrintPharma?.orgName ?? this.uploadModel.etc;
            const filename = `${this.getApplyDate()}_${this.uploadModel.orgName}_${pharmaName}`;
            const blob = withWatermark ? await FExtensions.blobAddText(ret.body, filename, item.mimeType, this.addTextOptionMerge()) : ret.body;
            saveAs(blob, `${FExtensions.ableFilename(filename)}.${FExtensions.getMimeTypeExt(item.mimeType)}`);
          }
        } catch (e: any) {
          this.fDialogService.warn("download", e?.message?.toString());
        }
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
  get backColorTooltip(): string {
    return "common-desc.back-color";
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
