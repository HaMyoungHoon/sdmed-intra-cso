import {ChangeDetectorRef, Component, input, QueryList, ViewChild, ViewChildren} from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {EdiListService} from "../../../../services/rest/edi-list.service";
import {ActivatedRoute} from "@angular/router";
import * as FExtensions from "../../../../guards/f-extensions";
import * as FConstants from "../../../../guards/f-constants";
import {EDIUploadModel} from "../../../../models/rest/edi/edi-upload-model";
import {EDIUploadPharmaModel} from "../../../../models/rest/edi/edi-upload-pharma-model";
import {transformToBoolean} from "primeng/utils";
import {EDIUploadPharmaMedicineModel} from "../../../../models/rest/edi/edi-upload-pharma-medicine-model";
import {FullscreenFileViewComponent} from "../../../common/fullscreen-file-view/fullscreen-file-view.component";
import {EDIState, StringToEDIStateDesc} from "../../../../models/rest/edi/edi-state";
import {UserRole} from "../../../../models/rest/user/user-role";
import {Subject, takeUntil} from "rxjs";
import {EDIUploadResponseModel} from "../../../../models/rest/edi/edi-upload-response-model";
import {DescToTextPosition, TextPosition, TextPositionToTextPositionDesc} from "../../../../models/common/text-position";
import {AddTextOptionModel} from "../../../../models/common/add-text-option-model";
import {ImageModifyViewComponent} from "../../../common/image-modify-view/image-modify-view.component";
import * as FImageCache from "../../../../guards/f-image-cache";
import {EDIType} from "../../../../models/rest/edi/edi-type";
import {EDIUploadPharmaFileModel} from "../../../../models/rest/edi/edi-upload-pharma-file-model";
import {EdiPharmaFileViewModelComponent} from "../../../common/edi-pharma-file-view-model/edi-pharma-file-view-model.component";
import {HospitalTempModel} from "../../../../models/rest/hospital/hospital-temp-model";
import * as FCanvasUtil from "../../../../guards/f-canvas-util";

