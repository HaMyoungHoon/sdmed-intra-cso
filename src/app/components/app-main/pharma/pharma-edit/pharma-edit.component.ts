import {Component, ElementRef, ViewChild} from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {UserRole} from "../../../../models/rest/user/user-role";
import {PharmaModel} from "../../../../models/rest/pharma/pharma-model";
import {allBillTypeDescArray, BillType, BillTypeDescToBillType, billTypeToBillTypeDesc} from "../../../../models/rest/bill-type";
import {allPharmaTypeDescArray, PharmaType, PharmaTypeDescToPharmaType, pharmaTypeToPharmaTypeDesc} from "../../../../models/rest/pharma/pharma-type";
import {allPharmaGroupDescArray, PharmaGroup, PharmaGroupDescToPharmaGroup, pharmaGroupToPharmaGroupDesc} from "../../../../models/rest/pharma/pharma-group";
import {allContractTypeDescArray, ContactTypeDescToContactType, ContractType, contractTypeToContractTypeDesc} from "../../../../models/rest/contract-type";
import {allDeliveryDivDescArray, DeliveryDiv, DeliveryDivDescToDeliveryDiv, deliveryDivToDeliveryDivDesc} from "../../../../models/rest/delivery-div";
import {MedicineModel} from "../../../../models/rest/medicine/medicine-model";
import {debounceTime, Subject, Subscription} from "rxjs";
import {PharmaListService} from "../../../../services/rest/pharma-list.service";
import * as FExtensions from "../../../../guards/f-extensions";
import * as FConstants from "../../../../guards/f-constants";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: "app-pharma-edit",
  templateUrl: "./pharma-edit.component.html",
  styleUrl: "./pharma-edit.component.scss",
  standalone: false,
})
export class PharmaEditComponent extends FComponentBase {
  @ViewChild("imageInput") imageInput!: ElementRef<HTMLInputElement>;
  pharmaModel: PharmaModel = new PharmaModel();
  billTypeList: string[] = allBillTypeDescArray();
  pharmaTypeList: string[] = allPharmaTypeDescArray();
  pharmaGroupList: string[] = allPharmaGroupDescArray();
  contractTypeList: string[] = allContractTypeDescArray();
  deliveryDivList: string[] = allDeliveryDivDescArray();
  selectBillType: string = billTypeToBillTypeDesc(BillType.None);
  selectPharmaType: string = pharmaTypeToPharmaTypeDesc(PharmaType.None);
  selectPharmaGroup: string = pharmaGroupToPharmaGroupDesc(PharmaGroup.None);
  selectContractType: string = contractTypeToContractTypeDesc(ContractType.None);
  selectDeliveryDiv: string = deliveryDivToDeliveryDivDesc(DeliveryDiv.None);

