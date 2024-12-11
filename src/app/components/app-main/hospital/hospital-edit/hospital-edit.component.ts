import {Component, ElementRef, ViewChild} from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {UserRole} from "../../../../models/rest/user-role";
import {ActivatedRoute} from "@angular/router";
import {HospitalListService} from "../../../../services/rest/hospital-list.service";
import {HospitalModel} from "../../../../models/rest/hospital-model";
import {allBillTypeDescArray, BillType, BillTypeDescToBillType, billTypeToBillTypeDesc} from "../../../../models/rest/bill-type";
import {allContractTypeDescArray, ContactTypeDescToContactType, ContractType, contractTypeToContractTypeDesc} from "../../../../models/rest/contract-type";
import {allDeliveryDivDescArray, DeliveryDiv, DeliveryDivDescToDeliveryDiv, deliveryDivToDeliveryDivDesc} from "../../../../models/rest/delivery-div";
import {getFileExt, isImage, restTry, tryCatchAsync} from "../../../../guards/f-extensions";
import * as FConstants from "../../../../guards/f-constants";

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
    if (this.haveRole) {
      await this.getHospitalData();
    }
  }

  async getHospitalData(): Promise<void> {
    this.setLoading();
    const ret = await restTry(async() => await this.thisService.getData(this.hospitalModel.thisPK),
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
    const ret = await restTry(async() => await this.thisService.putData(this.hospitalModel),
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
      const ext = await getFileExt(file);
      if (!isImage(ext)) {
        this.setLoading(false);
        this.fDialogService.warn("imageView", "only image file");
        return;
      }

      const blobModel = this.thisService.getBlobModel(file, ext);
      const sasKey = await restTry(async() => await this.commonService.getGenerateSas(blobModel.blobName),
        e => this.fDialogService.error("imageView", e));
      if (sasKey.result != true) {
        this.fDialogService.warn("imageView", sasKey.msg);
        this.setLoading(false);
        return;
      }
      await tryCatchAsync(async() => await this.azureBlobService.putUpload(file, blobModel.blobName, sasKey.data ?? "", blobModel.mimeType),
        e => this.fDialogService.error("imageView", e));
      const ret = await restTry(async() => await this.thisService.putImage(this.hospitalModel.thisPK, blobModel),
        e => this.fDialogService.error("imageView", e));
      this.imageInput.nativeElement.value = "";
      this.setLoading(false);
      if (ret.result) {
        this.hospitalModel.imageUrl = ret.data?.imageUrl ?? ""
        return;
      }

      this.fDialogService.warn("imageView", ret.msg);
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
      closable: false,
      closeOnEscape: true,
      draggable: true,
      resizable: true,
      data: Array<string>(this.hospitalModel.imageUrl)
    });
  }
}
