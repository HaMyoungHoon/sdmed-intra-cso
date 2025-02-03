import {Component, input, ViewChild} from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {EdiListService} from "../../../../services/rest/edi-list.service";
import {ActivatedRoute} from "@angular/router";
import * as FExtensions from "../../../../guards/f-extensions";
import * as FConstants from "../../../../guards/f-constants";
import {EDIUploadModel} from "../../../../models/rest/edi/edi-upload-model";
import {EDIUploadPharmaModel} from "../../../../models/rest/edi/edi-upload-pharma-model";
import {transformToBoolean} from "primeng/utils";
import {EDIUploadPharmaMedicineModel} from "../../../../models/rest/edi/edi-upload-pharma-medicine-model";
import {EDIUploadFileModel} from "../../../../models/rest/edi/edi-upload-file-model";
import {FullscreenFileViewComponent} from "../../../common/fullscreen-file-view/fullscreen-file-view.component";
import {saveAs} from "file-saver";
import {EDIState} from "../../../../models/rest/edi/edi-state";
import {UserRole} from "../../../../models/rest/user/user-role";
import {Subject, takeUntil} from "rxjs";
import {EDIUploadResponseModel} from "../../../../models/rest/edi/edi-upload-response-model";
import {
  allTextPositionDesc,
  DescToTextPosition,
  TextPosition,
  TextPositionToTextPositionDesc
} from "../../../../models/common/text-position";
import {AddTextOptionModel} from "../../../../models/common/add-text-option-model";
import {ImageModifyViewComponent} from "../../../common/image-modify-view/image-modify-view.component";
import {hexColorWithAlpha} from "../../../../guards/f-extensions";
import {MenuItem, MenuItemCommandEvent} from "primeng/api";

@Component({
  selector: "app-edi-view",
  templateUrl: "./edi-view.component.html",
  styleUrl: "./edi-view.component.scss",
  standalone: false,
})
export class EdiViewComponent extends FComponentBase {
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
  constructor(private thisService: EdiListService, private route: ActivatedRoute) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.EdiChanger));
    this.thisPK = this.route.snapshot.params["thisPK"];
  }

  override async ngInit(): Promise<void> {
    this.subscribeRouter();
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
  subscribeRouter(): void {
    const sub = new Subject<any>();
    this.sub.push(sub);
    this.route.params.pipe(takeUntil(sub)).subscribe(async(x) => {
      this.thisPK = x["thisPK"];
      await this.getData();
    });
  }

  async getData(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getData(this.thisPK),
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
    const ext = FExtensions.getExtMimeType(item.mimeType);
    if (FExtensions.isImage(ext)) {
      return item.blobUrl;
    }
    return FExtensions.extToBlobUrl(ext);
  }
  async viewEDIItem(data: EDIUploadFileModel[], item: EDIUploadFileModel): Promise<void> {
    await this.fullscreenFileView.show(FExtensions.ediFileListToViewModel(data), data.findIndex(x => x.thisPK == item.thisPK));
  }
  async downloadEDIFile(item: EDIUploadFileModel, withWatermark: boolean = true): Promise<void> {
    const pharmaName = this.selectPrintPharma?.orgName ?? this.uploadModel.etc;
    this.setLoading();
    const ret = await FExtensions.tryCatchAsync(async() => await this.commonService.downloadFile(item.blobUrl),
      e => this.fDialogService.error("downloadFile", e));
    try {
      if (ret && ret.body) {
        const filename = `${this.getApplyDate()}_${this.uploadModel.orgName}_${pharmaName}`;
        const blob = withWatermark ? await FExtensions.blobAddText(ret.body, filename, item.mimeType, this.addTextOptionMerge()) : ret.body;
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
    const pharmaName = this.selectPrintPharma?.orgName ?? this.uploadModel.etc;
    const buff = this.uploadModel.fileList.filter(x => FExtensions.isImageMimeType(x.mimeType));
    const filename = `${this.getApplyDate()}_${this.uploadModel.orgName}_${pharmaName}`;
    await this.imageModifyView.show(FExtensions.ediFileListToViewModel(buff), filename, this.addTextOptionMerge());
  }
  async allDownload(withWatermark: boolean = true): Promise<void> {
    const pharmaName = this.selectPrintPharma?.orgName ?? this.uploadModel.etc;
    this.setLoading();
    for (const item of this.uploadModel.fileList) {
      const ret = await FExtensions.tryCatchAsync(async() => await this.commonService.downloadFile(item.blobUrl),
        e => this.fDialogService.error("downloadFile", e));
      try {
        if (ret && ret.body) {
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
  protected readonly dateToYYYYMMdd = FExtensions.dateToYYYYMMdd
  protected readonly ellipsis = FExtensions.ellipsis;
  protected readonly getEDIStateSeverity = FExtensions.getEDIStateSeverity;
  protected readonly galleriaContainerStyle = FConstants.galleriaContainerStyle;
  protected readonly tableStyle = FConstants.tableStyle;
  protected readonly allTextPositionDesc = allTextPositionDesc;
}