  medicineSearchLoading: boolean = false;
  isMedicineSearchTypeCode: boolean = false;
  medicineSearchValue: string = "";
  medicineList: MedicineModel[] = [];
  medicineSearchSubject: Subject<string> = new Subject<string>();
  medicineSearchObserver?: Subscription;
  medicineSearchDebounceTime: number = 1000;
  constructor(private thisService: PharmaListService, private route: ActivatedRoute) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.PharmaChanger));
    this.initLayoutData();
    this.pharmaModel.thisPK = this.route.snapshot.params["thisPK"];
  }

  override async ngInit(): Promise<void> {
    await this.getPharmaData();
  }
  initLayoutData(): void {
    this.medicineSearchObserver = this.medicineSearchSubject.pipe(debounceTime(this.medicineSearchDebounceTime))
      .subscribe(async() => {
        this.medicineSearchLoading = false;
        await this.medicineSearch();
      });
  }
  async getPharmaData(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getData(this.pharmaModel.thisPK, true),
      e => this.fDialogService.error("getPharmaData", e));
    this.setLoading(false);
    if (ret.result) {
      this.pharmaModel = ret.data ?? new PharmaModel();
      this.selectBillType = billTypeToBillTypeDesc(ret.data?.billType);
      this.selectPharmaType = pharmaTypeToPharmaTypeDesc(ret.data?.pharmaType);
      this.selectPharmaGroup = pharmaGroupToPharmaGroupDesc(ret.data?.pharmaGroup);
      this.selectContractType = contractTypeToContractTypeDesc(ret.data?.contractType);
      this.selectDeliveryDiv = deliveryDivToDeliveryDivDesc(ret.data?.deliveryDiv);
      return;
    }
    this.fDialogService.warn("getPharmaData", ret.msg);
  }
  async saveData(): Promise<void> {
    this.pharmaModel.billType = BillTypeDescToBillType[this.selectBillType];
    this.pharmaModel.pharmaType = PharmaTypeDescToPharmaType[this.selectPharmaType];
    this.pharmaModel.pharmaGroup = PharmaGroupDescToPharmaGroup[this.selectPharmaType];
    this.pharmaModel.contractType = ContactTypeDescToContactType[this.selectContractType];
    this.pharmaModel.deliveryDiv = DeliveryDivDescToDeliveryDiv[this.selectDeliveryDiv];
    this.setLoading();
    if (!await this.medicineListModify()) {
      this.setLoading(false);
      return;
    }

    const ret = await FExtensions.restTry(async() => await this.thisService.putData(this.pharmaModel),
      e => this.fDialogService.error("saveData", e));
    this.setLoading(false);
    if (ret.result) {
      return;
    }
    this.fDialogService.warn("saveData", ret.msg);
  }
  async medicineListModify(): Promise<boolean> {
    const medicineList = this.pharmaModel.medicineList.map(x => x.thisPK);
    const ret = await FExtensions.restTry(async() => await this.thisService.putMedicine(this.pharmaModel.thisPK, medicineList),
      e => this.fDialogService.error("medicineListModify", e));
    if (ret.result) {
      return true;
    }
    this.fDialogService.warn("medicineListModify", ret.msg);
    return false;
  }

  async imageSelected(event: any): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.setLoading();
      const file = input.files[0];
      const ext = await FExtensions.getFileExt(file);
      if (!FExtensions.isImage(ext)) {
        this.setLoading(false);
        this.fDialogService.warn("imageView", "only image file");
        return;
      }

      const blobModel = this.thisService.getBlobModel(file, ext);
      const sasKey = await FExtensions.restTry(async() => await this.commonService.getGenerateSas(blobModel.blobName),
        e => this.fDialogService.error("imageView", e));
      if (sasKey.result != true) {
        this.fDialogService.warn("imageView", sasKey.msg);
        this.setLoading(false);
        return;
      }
      await FExtensions.tryCatchAsync(async() => await this.azureBlobService.putUpload(file, blobModel.blobName, sasKey.data ?? "", blobModel.mimeType),
        e => this.fDialogService.error("imageView", e));
      const ret = await FExtensions.restTry(async() => await this.thisService.putImage(this.pharmaModel.thisPK, blobModel),
        e => this.fDialogService.error("imageView", e));
      this.imageInput.nativeElement.value = "";
      this.setLoading(false);
      if (ret.result) {
        this.pharmaModel.imageUrl = ret.data?.imageUrl ?? ""
        return;
      }

      this.fDialogService.warn("imageView", ret.msg);
    }
  }
  get imageUrl(): string {
    if (this.pharmaModel.imageUrl.length > 0) {
      return this.pharmaModel.imageUrl;
    }

    return FConstants.ASSETS_NO_IMAGE;
  }
  imageView(): void {
    if (this.pharmaModel.imageUrl.length <= 0) {
      this.imageInput.nativeElement.click();
      return;
    }

    this.fDialogService.openImageView({
      closable: false,
      closeOnEscape: true,
      draggable: true,
      resizable: true,
      maximizable: true,
      data: Array<string>(this.pharmaModel.imageUrl)
    });
  }

  async medicineSearch(): Promise<void> {
    if (this.medicineSearchValue.length <= 0) {
      return;
    }
    const ret = await FExtensions.restTry(async() => await this.thisService.getMedicine(this.medicineSearchValue, this.isMedicineSearchTypeCode),
      e => this.fDialogService.error("medicineSearch", e));
    if (ret.result) {
      this.medicineList = ret.data ?? [];
      this.medicineList = this.medicineList.filter(x => !this.pharmaModel.medicineList.some(y => y.thisPK == x.thisPK))
      return;
    }
    this.fDialogService.warn("medicineSearch", ret.msg);
  }
  get medicineSearchStyle(): string {
    if (this.medicineSearchLoading) return "pi pi-spinner pi-spin";
    else return "pi pi-search"
  }
  get medicineSearchPlaceHolder(): string {
    if (this.isMedicineSearchTypeCode) return "pharma-edit.medicine-pick-list.search-code";
    else return "pharma-edit.medicine-pick-list.search-name";
  }
  async medicineSearchChange(data: any): Promise<void> {
    if (this.isMobile) {
      this.medicineSearchLoading = true;
      this.medicineSearchSubject.next(data.data);
      return;
    }
    if (data.key == "Enter") {
      this.medicineSearchLoading = true;
      await this.medicineSearch();
      this.medicineSearchLoading = false;
    }
  }

  protected readonly ellipsis = FExtensions.ellipsis;
}
