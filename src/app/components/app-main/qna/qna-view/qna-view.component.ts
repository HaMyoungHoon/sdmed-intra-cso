import {Component, ElementRef, input, ViewChild} from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {RequestModel} from "../../../../models/rest/requst/request-model";
import {QnaListService} from "../../../../services/rest/qna-list.service";
import {UserRole} from "../../../../models/rest/user/user-role";
import {ActivatedRoute} from "@angular/router";
import * as FExtensions from "../../../../guards/f-extensions";
import * as FConstants from "../../../../guards/f-constants";
import * as FImageCache from "../../../../guards/f-image-cache";
import {QnAHeaderModel} from "../../../../models/rest/qna/qna-header-model";
import {QnAContentModel} from "../../../../models/rest/qna/qna-content-model";
import {DashboardService} from "../../../../services/rest/dashboard.service";
import {QnAState, StringToQnAStateDesc} from "../../../../models/rest/qna/qna-state";
import {QnAFileModel} from "../../../../models/rest/qna/qna-file-model";
import {transformToBoolean} from "primeng/utils";
import {QnAReplyModel} from "../../../../models/rest/qna/qna-reply-model";
import {EditorTextChangeEvent} from "primeng/editor";
import {UploadFileBuffModel} from "../../../../models/common/upload-file-buff-model";
import {FullscreenFileViewComponent} from "../../../common/fullscreen-file-view/fullscreen-file-view.component";
import {QnAReplyFileModel} from "../../../../models/rest/qna/qna-reply-file-model";
import {saveAs} from "file-saver";
import {Subject, takeUntil} from "rxjs";
import {HttpResponse} from "@angular/common/http";

@Component({
  selector: "app-qna-view",
  templateUrl: "./qna-view.component.html",
  styleUrl: "./qna-view.component.scss",
  standalone: false,
})
export class QnaViewComponent extends FComponentBase {
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
  replyActiveIndex: number[] = [];
  uploadActiveIndex: number = 0;
  imageCacheUrl: {blobUrl: string, objectUrl: string}[] = [];
  constructor(private thisService: QnaListService, private dashboardService: DashboardService, private route: ActivatedRoute) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.Employee));
    this.thisPK = this.route.snapshot.params["thisPK"];
  }

  override async ngInit(): Promise<void> {
    this.subscribeRouter();
  }
  override async ngDestroy(): Promise<void> {
    this.imageCacheClear();
  }
  layoutInit(): void {
    this.qnaReplyModel = new QnAReplyModel();
    this.content = "";
    this.uploadFileBuffModel = [];
  }
  subscribeRouter(): void {
    const sub = new Subject<any>();
    this.sub.push(sub);
    this.route.params.pipe(takeUntil(sub)).subscribe(async(x) => {
      this.thisPK = x["thisPK"];
      await this.refreshData();
    });
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
      this.replyActiveIndex = [];
      this.qnaContentModel.replyList.forEach(x => {
        this.replyActiveIndex.push(0);
      });
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
  protected readonly StringToQnAStateDesc = StringToQnAStateDesc;
}
