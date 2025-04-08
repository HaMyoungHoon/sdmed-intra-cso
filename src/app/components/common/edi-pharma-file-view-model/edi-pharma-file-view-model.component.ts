import {Component, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {FullscreenFileViewComponent} from "../fullscreen-file-view/fullscreen-file-view.component";
import {ImageModifyViewComponent} from "../image-modify-view/image-modify-view.component";
import {Button} from "primeng/button";
import {ContextMenu} from "primeng/contextmenu";
import {GalleriaModule} from "primeng/galleria";
import {MenuItem, MenuItemCommandEvent, PrimeTemplate} from "primeng/api";
import {Ripple} from "primeng/ripple";
import {Tooltip} from "primeng/tooltip";
import {TranslatePipe} from "@ngx-translate/core";
import {allTextPositionDesc, DescToTextPosition, TextPosition, TextPositionToTextPositionDesc} from "../../../models/common/text-position";
import {ColorPicker} from "primeng/colorpicker";
import {IftaLabel} from "primeng/iftalabel";
import {InputText} from "primeng/inputtext";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Select} from "primeng/select";
import * as FExtensions from "../../../guards/f-extensions";
import * as FConstants from "../../../guards/f-constants";
import {EDIUploadPharmaModel} from "../../../models/rest/edi/edi-upload-pharma-model";
import {AddTextOptionModel} from "../../../models/common/add-text-option-model";
import * as FImageCache from "../../../guards/f-image-cache";
import {CommonService} from "../../../services/rest/common.service";
import {EDIUploadPharmaFileModel} from "../../../models/rest/edi/edi-upload-pharma-file-model";
import {HttpResponse} from "@angular/common/http";

@Component({
  selector: "app-edi-pharma-file-view-model",
  imports: [FullscreenFileViewComponent, ImageModifyViewComponent, Button, ContextMenu, GalleriaModule, PrimeTemplate, Ripple, Tooltip, TranslatePipe, ColorPicker, IftaLabel, InputText, ReactiveFormsModule, Select, FormsModule],
  templateUrl: "./edi-pharma-file-view-model.component.html",
  styleUrl: "./edi-pharma-file-view-model.component.scss",
  standalone: true,
})
export class EdiPharmaFileViewModelComponent {
  @ViewChild("fullscreenFileView") fullscreenFileView!: FullscreenFileViewComponent;
  @ViewChild("imageModifyView") imageModifyView!: ImageModifyViewComponent;
  @Input() applyDate: string = "";
  @Input() hospitalName: string = "";
  @Input() pharmaModel: EDIUploadPharmaModel = new EDIUploadPharmaModel();
  @Output() error: EventEmitter<{title: string, msg?: string}> = new EventEmitter();
  @Output() warn: EventEmitter<{title: string, msg?: string}> = new EventEmitter();
  @Output() removeFileEvent: EventEmitter<EDIUploadPharmaFileModel> = new EventEmitter();
  @Output() downloadFileEvent: EventEmitter<{pharmaName: string, item: EDIUploadPharmaFileModel, withWatermark: boolean}> = new EventEmitter();
  fontSize: number = 0;
  backColor: string = "#FFFFFF";
  textColor: string = "#000000";
  selectTextPosition: string = TextPositionToTextPositionDesc[TextPosition.LT];
  contextPharmaMenu: MenuItem[] = [];
  activeIndex: number = 0;
  isLoading: boolean = false;
  imageCacheUrl: {blobUrl: string, objectUrl: string}[] = [];
  constructor() {
  }
  tossError(data: {title: string, msg?: string}): void {
    this.error.next({title: data.title, msg: data.msg});
  }
  tossWarn(data: {title: string, msg?: string}): void {
    this.warn.next({title: data.title, msg: data.msg});
  }
  onError(title: string, msg?: string): void {
    this.error.next({title: title, msg: msg});
  }
  onWarn(title: string, msg?: string): void {
    this.warn.next({title: title, msg: msg});
  }
  setLoading(data: boolean = true): void {
    this.isLoading = data;
  }
  getBlobUrl(item: EDIUploadPharmaFileModel): string {
    return this.imageCacheUrl.find(x => x.blobUrl == item.blobUrl)?.objectUrl ?? FConstants.ASSETS_NO_IMAGE;
  }
  contextPharmaMenuOnShow(): void {
    this.initPharmaMenu();
  }
  initPharmaMenu(): void {
    this.contextPharmaMenu = [
      {
        label: "edi-view.image-modify",
        icon: "pi pi-wrench",
        command: async(_: MenuItemCommandEvent): Promise<void> => {
          await this.pharmaImageModify();
        },
        visible: this.pharmaImageModifyVisible(),
      },
      {
        separator: true,
        visible: this.pharmaImageModifyVisible(),
      },
      {
        label: "edi-view.all-download-with-watermark",
        icon: "pi pi-download",
        command: async(_: MenuItemCommandEvent): Promise<void> => {
          await this.allPharmaDownload(true);
        },
      },
      {
        label: "edi-view.all-download-without-watermark",
        icon: "pi pi-download",
        command: async(_: MenuItemCommandEvent): Promise<void> => {
          await this.allPharmaDownload(false);
        },
      },
      {
        separator: true
      },
      {
        label: "edi-view.download-with-watermark",
        icon: "pi pi-download",
        command: async(_: MenuItemCommandEvent): Promise<void> => {
          await this.downloadEDIPharmaFile(true);
        },
      },
      {
        label: "edi-view.download-without-watermark",
        icon: "pi pi-download",
        command: async(_: MenuItemCommandEvent): Promise<void> => {
          await this.downloadEDIPharmaFile(false);
        },
      },
    ]
  }
  imageCacheClear(): void {
    this.imageCacheUrl.forEach(x => {
      URL.revokeObjectURL(x.objectUrl);
    });
    this.imageCacheUrl = [];
  }
  async readyImage(commonService: CommonService): Promise<void> {
    this.imageCacheClear();
    for (let pharmaFile of this.pharmaModel.fileList) {
      const ext = FExtensions.getExtMimeType(pharmaFile.mimeType);
      if (!FExtensions.isImage(ext)) {
        this.imageCacheUrl.push({
          blobUrl: pharmaFile.blobUrl,
          objectUrl: FExtensions.extToBlobUrl(ext)
        });
      } else {
        let blobBuff = await FImageCache.getImage(pharmaFile.blobUrl);
        if (blobBuff == undefined) {
          const ret: HttpResponse<Blob> | null = await FExtensions.tryCatchAsync(async (): Promise<HttpResponse<Blob>> => await commonService.downloadFile(pharmaFile.blobUrl),
            e => this.onError("downloadFile", e));
          if (ret && ret.body) {
            blobBuff = ret.body;
            await FImageCache.putImage(pharmaFile.blobUrl, blobBuff);
          } else {
            this.imageCacheUrl.push({
              blobUrl: pharmaFile.blobUrl,
              objectUrl: FConstants.ASSETS_NO_IMAGE
            });
            continue;
          }
        }
        this.imageCacheUrl.push({
          blobUrl: pharmaFile.blobUrl,
          objectUrl: URL.createObjectURL(blobBuff)
        });
      }
    }
  }

