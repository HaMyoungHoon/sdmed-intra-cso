import {Component, ElementRef, input, ViewChild} from "@angular/core";
import {FDialogComponentBase} from "../../../../guards/f-dialog-component-base";
import {QnaListService} from "../../../../services/rest/qna-list.service";
import {DashboardService} from "../../../../services/rest/dashboard.service";
import {UserRole} from "../../../../models/rest/user/user-role";
import {RequestModel} from "../../../../models/rest/requst/request-model";
import {QnAHeaderModel} from "../../../../models/rest/qna/qna-header-model";
import {QnAContentModel} from "../../../../models/rest/qna/qna-content-model";
import {QnAReplyModel} from "../../../../models/rest/qna/qna-reply-model";
import {UploadFileBuffModel} from "../../../../models/common/upload-file-buff-model";
import * as FExtensions from "../../../../guards/f-extensions";
import {QnAFileModel} from "../../../../models/rest/qna/qna-file-model";
import {QnAState} from "../../../../models/rest/qna/qna-state";
import {Editor, EditorTextChangeEvent} from "primeng/editor";
import {transformToBoolean} from "primeng/utils";
import * as FConstants from "../../../../guards/f-constants";
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from "primeng/accordion";
import {Button} from "primeng/button";
import {Card} from "primeng/card";
import {GalleriaModule} from "primeng/galleria";
import {NgForOf, NgIf} from "@angular/common";
import {PrimeTemplate} from "primeng/api";
import {ProgressSpinComponent} from "../../progress-spin/progress-spin.component";
import {SafeHtmlPipe} from "../../../../guards/safe-html.pipe";
import {Tag} from "primeng/tag";
import {Tooltip} from "primeng/tooltip";
import {TranslatePipe} from "@ngx-translate/core";
import {FormsModule} from "@angular/forms";
import {FullscreenFileViewComponent} from "../../fullscreen-file-view/fullscreen-file-view.component";
import {QnAReplyFileModel} from "../../../../models/rest/qna/qna-reply-file-model";
import {saveAs} from "file-saver";
import * as FImageCache from "../../../../guards/f-image-cache";
import {HttpResponse} from "@angular/common/http";

