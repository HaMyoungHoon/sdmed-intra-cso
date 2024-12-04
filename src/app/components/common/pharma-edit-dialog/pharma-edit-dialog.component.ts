import {Component, ElementRef, ViewChild} from "@angular/core";
import {FDialogComponentBase} from "../../../guards/f-dialog-component-base";
import {PharmaService} from "../../../services/rest/pharma.service";
import {UserRole} from "../../../models/rest/user-role";
import {allBillTypeDescArray, BillType, BillTypeDescToBillType, billTypeToBillTypeDesc} from "../../../models/rest/bill-type";
import {allContractTypeDescArray, ContactTypeDescToContactType, ContractType, contractTypeToContractTypeDesc} from "../../../models/rest/contract-type";
import {allDeliveryDivDescArray, DeliveryDiv, DeliveryDivDescToDeliveryDiv, deliveryDivToDeliveryDivDesc} from "../../../models/rest/delivery-div";
import {PharmaModel} from "../../../models/rest/pharma-model";
import {ellipsis, restTry} from "../../../guards/f-extensions";
import {allPharmaTypeDescArray, PharmaType, PharmaTypeDescToPharmaType, pharmaTypeToPharmaTypeDesc} from "../../../models/rest/pharma-type";
import {allPharmaGroupDescArray, PharmaGroup, PharmaGroupDescToPharmaGroup, pharmaGroupToPharmaGroupDesc} from "../../../models/rest/pharma-group";
import * as FConstants from "../../../guards/f-constants";
import {Button} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {CardModule} from "primeng/card";
import {DropdownModule} from "primeng/dropdown";
import {ImageModule} from "primeng/image";
import {InputTextModule} from "primeng/inputtext";
import {NgIf} from "@angular/common";
import {ProgressSpinComponent} from "../progress-spin/progress-spin.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslatePipe} from "@ngx-translate/core";
import {MedicineService} from "../../../services/rest/medicine.service";
import {MedicineModel} from "../../../models/rest/medicine-model";
import {PickListModule} from "primeng/picklist";
import {CheckboxModule} from "primeng/checkbox";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {debounceTime, Subject, Subscription} from "rxjs";