  async pharmaImageModify(): Promise<void> {
    const pharmaName = this.pharmaModel.orgName;
    const buff = this.pharmaModel.fileList.filter(x => FExtensions.isImageMimeType(x.mimeType));
    const filename = `${this.applyDate}_${this.hospitalName}_${pharmaName}`;
    await this.imageModifyView.show(FExtensions.ediPharmaFileListToViewModel(buff), filename, this.addTextOptionMerge());
  }
  pharmaImageModifyVisible(): boolean {
    return this.pharmaModel.fileList.filter(x => FExtensions.isImageMimeType(x.mimeType)).length > 0;
  }
  async allPharmaDownload(withWatermark: boolean = true): Promise<void> {
    for (const item of this.pharmaModel.fileList) {
      await this.downloadPharmaImageFile(item, withWatermark);
    }
  }
  async downloadEDIPharmaFile(withWatermark: boolean = true): Promise<void> {
    const item = this.pharmaModel.fileList[this.activeIndex];
    this.downloadFileEvent.next({pharmaName: this.pharmaModel.orgName, item: item, withWatermark: withWatermark});
  }
  async downloadPharmaImageFile(item: EDIUploadPharmaFileModel, withWatermark: boolean = true): Promise<void> {
    this.downloadFileEvent.next({pharmaName: this.pharmaModel.orgName, item: item, withWatermark: withWatermark});
  }
  async viewEDIPharmaItem(data: EDIUploadPharmaFileModel[], item: EDIUploadPharmaFileModel): Promise<void> {
    await this.fullscreenFileView.show(FExtensions.ediPharmaFileListToViewModel(data), data.findIndex(x => x.thisPK == item.thisPK));
  }
  async removeEDIPharmaFile(): Promise<void> {
    const item = this.pharmaModel.fileList[this.activeIndex];
    this.removeFileEvent.next(item);
    const index = this.pharmaModel.fileList.indexOf(item);
    if (index == this.pharmaModel.fileList.length - 1) {
      if (this.pharmaModel.fileList.length - 1 > 0) {
        this.activeIndex = this.pharmaModel.fileList.length - 2;
      } else {
        this.activeIndex = 0;
      }
    }
    this.pharmaModel.fileList = [...this.pharmaModel.fileList.filter(x => x.thisPK != item.thisPK)];
  }

  addTextOptionMerge(): AddTextOptionModel {
    return FExtensions.applyClass(AddTextOptionModel, obj => {
      obj.textPosition = DescToTextPosition[this.selectTextPosition];
      obj.fontSize = this.fontSize;
      obj.textBackground = FExtensions.hexColorWithAlpha(this.backColor, 127);
      obj.textColor = FExtensions.hexColorWithAlpha(this.textColor, 255);
    });
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

  protected readonly dateToYYYYMMdd = FExtensions.dateToYYYYMMdd
  protected readonly ellipsis = FExtensions.ellipsis;
  protected readonly getEDIStateSeverity = FExtensions.getEDIStateSeverity;
  protected readonly galleriaContainerStyle = FConstants.galleriaContainerStyle;
  protected readonly tableStyle = FConstants.tableStyle;
  protected readonly allTextPositionDesc = allTextPositionDesc;
}
