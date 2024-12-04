import {Component, ElementRef, ViewChild} from "@angular/core";
import {FDialogComponentBase} from "../../../guards/f-dialog-component-base";
import {UserRole} from "../../../models/rest/user-role";
import {HospitalModel} from "../../../models/rest/hospital-model";
import {ProgressSpinComponent} from "../progress-spin/progress-spin.component";
import {Button} from "primeng/button";
import {TranslatePipe} from "@ngx-translate/core";
import {CardModule} from "primeng/card";
import {NgIf} from "@angular/common";
import {restTry} from "../../../guards/f-extensions";
import {InputTextModule} from "primeng/inputtext";
import {FormsModule} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";
import {allBillTypeDescArray, BillType, BillTypeDescToBillType, billTypeToBillTypeDesc} from "../../../models/rest/bill-type";
import {allContractTypeDescArray, ContractType, ContactTypeDescToContactType, contractTypeToContractTypeDesc} from "../../../models/rest/contract-type";
import {allDeliveryDivDescArray, DeliveryDiv, DeliveryDivDescToDeliveryDiv, deliveryDivToDeliveryDivDesc} from "../../../models/rest/delivery-div";
import {ImageModule} from "primeng/image";
import * as FConstants from "../../../guards/f-constants";
import {HospitalService} from "../../../services/rest/hospital.service";
import {CalendarModule} from "primeng/calendar";

@Component({
  selector: "app-hospital-edit-dialog",
  imports: [
    ProgressSpinComponent,
    Button,
    TranslatePipe,
    CardModule,
    NgIf,
    InputTextModule,
    FormsModule,
    DropdownModule,
    ImageModule,
    CalendarModule
  ],
  templateUrl: "./hospital-edit-dialog.component.html",
  styleUrl: "./hospital-edit-dialog.component.scss",
  standalone: true
})
export class HospitalEditDialogComponent extends FDialogComponentBase {
  @ViewChild("imageInput") imageInput!: ElementRef<HTMLInputElement>;
  hospitalModel?: HospitalModel;
  billTypeList: string[] = [];
  contractTypeList: string[] = [];
  deliveryDivList: string[] = [];
  selectBillType: string = billTypeToBillTypeDesc(BillType.None);
  selectContractType: string = contractTypeToContractTypeDesc(ContractType.None);
  selectDeliveryDiv: string = deliveryDivToDeliveryDivDesc(DeliveryDiv.None);
  constructor(private hospitalService: HospitalService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.HospitalChanger));
    this.initLayoutData();
    const dlg = this.dialogService.getInstance(this.ref);
    this.hospitalModel = dlg.data;
  }

  override async ngInit(): Promise<void> {
    await this.getHospitalData();
  }

  initLayoutData(): void {
    this.billTypeList = allBillTypeDescArray();
    this.contractTypeList = allContractTypeDescArray();
    this.deliveryDivList = allDeliveryDivDescArray();
  }
  async getHospitalData(): Promise<void> {
    const buff = this.hospitalModel;
    if (buff == null) {
      return;
    }

    this.setLoading();
    const ret = await restTry(async() => await this.hospitalService.getHospitalData(buff.thisPK),
      e => this.fDialogService.error("getHospitalData", e));
    this.setLoading(false);
    if (ret.result) {
      this.hospitalModel = ret.data;
      this.selectBillType = billTypeToBillTypeDesc(ret.data?.billType);
      this.selectContractType = contractTypeToContractTypeDesc(ret.data?.contractType);
      this.selectDeliveryDiv = deliveryDivToDeliveryDivDesc(ret.data?.deliveryDiv);
      return;
    }
    this.fDialogService.warn("getHospitalData", ret.msg);
  }

  async saveData(): Promise<void> {
    const buff = this.hospitalModel;
    if (buff == null) {
      return;
    }
    buff.billType = BillTypeDescToBillType[this.selectBillType];
    buff.contractType = ContactTypeDescToContactType[this.selectContractType];
    buff.deliveryDiv = DeliveryDivDescToDeliveryDiv[this.selectDeliveryDiv];
    this.setLoading();
    const ret = await restTry(async() => await this.hospitalService.putHospitalDataModify(buff),
      e => this.fDialogService.error("saveData", e));
    this.setLoading(false);
    if (ret.result) {
      this.ref.close(ret.data);
      return;
    }
    this.fDialogService.warn("saveData", ret.msg);
  }
  closeThis(): void {
    this.ref.close(this.hospitalModel);
  }

  async imageSelected(event: any): Promise<void> {
    const buff = this.hospitalModel;
    if (buff == null) {
      return;
    }
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.setLoading();
      const ret = await restTry(async() => await this.hospitalService.postImageUpload(buff.thisPK, file),
        e => this.fDialogService.error("imageSelected", e));
      this.imageInput.nativeElement.value = "";
      this.setLoading(false);
      if (ret.result) {
        this.hospitalModel!!.imageUrl = ret.data?.imageUrl ?? ""
        return;
      }

      this.fDialogService.warn("imageSelected", ret.msg);
    }
  }
  get imageUrl(): string {
    if ((this.hospitalModel?.imageUrl?.length ?? 0) > 0) {
      return this.hospitalModel!!.imageUrl;
    }

    return FConstants.ASSETS_NO_IMAGE;
  }
  imageView(): void {
    const buff = this.hospitalModel;
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
}
