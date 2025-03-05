import {Component, ElementRef, ViewChild} from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {UserRole} from "../../../../models/rest/user/user-role";
import {ActivatedRoute} from "@angular/router";
import {HospitalListService} from "../../../../services/rest/hospital-list.service";
import {HospitalModel} from "../../../../models/rest/hospital/hospital-model";
import {allBillTypeDescArray, BillType, BillTypeDescToBillType, billTypeToBillTypeDesc} from "../../../../models/rest/bill-type";
import {allContractTypeDescArray, ContactTypeDescToContactType, ContractType, contractTypeToContractTypeDesc} from "../../../../models/rest/contract-type";
import {allDeliveryDivDescArray, DeliveryDiv, DeliveryDivDescToDeliveryDiv, deliveryDivToDeliveryDivDesc} from "../../../../models/rest/delivery-div";
import * as FExtensions from "../../../../guards/f-extensions";
import * as FConstants from "../../../../guards/f-constants";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: "app-hospital-edit",
  templateUrl: "./hospital-edit.component.html",
  styleUrl: "./hospital-edit.component.scss",
  standalone: false,
})
export class HospitalEditComponent extends FComponentBase {
  @ViewChild("imageInput") imageInput!: ElementRef<HTMLInputElement>;
  hospitalModel: HospitalModel = new HospitalModel();
  billTypeList: string[] = allBillTypeDescArray();
  contractTypeList: string[] = allContractTypeDescArray();
  deliveryDivList: string[] = allDeliveryDivDescArray();
  selectBillType: string = billTypeToBillTypeDesc(BillType.None);
  selectContractType: string = contractTypeToContractTypeDesc(ContractType.None);
  selectDeliveryDiv: string = deliveryDivToDeliveryDivDesc(DeliveryDiv.None);
  constructor(private thisService: HospitalListService, private route: ActivatedRoute) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.HospitalChanger));
    this.hospitalModel.thisPK = this.route.snapshot.params["thisPK"];
  }

  override async ngInit(): Promise<void> {
    this.subscribeRouter();
  }
  subscribeRouter(): void {
    const sub = new Subject<any>();
    this.sub.push(sub);
    this.route.params.pipe(takeUntil(sub)).subscribe(async(x) => {
      this.hospitalModel.thisPK = x["thisPK"];
      await this.getHospitalData();
    });
  }

  async getHospitalData(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getData(this.hospitalModel.thisPK),
      e => this.fDialogService.error("getHospitalData", e));
    this.setLoading(false);
    if (ret.result) {
      this.hospitalModel = ret.data ?? new HospitalModel();
      this.selectBillType = billTypeToBillTypeDesc(ret.data?.billType);
      this.selectContractType = contractTypeToContractTypeDesc(ret.data?.contractType);
      this.selectDeliveryDiv = deliveryDivToDeliveryDivDesc(ret.data?.deliveryDiv);
      return;
    }
    this.fDialogService.warn("getHospitalData", ret.msg);
    this.haveRole = false;
  }

  async saveData(): Promise<void> {
    this.hospitalModel.billType = BillTypeDescToBillType[this.selectBillType];
    this.hospitalModel.contractType = ContactTypeDescToContactType[this.selectContractType];
    this.hospitalModel.deliveryDiv = DeliveryDivDescToDeliveryDiv[this.selectDeliveryDiv];
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.putData(this.hospitalModel),
      e => this.fDialogService.error("saveData", e));
    this.setLoading(false);
    if (ret.result) {
      return;
    }
    this.fDialogService.warn("saveData", ret.msg);
  }

  async imageSelected(event: any): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.setLoading();
      const file = input.files[0];
      const ext = await FExtensions.getFileExt(file);
      if (!FExtensions.isImage(ext)) {
        this.setLoading(false);
        this.fDialogService.warn("upload file", "only image file");
        return;
      }

      const blobName = FExtensions.getHospitalBlobName(ext);
      const blobStorageInfo = await FExtensions.restTry(async() => await this.commonService.getGenerateSas(blobName),
        e => this.fDialogService.error("upload file", e));
      if (blobStorageInfo.result != true || blobStorageInfo.data == undefined) {
        this.fDialogService.warn("upload file", blobStorageInfo.msg);
        this.setLoading(false);
        return;
      }
      const blobModel = FExtensions.getHospitalBlobModel(file, blobStorageInfo.data, blobName, ext);
      let uploadRet = true;
      const azureRet = await FExtensions.tryCatchAsync(async() => await this.azureBlobService.putUpload(file, blobStorageInfo.data, blobModel.blobName, blobModel.mimeType),
        e => {
        this.fDialogService.error("upload file", e);
        uploadRet = false;
      });
      if (azureRet == null || !uploadRet) {
        this.imageInput.nativeElement.value = "";
        this.setLoading(false);
        return;
      }
      const ret = await FExtensions.restTry(async() => await this.thisService.putImage(this.hospitalModel.thisPK, blobModel),
        e => this.fDialogService.error("upload file", e));
      this.imageInput.nativeElement.value = "";
      this.setLoading(false);
      if (ret.result) {
        this.hospitalModel.imageUrl = ret.data?.imageUrl ?? ""
        return;
      }

      this.fDialogService.warn("upload file", ret.msg);
    }
  }
  get imageUrl(): string {
    if (this.hospitalModel.imageUrl.length > 0) {
      return this.hospitalModel.imageUrl;
    }

    return FConstants.ASSETS_NO_IMAGE;
  }
  imageView(): void {
    if (this.hospitalModel.imageUrl.length <= 0) {
      this.imageInput.nativeElement.click();
      return;
    }

    this.fDialogService.openImageView({
      closable: true,
      closeOnEscape: true,
      draggable: true,
      resizable: true,
      maximizable: true,
      data: Array<string>(this.hospitalModel.imageUrl)
    });
  }
}
