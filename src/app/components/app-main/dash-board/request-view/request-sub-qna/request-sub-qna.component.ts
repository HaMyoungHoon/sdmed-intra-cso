import {Component, ElementRef, EventEmitter, Inject, input, Input, Output, ViewChild} from "@angular/core";
import {FComponentBase} from "../../../../../guards/f-component-base";
import {UserRole} from "../../../../../models/rest/user/user-role";
import {RequestModel} from "../../../../../models/rest/requst/request-model";
import {QnAHeaderModel} from "../../../../../models/rest/qna/qna-header-model";
import {QnAContentModel} from "../../../../../models/rest/qna/qna-content-model";
import {QnaListService} from "../../../../../services/rest/qna-list.service";
import * as FExtensions from "../../../../../guards/f-extensions";
import {QnAFileModel} from "../../../../../models/rest/qna/qna-file-model";
import {transformToBoolean} from "primeng/utils";
import {QnAState, QnAStateToQnAStateDesc} from "../../../../../models/rest/qna/qna-state";
import {saveAs} from "file-saver";
import {UploadFileBuffModel} from "../../../../../models/common/upload-file-buff-model";
import {DOCUMENT} from "@angular/common";
import {Editor, EditorTextChangeEvent} from "primeng/editor";
import {QnAReplyModel} from "../../../../../models/rest/qna/qna-reply-model";
import {Card} from "primeng/card";
import {Tag} from "primeng/tag";
import {GalleriaModule} from "primeng/galleria";
import {SafeHtmlPipe} from "../../../../../guards/safe-html.pipe";
import {Button} from "primeng/button";
import {TranslatePipe} from "@ngx-translate/core";
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from "primeng/accordion";
import {FormsModule} from "@angular/forms";
import {Tooltip} from "primeng/tooltip";
import {ProgressSpinComponent} from "../../../../common/progress-spin/progress-spin.component";
import * as FConstants from "../../../../../guards/f-constants";
import {FullscreenFileViewComponent} from "../../../../common/fullscreen-file-view/fullscreen-file-view.component";
import {QnAReplyFileModel} from "../../../../../models/rest/qna/qna-reply-file-model";

@Component({
  selector: "app-request-sub-qna",
  imports: [Card, Tag, GalleriaModule, SafeHtmlPipe, Button, TranslatePipe, Accordion, AccordionPanel, AccordionHeader, AccordionContent, Editor, FormsModule, Tooltip, ProgressSpinComponent, FullscreenFileViewComponent],
  templateUrl: "./request-sub-qna.component.html",
  styleUrl: "./request-sub-qna.component.scss",
  standalone: true,
})
export class RequestSubQnaComponent extends FComponentBase {
  @Input() requestModel?: RequestModel
  @Output() closeEvent: EventEmitter<RequestModel> = new EventEmitter<RequestModel>();
  @ViewChild("quillEditor") quillEditor!: Editor;
  @ViewChild("inputFiles") inputFiles!: ElementRef<HTMLInputElement>;
  @ViewChild("fullscreenFileView") fullscreenFileView!: FullscreenFileViewComponent;
  qnaHeaderModel: QnAHeaderModel = new QnAHeaderModel();
  qnaContentModel: QnAContentModel = new QnAContentModel();
  qnaReplyModel: QnAReplyModel = new QnAReplyModel();
  accordionValue = ["0"];
  content: string = "";
  htmlValue: string = "";
  saveAble: boolean = false;
  uploadFileBuffModel: UploadFileBuffModel[] = [];
  activeIndex: number = 0;
  constructor(@Inject(DOCUMENT) private document: Document, private thisService: QnaListService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.Employee));
  }

  override async ngInit(): Promise<void> {
    await this.getHeader();
  }

  async getHeader(): Promise<void> {
    const thisPK = this.requestModel?.requestItemPK;
    if (thisPK == null) {
      return;
    }

    const ret = await FExtensions.restTry(async() => await this.thisService.getHeaderData(thisPK),
      e => this.fDialogService.error("getHeader", e));
    if (ret.result) {
      this.qnaHeaderModel = ret.data ?? new QnAHeaderModel();
      await this.getContent();
      return;
    }
    this.fDialogService.warn("getHeader", ret.msg);
  }
  async getContent(): Promise<void> {
    const thisPK = this.requestModel?.requestItemPK;
    if (thisPK == null) {
      return;
    }

    const ret = await FExtensions.restTry(async() => await this.thisService.getContentData(thisPK),
      e => this.fDialogService.error("getContent", e));
    if (ret.result) {
      this.qnaContentModel = ret.data ?? new QnAContentModel();
      this.accordionValue = [`${this.qnaContentModel.replyList.length - 1}`];
      return;
    }
    this.fDialogService.warn("getContent", ret.msg);
  }

  getBlobUrl(item: QnAFileModel): string {
    const ext = FExtensions.getExtMimeType(item.mimeType);
    if (FExtensions.isImage(ext)) {
      return item.blobUrl;
    }
    return FExtensions.extToBlobUrl(ext);
  }
  async viewItem(data: QnAFileModel[], item: QnAFileModel): Promise<void> {
    await this.fullscreenFileView.show(FExtensions.qnaFileListToViewModel(data), data.findIndex(x => x.thisPK == item.thisPK));
  }
  async viewReplyItem(data: QnAReplyFileModel[], item: QnAReplyFileModel): Promise<void> {
    await this.fullscreenFileView.show(FExtensions.qnaReplyFileListToViewModel(data), data.findIndex(x => x.thisPK == item.thisPK));
  }
  async downloadFile(item: QnAFileModel): Promise<void> {
    const ret = await FExtensions.tryCatchAsync(async() => await this.commonService.downloadFile(item.blobUrl),
      e => this.fDialogService.error("downloadFile", e));
    if (ret && ret.body) {
      saveAs(ret.body, item.originalFilename);
    }
  }
  async downloadReplyFile(item: QnAReplyFileModel): Promise<void> {
    const ret = await FExtensions.tryCatchAsync(async() => await this.commonService.downloadFile(item.blobUrl),
      e => this.fDialogService.error("downloadFile", e));
    if (ret && ret.body) {
      saveAs(ret.body, item.originalFilename);
    }
  }

  get canReply(): boolean {
    return this.qnaHeaderModel.qnaState != QnAState.OK;
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
    this.uploadFileBuffModel.forEach(x => x.revokeBLob());

    this.setLoading(false);
  }
  async uploadAzure(): Promise<boolean> {
    const thisPK = this.requestModel?.requestItemPK;
    if (thisPK == null) {
      return false;
    }

    let ret = true;
    for (const buff of this.uploadFileBuffModel) {
      const blobStorageInfo = await FExtensions.restTry(async() => await this.commonService.getGenerateSas(),
        e => this.fDialogService.error("saveData", e));
      if (!blobStorageInfo.result) {
        this.fDialogService.warn("saveData", blobStorageInfo.msg);
        ret = false;
        break;
      }
      const qnaFileModel = FExtensions.getQnAReplyPostFileModel(buff.file!!, thisPK, blobStorageInfo.data!!, buff.ext, buff.mimeType);
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
      data.revokeBLob();
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
  protected readonly QnAStateToQnAStateDesc = QnAStateToQnAStateDesc;
  protected readonly getQnAStateSeverity = FExtensions.getQnAStateSeverity;
  protected readonly ellipsis = FExtensions.ellipsis;
  protected readonly galleriaContainerStyle = FConstants.galleriaContainerStyle;
}