@Component({
  selector: "app-pharma-edit-dialog",
  imports: [Button, CalendarModule, CardModule, DropdownModule, ImageModule, InputTextModule, NgIf, ProgressSpinComponent, ReactiveFormsModule, TranslatePipe, FormsModule, PickListModule, CheckboxModule, IconFieldModule, InputIconModule],
  templateUrl: "./pharma-edit-dialog.component.html",
  styleUrl: "./pharma-edit-dialog.component.scss",
  standalone: true,
})
export class PharmaEditDialogComponent extends FDialogComponentBase {
  @ViewChild("imageInput") imageInput!: ElementRef<HTMLInputElement>;
  pharmaModel?: PharmaModel;
  billTypeList: string[] = [];
  pharmaTypeList: string[] = [];
  pharmaGroupList: string[] = [];
  contractTypeList: string[] = [];
  deliveryDivList: string[] = [];
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
  constructor(private pharmaService: PharmaService, private medicineService: MedicineService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.PharmaChanger));
    this.initLayoutData();
    const dlg = this.dialogService.getInstance(this.ref);
    this.pharmaModel = dlg.data;
  }

  override async ngInit(): Promise<void> {
    await this.getPharmaData();
  }
  initLayoutData(): void {
    this.billTypeList = allBillTypeDescArray();
    this.pharmaTypeList = allPharmaTypeDescArray();
    this.pharmaGroupList = allPharmaGroupDescArray();
    this.contractTypeList = allContractTypeDescArray();
    this.deliveryDivList = allDeliveryDivDescArray();
    this.medicineSearchObserver = this.medicineSearchSubject.pipe(debounceTime(this.medicineSearchDebounceTime))
      .subscribe(async() => {
        this.medicineSearchLoading = false;
        await this.medicineSearch();
      });
  }
  async getPharmaData(): Promise<void> {
    const buff = this.pharmaModel;
    if (buff == null) {
      return;
    }

    this.setLoading();
    const ret = await restTry(async() => await this.pharmaService.getPharmaData(buff.thisPK, true),
      e => this.fDialogService.error("getPharmaData", e));
    this.setLoading(false);
    if (ret.result) {
      this.pharmaModel = ret.data;
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
    const buff = this.pharmaModel;
    if (buff == null) {
      return;
    }

    buff.billType = BillTypeDescToBillType[this.selectBillType];
    buff.pharmaType = PharmaTypeDescToPharmaType[this.selectPharmaType];
    buff.pharmaGroup = PharmaGroupDescToPharmaGroup[this.selectPharmaType];
    buff.contractType = ContactTypeDescToContactType[this.selectContractType];
    buff.deliveryDiv = DeliveryDivDescToDeliveryDiv[this.selectDeliveryDiv];
    this.setLoading();
    if (!await this.medicineListModify()) {
      this.setLoading(false);
      return;
    }

    const ret = await restTry(async() => await this.pharmaService.putPharmDataModify(buff),
      e => this.fDialogService.error("saveData", e));
    if (ret.result) {
      this.ref.close(ret.data);
      return;
    }
    this.fDialogService.warn("saveData", ret.msg);
  }
  async medicineListModify(): Promise<boolean> {
    const buff = this.pharmaModel;
    if (buff == null) {
      return false;
    }
    const medicineList = buff.medicineList.map(x => x.thisPK);
    const ret = await restTry(async() => await this.pharmaService.putPharmaModMedicine(buff.thisPK, medicineList),
      e => this.fDialogService.error("medicineListModify", e));
    if (ret.result) {
      return true;
    }
    this.fDialogService.warn("medicineListModify", ret.msg);
    return false;
  }
  closeThis(): void {
    this.ref.close(this.pharmaModel);
  }

  async imageSelected(event: any): Promise<void> {
    const buff = this.pharmaModel;
    if (buff == null) {
      return;
    }
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.setLoading();
      const ret = await restTry(async() => await this.pharmaService.postImageUpload(buff.thisPK, file),
        e => this.fDialogService.error("imageSelected", e));
      this.imageInput.nativeElement.value = "";
      this.setLoading(false);
      if (ret.result) {
        this.pharmaModel!!.imageUrl = ret.data?.imageUrl ?? ""
        return;
      }

      this.fDialogService.warn("imageSelected", ret.msg);
    }
  }
  get imageUrl(): string {
    if ((this.pharmaModel?.imageUrl?.length ?? 0) > 0) {
      return this.pharmaModel!!.imageUrl;
    }

    return FConstants.ASSETS_NO_IMAGE;
  }
  imageView(): void {
    const buff = this.pharmaModel;
    if (buff == null) {
      return;
    }

    if (buff.imageUrl.length <= 0) {
      this.imageInput.nativeElement.click();
      return;
    }

    this.fDialogService.openImageView({
      closable: false,
      closeOnEscape: true,
      draggable: true,
      resizable: true,
      data: Array<string>(buff.imageUrl)
    });
  }

  async medicineSearch(): Promise<void> {
    if (this.medicineSearchValue.length <= 0) {
      return;
    }
    const ret = await restTry(async() => await this.medicineService.getMedicineAllSearch(this.medicineSearchValue, this.isMedicineSearchTypeCode),
      e => this.fDialogService.error("medicineSearch", e));
    if (ret.result) {
      this.medicineList = ret.data ?? [];
      return;
    }
    this.fDialogService.warn("medicineSearch", ret.msg);
  }
  get medicineSearchStyle(): string {
    if (this.medicineSearchLoading) return "pi pi-spinner pi-spin";
    else return "pi pi-search"
  }
  get medicineSearchPlaceHolder(): string {
    if (this.isMedicineSearchTypeCode) return "pharma-edit-dialog.medicine-pick-list.search-code";
    else return "pharma-edit-dialog.medicine-pick-list.search-name";
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

  protected readonly ellipsis = ellipsis;
}