@Component({
  selector: "app-edi-view",
  templateUrl: "./edi-view.component.html",
  styleUrl: "./edi-view.component.scss",
  standalone: false,
})
export class EdiViewComponent extends FComponentBase {
  @ViewChild("fullscreenFileView") fullscreenFileView!: FullscreenFileViewComponent;
  @ViewChild("imageModifyView") imageModifyView!: ImageModifyViewComponent;
  @ViewChildren("ediPharmaFileViewModel") ediPharmaFileViewModel!: QueryList<EdiPharmaFileViewModelComponent>;
  thisPK: string = "";
  uploadModel: EDIUploadModel = new EDIUploadModel();
  pharmaStateList: string[] = [];
  fontSize: number = 0;
  activeIndex: number = 0;
  selectPrintPharma?: EDIUploadPharmaModel;
  selectTextPosition: string = TextPositionToTextPositionDesc[TextPosition.LT];
  backColor: string = "#FFFFFF";
  textColor: string = "#000000";
  imageCacheUrl: {blobUrl: string, objectUrl: string}[] = [];
  constructor(private thisService: EdiListService, private route: ActivatedRoute, private cd: ChangeDetectorRef) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.EdiChanger));
    this.thisPK = this.route.snapshot.params["thisPK"];
  }

  override async ngInit(): Promise<void> {
    this.subscribeRouter();
  }
  override async ngDestroy(): Promise<void> {
  }
  onError(data: {title: string, msg?: string}): void {
    this.fDialogService.error(data.title, data.msg);
  }
  onWarn(data: {title: string, msg?: string}): void {
    this.fDialogService.warn(data.title, data.msg);
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
    if (ret.result) {
      this.uploadModel = ret.data ?? new EDIUploadModel();
      this.pharmaStateList = [...this.uploadModel.pharmaList.map(x => x.ediState)];
      this.uploadModel.pharmaList.forEach(x => {
        if (x.fileList == undefined) {
          x.fileList = [];
        }
      });
      if (this.uploadModel.pharmaList.length >= 1) {
        this.selectPrintPharma = this.uploadModel.pharmaList[0];
      }
      this.cd.detectChanges();
      await this.readyImage();
      this.setLoading(false);
      return;
    }
    this.setLoading(false);
    this.fDialogService.warn("getData", ret.msg);
  }
  async putHospitalTempData(data: HospitalTempModel): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.putHospitalTempData(this.uploadModel.thisPK, data),
      e => this.fDialogService.error("putHospitalTempData", e));
    this.setLoading(false);
    if (ret.result) {
      this.uploadModel.tempHospitalPK = data.thisPK;
      this.uploadModel.tempOrgName = data.orgName;
      return;
    }
    this.fDialogService.warn("putHospitalTempData", ret.msg);
  }
  async readyImage(): Promise<void> {
    for (let fileView of this.ediPharmaFileViewModel) {
      await fileView.readyImage(this.commonService);
    }
  }

  getApplyDate(): string {
    return `${this.uploadModel.year}-${this.uploadModel.month}`;
  }
  getHospitalName(): string {
    if (this.uploadModel.ediType == EDIType.DEFAULT) {
      return this.uploadModel.orgName;
    }
    return `${this.uploadModel.orgName} (${this.uploadModel.tempOrgName})`;
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
    if (this.uploadModel.tempOrgName.length <= 0) {
      return true;
    }
    if (this.uploadModel.pharmaList.length > 0) {
      return true;
    }
    return false;
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

  openHospitalTempDetail(): void {
    this.fDialogService.openHospitalTempDetailView({
      closable: false,
      closeOnEscape: true,
      maximizable: false,
      width: "85%",
      styleClass: "no-padding",
      data: this.uploadModel.tempHospitalPK
    });
  }
  openHospitalTempFind(): void {
    const sub = new Subject<any>();
    this.sub.push(sub);
    this.fDialogService.openHospitalTempFindView({
      closable: false,
      closeOnEscape: true,
      maximizable: false,
      width: "85%",
      styleClass: "no-padding"
    }).pipe(takeUntil(sub)).subscribe(async(x) => {
      const buff = x as HospitalTempModel | null;
      if (buff) {
        await this.putHospitalTempData(buff)
      }
    });
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
  async downloadPharmaImageFile(pharmaName: string, item: EDIUploadPharmaFileModel, withWatermark: boolean = true): Promise<void> {
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
      const filename = `${this.getApplyDate()}_${this.getHospitalName()}_${pharmaName}`;
      const blob = withWatermark ? await FCanvasUtil.blobAddText(blobBuff, filename, item.mimeType, this.addTextOptionMerge()) : blobBuff;
      FExtensions.fileSave(blob, `${FExtensions.ableFilename(filename)}.${FExtensions.getExtMimeType(item.mimeType)}`);
    } catch (e: any) {
      this.fDialogService.warn("download", e?.message?.toString());
    }
  }
  async downloadEDIPharmaFile(data: {pharmaName: string, item: EDIUploadPharmaFileModel, withWatermark: boolean }): Promise<void> {
    this.setLoading();
    const ext = FExtensions.getExtMimeType(data.item.mimeType);
    if (FExtensions.isImage(ext)) {
      await this.downloadPharmaImageFile(data.pharmaName, data.item);
    } else {
      const ret = await FExtensions.tryCatchAsync(async() => await this.commonService.downloadFile(data.item.blobUrl),
        e => this.fDialogService.error("downloadFile", e));
      try {
        if (ret && ret.body) {
          const filename = `${this.getApplyDate()}_${this.getHospitalName()}_${data.pharmaName}`;
          const blob = data.withWatermark ? await FCanvasUtil.blobAddText(ret.body, filename, data.item.mimeType, this.addTextOptionMerge()) : ret.body;
          FExtensions.fileSave(blob, `${FExtensions.ableFilename(filename)}.${FExtensions.getExtMimeType(data.item.mimeType)}`);
        }
      } catch (e: any) {
        this.fDialogService.warn("download", e?.message?.toString());
      }
    }
    this.setLoading(false);
  }
  async removeEDIPharmaFile(item: EDIUploadPharmaFileModel): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.deleteEDIPharmaFile(item.thisPK),
      e => this.fDialogService.error("delete", e));
    this.setLoading(false);
    if (ret.result) {
      await this.mqttSend(this.uploadModel.userPK, this.uploadModel.thisPK, `${this.uploadModel.name}\n${this.uploadModel.orgName}\n${item.originalFilename}`);
      return;
    }
    this.fDialogService.warn("delete", ret.msg);
  }
  addTextOptionMerge(): AddTextOptionModel {
    return FExtensions.applyClass(AddTextOptionModel, obj => {
      obj.textPosition = DescToTextPosition[this.selectTextPosition];
      obj.fontSize = this.fontSize;
      obj.textBackground = FExtensions.hexColorWithAlpha(this.backColor, 127);
      obj.textColor = FExtensions.hexColorWithAlpha(this.textColor, 255);
    });
  }

  get isTransfer(): boolean {
    return this.uploadModel.ediType == EDIType.TRANSFER;
  }
  get isNew(): boolean {
    return this.uploadModel.ediType == EDIType.NEW;
  }
  get isDefault(): boolean {
    return this.uploadModel.ediType == EDIType.DEFAULT;
  }
  get hospitalTempDetailAble(): boolean {
    return this.uploadModel.tempHospitalPK.length > 0;
  }
  get hospitalTempFindAble(): boolean {
    return this.uploadModel.tempHospitalPK.length == 0;
  }

  protected readonly dateToYYYYMMdd = FExtensions.dateToYYYYMMdd
  protected readonly ellipsis = FExtensions.ellipsis;
  protected readonly getEDIStateSeverity = FExtensions.getEDIStateSeverity;
  protected readonly galleriaContainerStyle = FConstants.galleriaContainerStyle;
  protected readonly tableStyle = FConstants.tableStyle;
	protected readonly StringToEDIStateDesc = StringToEDIStateDesc;
}