@Component({
  selector: "app-qna-view-dialog",
  imports: [Accordion, AccordionContent, AccordionHeader, AccordionPanel, Button, Card, Editor, GalleriaModule, NgForOf, NgIf, PrimeTemplate, ProgressSpinComponent, SafeHtmlPipe, Tag, Tooltip, TranslatePipe, FormsModule, FullscreenFileViewComponent],
  templateUrl: "./qna-view-dialog.component.html",
  styleUrl: "./qna-view-dialog.component.scss",
  standalone: true
})
export class QnaViewDialogComponent extends FDialogComponentBase {
  @ViewChild("inputFiles") inputFiles!: ElementRef<HTMLInputElement>;
  @ViewChild("fullscreenFileView") fullscreenFileView!: FullscreenFileViewComponent;
  thisPK: string;
  requestModel?: RequestModel;
  qnaHeaderModel: QnAHeaderModel = new QnAHeaderModel();
  qnaContentModel: QnAContentModel = new QnAContentModel();
  qnaReplyModel: QnAReplyModel = new QnAReplyModel();
  accordionValue = ["0"];
  content: string = "";
  htmlValue: string = "";
  saveAble: boolean = false;
  uploadFileBuffModel: UploadFileBuffModel[] = [];
  activeIndex: number = 0;
  imageCacheUrl: {blobUrl: string, objectUrl: string}[] = [];
  constructor(private thisService: QnaListService, private dashboardService: DashboardService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.Employee));
    const dlg = this.dialogService.getInstance(this.ref);
    this.thisPK = dlg.data;
  }

  override async ngInit(): Promise<void> {
    await this.refreshData();
  }
  override async ngDestroy(): Promise<void> {
    this.imageCacheClear();
  }
  layoutInit(): void {
    this.qnaReplyModel = new QnAReplyModel();
    this.content = "";
    this.uploadFileBuffModel = [];
  }

  async refreshData(): Promise<void> {
    this.setLoading();
    this.layoutInit();
    await this.getReqModel();
    await this.getHeader();
    this.setLoading(false);
  }

  async getReqModel(): Promise<void> {
    const ret = await FExtensions.restTry(async() => this.dashboardService.getRequestData(this.thisPK),
      e => this.fDialogService.error("getReqModel", e));
    if (ret.result) {
      this.requestModel = ret.data;
      return;
    }
    this.fDialogService.warn("getReqModel", ret.msg);
  }
  async getHeader(): Promise<void> {
    const ret = await FExtensions.restTry(async() => await this.thisService.getHeaderData(this.thisPK),
      e => this.fDialogService.error("getHeader", e));
    if (ret.result) {
      this.qnaHeaderModel = ret.data ?? new QnAHeaderModel();
      await this.getContent();
      return;
    }
    this.fDialogService.warn("getHeader", ret.msg);
  }
  async getContent(): Promise<void> {
    const ret = await FExtensions.restTry(async() => await this.thisService.getContentData(this.thisPK),
      e => this.fDialogService.error("getContent", e));
    if (ret.result) {
      this.qnaContentModel = ret.data ?? new QnAContentModel();
      this.accordionValue = [`${this.qnaContentModel.replyList.length - 1}`];
      await this.readyImage();
      return;
    }
    this.fDialogService.warn("getContent", ret.msg);
  }

  imageCacheClear(): void {
    this.imageCacheUrl.forEach(x => {
      URL.revokeObjectURL(x.objectUrl);
    });
    this.imageCacheUrl = [];
  }
  async readyImage(): Promise<void> {
    this.imageCacheClear();
    for (let qnaFile of this.qnaContentModel.fileList) {
      const ext = FExtensions.getExtMimeType(qnaFile.mimeType);
      if (!FExtensions.isImage(ext)) {
        this.imageCacheUrl.push({
          blobUrl: qnaFile.blobUrl,
          objectUrl: FExtensions.extToBlobUrl(ext)
        });
      } else {
        let blobBuff = await FImageCache.getImage(qnaFile.blobUrl);
        if (blobBuff == undefined) {
          const ret: HttpResponse<Blob> | null = await FExtensions.tryCatchAsync(async (): Promise<HttpResponse<Blob>> => await this.commonService.downloadFile(qnaFile.blobUrl),
            e => this.fDialogService.error("downloadFile", e));
          if (ret && ret.body) {
            blobBuff = ret.body;
            await FImageCache.putImage(qnaFile.blobUrl, blobBuff);
          } else {
            this.imageCacheUrl.push({
              blobUrl: qnaFile.blobUrl,
              objectUrl: FConstants.ASSETS_NO_IMAGE
            });
            continue;
          }
        }
        this.imageCacheUrl.push({
          blobUrl: qnaFile.blobUrl,
          objectUrl: URL.createObjectURL(blobBuff)
        });
      }
    }
    for (let reply of this.qnaContentModel.replyList) {
      for (let qnaFile of reply.fileList) {
        const ext = FExtensions.getExtMimeType(qnaFile.mimeType);
        if (!FExtensions.isImage(ext)) {
          this.imageCacheUrl.push({
            blobUrl: qnaFile.blobUrl,
            objectUrl: FExtensions.extToBlobUrl(ext)
          });
        } else {
          let blobBuff = await FImageCache.getImage(qnaFile.blobUrl);
          if (blobBuff == undefined) {
            const ret: HttpResponse<Blob> | null = await FExtensions.tryCatchAsync(async (): Promise<HttpResponse<Blob>> => await this.commonService.downloadFile(qnaFile.blobUrl),
              e => this.fDialogService.error("downloadFile", e));
            if (ret && ret.body) {
              blobBuff = ret.body;
              await FImageCache.putImage(qnaFile.blobUrl, blobBuff);
            } else {
              this.imageCacheUrl.push({
                blobUrl: qnaFile.blobUrl,
                objectUrl: FConstants.ASSETS_NO_IMAGE
              });
              continue;
            }
          }
          this.imageCacheUrl.push({
            blobUrl: qnaFile.blobUrl,
            objectUrl: URL.createObjectURL(blobBuff)
          });
        }
      }
    }
  }

  async downloadFile(item: QnAFileModel): Promise<void> {
    let blobBuff = await FImageCache.getImage(item.blobUrl);
    if (blobBuff == undefined) {
      const ret = await FExtensions.tryCatchAsync(async() => await this.commonService.downloadFile(item.blobUrl),
        e => this.fDialogService.error("downloadFile", e));
      if (ret && ret.body) {
        blobBuff = ret.body;
        await FImageCache.putImage(item.blobUrl, blobBuff);
      }
    }
    if (blobBuff) {
      saveAs(blobBuff, item.originalFilename);
    }
  }
  async downloadReplyFile(item: QnAReplyFileModel): Promise<void> {
    let blobBuff = await FImageCache.getImage(item.blobUrl);
    if (blobBuff == undefined) {
      const ret = await FExtensions.tryCatchAsync(async() => await this.commonService.downloadFile(item.blobUrl),
        e => this.fDialogService.error("downloadFile", e));
      if (ret && ret.body) {
        blobBuff = ret.body;
        await FImageCache.putImage(item.blobUrl, blobBuff);
      }
    }
    if (blobBuff) {
      saveAs(blobBuff, item.originalFilename);
    }
  }

  getBlobUrl(item: QnAFileModel): string {
    return this.imageCacheUrl.find(x => x.blobUrl == item.blobUrl)?.objectUrl ?? FConstants.ASSETS_NO_IMAGE;
  }
  async viewItem(data: QnAFileModel[], item: QnAFileModel): Promise<void> {
    await this.fullscreenFileView.show(FExtensions.qnaFileListToViewModel(data), data.findIndex(x => x.thisPK == item.thisPK));
  }
  async viewReplyItem(data: QnAReplyFileModel[], item: QnAReplyFileModel): Promise<void> {
    await this.fullscreenFileView.show(FExtensions.qnaReplyFileListToViewModel(data), data.findIndex(x => x.thisPK == item.thisPK));
  }

  get canReply(): boolean {
    return this.qnaHeaderModel.qnaState != QnAState.OK;
  }
  async mqttSend(userPK: string | undefined, thisPK: string | undefined, content: string | undefined): Promise<void> {
    if (userPK == undefined || thisPK == undefined || content == undefined) {
      return;
    }
    const ret = await FExtensions.restTry(async() => this.mqttService.postQnA(userPK, thisPK, content));
//      e => this.fDialogService.warn("notice", e));
//    if (ret.result) {
//      return;
//    }
//    this.fDialogService.warn("notice", ret.msg);
  }
  async saveReplyData(): Promise<void> {
    this.qnaReplyModel = new QnAReplyModel();
    this.qnaReplyModel.content = this.htmlValue;
    this.setLoading();
    let fileRet = await this.uploadAzure();
    if (!fileRet) {
      this.setLoading(false);
      return;
    }

    let uploadRet = await this.qnaUpload();
    if (!uploadRet) {
      this.setLoading(false);
      return;
    }
    this.uploadFileBuffModel.forEach(x => x.revokeBlob());

    this.setLoading(false);
  }
  async uploadAzure(): Promise<boolean> {
    const thisPK = this.requestModel?.requestItemPK;
    if (thisPK == null) {
      return false;
    }

    let ret = true;
    for (const buff of this.uploadFileBuffModel) {
      const blobName = FExtensions.getQnAReplyBlobName(buff.ext);
      const blobStorageInfo = await FExtensions.restTry(async() => await this.commonService.getGenerateSas(blobName),
        e => this.fDialogService.error("saveData", e));
      if (!blobStorageInfo.result) {
        this.fDialogService.warn("saveData", blobStorageInfo.msg);
        ret = false;
        break;
      }
      const qnaFileModel = FExtensions.getQnAReplyPostFileModel(buff.file!!, thisPK, blobStorageInfo.data!!, blobName, buff.ext, buff.mimeType);
      await FExtensions.tryCatchAsync(async() => await this.azureBlobService.putUpload(buff.file!!, blobStorageInfo.data, qnaFileModel.blobName, qnaFileModel.mimeType),
        e => {
          this.fDialogService.error("saveData", e);
          ret = false;
        });
      if (!ret) {
        break;
      }
      this.qnaReplyModel.fileList.push(qnaFileModel);
    }

    return ret;
  }
  async qnaUpload(): Promise<boolean> {
    const thisPK = this.requestModel?.requestItemPK;
    if (thisPK == null) {
      return false;
    }

    const ret = await FExtensions.restTry(async() => await this.thisService.postReply(thisPK, this.qnaReplyModel),
      e => this.fDialogService.error("saveData", e));
    if (ret.result) {
      await this.refreshData();
      await this.mqttSend(this.qnaHeaderModel.userPK, this.qnaHeaderModel.thisPK, `${ret.data?.name}\n${this.qnaHeaderModel.title}`);
      return true;
    }

    this.fDialogService.warn("saveData", ret.msg);
    return false;
  }


  quillOnInit(_: any): void {
    const quill = document.getElementById("quillEditor")?.getElementsByClassName("ql-image");
    if (quill == undefined || quill.length <= 0) {
      return;
    }
    quill[0].remove();
  }
  editorChange(data: EditorTextChangeEvent): void {
    this.htmlValue = data.htmlValue;
    this.checkSavable();
  }
  checkSavable(): void {
    if (this.htmlValue.length <= 0) {
      this.saveAble = false;
      return;
    }

    this.saveAble = true;
  }
  async fileUpload(): Promise<void> {
    this.inputFiles.nativeElement.click();
  }
  async fileSelected(data: Event): Promise<void> {
    const input = data.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.setLoading();
      const gatheringFile = (await FExtensions.gatheringAbleFile(input.files, (file: File): void => {
        this.translateService.get("common-desc.not-supported-file").subscribe(x => {
          this.fDialogService.warn("fileUpload", `${file.name} ${x}`);
        });
      })).filter(x => !!x.file);
      if (gatheringFile.length > 0) {
        this.uploadFileBuffModel = this.uploadFileBuffModel.concat(gatheringFile);
        this.uploadFileBuffModel = FExtensions.distinctByFields(this.uploadFileBuffModel, ["file.name", "file.size"]);
      }
      this.inputFiles.nativeElement.value = "";
      this.checkSavable();

      this.setLoading(false);
    }
  }

  get acceptFiles(): string {
    return ".jpg,.jpeg,.png,.webp,.bmp,.xlsx,.pdf,.heif,.heic,.gif";
  }

  deleteUploadFile(data: UploadFileBuffModel): void {
    const index = this.uploadFileBuffModel.indexOf(data);
    if (index == this.uploadFileBuffModel.length - 1) {
      if (this.uploadFileBuffModel.length - 1 > 0) {
        this.activeIndex = this.uploadFileBuffModel.length - 2;
      } else {
        this.activeIndex = 0;
      }
    }

    if (index >= 0) {
      data.revokeBlob();
      this.uploadFileBuffModel.splice(index, 1);
    }
  }

  multipleEnable = input(true, { transform: (v: any) => transformToBoolean(v) });
  accordionIndex(item: QnAReplyModel): string {
    return `${this.qnaContentModel.replyList.findIndex(x => x.thisPK == item.thisPK)}`;
  }

  get downloadFileTooltip(): string {
    return "common-desc.save";
  }
  get removeFileTooltip(): string {
    return "common-desc.remove";
  }

  protected readonly dateToYYYYMMdd = FExtensions.dateToYYYYMMdd;
  protected readonly getQnAStateSeverity = FExtensions.getQnAStateSeverity;
  protected readonly ellipsis = FExtensions.ellipsis;

  protected readonly galleriaContainerStyle = FConstants.galleriaContainerStyle;
}
