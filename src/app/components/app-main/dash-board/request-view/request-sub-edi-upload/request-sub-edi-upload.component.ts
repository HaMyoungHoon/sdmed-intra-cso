import {Component, EventEmitter, input, Input, Output, ViewChild} from "@angular/core";
import {FComponentBase} from "../../../../../guards/f-component-base";
import {RequestModel} from "../../../../../models/rest/requst/request-model";
import {UserRole} from "../../../../../models/rest/user/user-role";
import * as FExtensions from "../../../../../guards/f-extensions";
import {EDIUploadModel} from "../../../../../models/rest/edi/edi-upload-model";
import {EDIUploadPharmaModel} from "../../../../../models/rest/edi/edi-upload-pharma-model";
import {EDIUploadPharmaMedicineModel} from "../../../../../models/rest/edi/edi-upload-pharma-medicine-model";
import {allEDIStateArray, EDIState} from "../../../../../models/rest/edi/edi-state";
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
import {Select} from "primeng/select";
import {TableModule} from "primeng/table";
import {Tag} from "primeng/tag";
import {Tooltip} from "primeng/tooltip";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: "app-request-sub-edi-upload",
  imports: [
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionPanel,
    Button,
    FullscreenFileViewComponent,
    GalleriaModule,
    NgForOf,
    NgIf,
    PrimeTemplate,
    ProgressSpinComponent,
    ReactiveFormsModule,
    Select,
    TableModule,
    Tag,
    Tooltip,
    TranslatePipe,
    FormsModule
  ],
  templateUrl: "./request-sub-edi-upload.component.html",
  styleUrl: "./request-sub-edi-upload.component.scss",
  standalone: true,
})
export class RequestSubEdiUploadComponent extends FComponentBase {
  @Input() requestModel?: RequestModel
  @Output() closeEvent: EventEmitter<RequestModel> = new EventEmitter<RequestModel>();
  @ViewChild("fullscreenFileView") fullscreenFileView!: FullscreenFileViewComponent;
  uploadModel: EDIUploadModel = new EDIUploadModel();
  ediStateList = allEDIStateArray();
  pharmaStateList: string[] = [];
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
      return;
    }
    this.fDialogService.warn("getData", ret.msg);
  }

  getApplyDate(): string {
    return `${this.uploadModel.year}-${this.uploadModel.month}-${this.uploadModel.day}`;
  }
  getPharmaApplyDate(pharma: EDIUploadPharmaModel): string {
    return FExtensions.dateToYYYYMMdd(FExtensions.stringToDate(`${pharma.year}-${pharma.month}-${pharma.day}`));
  }
  getMedicineApplyDate(medicine: EDIUploadPharmaMedicineModel): string {
    return FExtensions.dateToYYYYMMdd(FExtensions.stringToDate(`${medicine.year}-${medicine.month}-${medicine.day}`));
  }

  pharmaSelectState(pharma: EDIUploadPharmaModel): string {
    const index = this.uploadModel.pharmaList.findIndex(x => x.thisPK == pharma.thisPK);
    return this.pharmaStateList[index];
  }
  getPharmaSelectStateIndex(pharma: EDIUploadPharmaModel): number {
    return this.uploadModel.pharmaList.findIndex(x => x.thisPK == pharma.thisPK);
  }
  async pharmaStateChange(pharma: EDIUploadPharmaModel): Promise<void> {
    if (this.pharmaSelectState(pharma) == pharma.ediState) {
      return;
    }
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.putPharmaDataState(pharma.thisPK, pharma),
      e => this.fDialogService.error("pharmaStateChange", e));
    this.setLoading(false);
    if (ret.result) {
      return;
    }
    this.fDialogService.warn("pharmaStateChange", ret.msg);
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
    return pharma.ediState == EDIState.OK;
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
  accordionIndex(item: EDIUploadPharmaModel): string {
    return `${this.uploadModel.pharmaList.findIndex(x => x.thisPK == item.thisPK)}`;
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
    const ret = await FExtensions.tryCatchAsync(async() => await this.commonService.downloadFile(item.blobUrl),
      e => this.fDialogService.error("downloadFile", e));
    if (ret && ret.body) {
      saveAs(ret.body, item.originalFilename);
    }
  }

  get downloadFileTooltip(): string {
    return "common-desc.save";
  }
  protected readonly dateToYYYYMMdd = FExtensions.dateToYYYYMMdd
  protected readonly ellipsis = FExtensions.ellipsis;
  protected readonly getEDIStateSeverity = FExtensions.getEDIStateSeverity;
  protected readonly galleriaContainerStyle = FConstants.galleriaContainerStyle;
  protected readonly tableStyle = FConstants.tableStyle;
}
