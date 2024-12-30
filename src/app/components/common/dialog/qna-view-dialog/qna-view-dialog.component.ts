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
import {QnAState, QnAStateToQnAStateDesc} from "../../../../models/rest/qna/qna-state";
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

@Component({
  selector: "app-qna-view-dialog",
  imports: [Accordion, AccordionContent, AccordionHeader, AccordionPanel, Button, Card, Editor, GalleriaModule, NgForOf, NgIf, PrimeTemplate, ProgressSpinComponent, SafeHtmlPipe, Tag, Tooltip, TranslatePipe, FormsModule],
  templateUrl: "./qna-view-dialog.component.html",
  styleUrl: "./qna-view-dialog.component.scss",
  standalone: true
})
export class QnaViewDialogComponent extends FDialogComponentBase {
  @ViewChild("inputFiles") inputFiles!: ElementRef<HTMLInputElement>;
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
  constructor(private thisService: QnaListService, private dashboardService: DashboardService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.Employee));
    const dlg = this.dialogService.getInstance(this.ref);
    this.thisPK = dlg.data;
    console.log(this.thisPK);
  }

  override async ngInit(): Promise<void> {
    await this.refreshData();
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
      console.log(this.qnaContentModel.replyList);
      return;
    }
    this.fDialogService.warn("getContent", ret.msg);
  }

  async downloadFile(item: QnAContentModel): Promise<void> {

  }

  getBlobUrl(item: QnAFileModel): string {
    const ext = FExtensions.getExtMimeType(item.mimeType);
    if (FExtensions.isImage(ext)) {
      return item.blobUrl;
    }
    return FExtensions.extToBlobUrl(ext);
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
      const qnaFileModel = FExtensions.getQnAReplyPostFileModel(buff.file!!, thisPK, buff.ext, buff.mimeType);
      const sasKey = await FExtensions.restTry(async() => await this.commonService.getGenerateSas(qnaFileModel.blobName),
        e => this.fDialogService.error("saveData", e));
      if (!sasKey.result) {
        this.fDialogService.warn("saveData", sasKey.msg);
        ret = false;
        break;
      }
      await FExtensions.tryCatchAsync(async() => await this.azureBlobService.putUpload(buff.file!!, qnaFileModel.blobName, sasKey.data ?? "", qnaFileModel.mimeType),
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
  protected readonly getQnAStateSeverity = FExtensions.getQnAStateSeverity;
  protected readonly ellipsis = FExtensions.ellipsis;
  protected readonly QnAStateToQnAStateDesc = QnAStateToQnAStateDesc;

  protected readonly galleriaContainerStyle = FConstants.galleriaContainerStyle;
}
