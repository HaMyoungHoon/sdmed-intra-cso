import {Component} from "@angular/core";
import {Button} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {CardModule} from "primeng/card";
import {CheckboxModule} from "primeng/checkbox";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {IconFieldModule} from "primeng/iconfield";
import {ImageModule} from "primeng/image";
import {InputIconModule} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
import {NgIf} from "@angular/common";
import {PickListModule} from "primeng/picklist";
import {ProgressSpinComponent} from "../progress-spin/progress-spin.component";
import {TranslatePipe} from "@ngx-translate/core";
import {PharmaListService} from "../../../services/rest/pharma-list.service";
import {PharmaModel} from "../../../models/rest/pharma-model";
import {allBillTypeDescArray, BillType, BillTypeDescToBillType, billTypeToBillTypeDesc} from "../../../models/rest/bill-type";
import {allPharmaTypeDescArray, PharmaType, PharmaTypeDescToPharmaType, pharmaTypeToPharmaTypeDesc} from "../../../models/rest/pharma-type";
import {allPharmaGroupDescArray, PharmaGroup, PharmaGroupDescToPharmaGroup, pharmaGroupToPharmaGroupDesc} from "../../../models/rest/pharma-group";
import {allContractTypeDescArray, ContactTypeDescToContactType, ContractType, contractTypeToContractTypeDesc} from "../../../models/rest/contract-type";
import {allDeliveryDivDescArray, DeliveryDiv, DeliveryDivDescToDeliveryDiv, deliveryDivToDeliveryDivDesc} from "../../../models/rest/delivery-div";
import {UserRole} from "../../../models/rest/user-role";
import {FDialogComponentBase} from "../../../guards/f-dialog-component-base";
import {restTry} from "../../../guards/f-extensions";

@Component({
  selector: "app-pharma-add-dialog",
	imports: [ Button, CalendarModule, CardModule, CheckboxModule, DropdownModule, FormsModule, IconFieldModule, ImageModule, InputIconModule, InputTextModule, NgIf, PickListModule, ProgressSpinComponent, TranslatePipe],
  templateUrl: "./pharma-add-dialog.component.html",
  styleUrl: "./pharma-add-dialog.component.scss",
  standalone: true,
})
export class PharmaAddDialogComponent extends FDialogComponentBase {
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
  constructor(private thisService: PharmaListService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.PharmaChanger));
    this.initLayoutData();
  }

  override async ngInit(): Promise<void> {

  }
  initLayoutData(): void {
  }

  async saveData(): Promise<void> {
    if (this.pharmaModel.code <= 0) {
      this.translateService.get("pharma-add-dialog.warn.code").subscribe(x => {
        this.fDialogService.warn("saveData", x);
      });
      return
    }
    if (this.pharmaModel.orgName.length <= 0) {
      this.translateService.get("pharma-add-dialog.warn.org-name").subscribe(x => {
        this.fDialogService.warn("saveData", x);
      });
      return;
    }
    if (this.pharmaModel.innerName.length <= 0) {
      this.translateService.get("pharma-add-dialog.warn.inner-name").subscribe(x => {
        this.fDialogService.warn("saveData", x);
      });
      return;
    }
    this.pharmaModel.billType = BillTypeDescToBillType[this.selectBillType];
    this.pharmaModel.pharmaType = PharmaTypeDescToPharmaType[this.selectPharmaType];
    this.pharmaModel.pharmaGroup = PharmaGroupDescToPharmaGroup[this.selectPharmaType];
    this.pharmaModel.contractType = ContactTypeDescToContactType[this.selectContractType];
    this.pharmaModel.deliveryDiv = DeliveryDivDescToDeliveryDiv[this.selectDeliveryDiv];
    this.setLoading();

    const ret = await restTry(async() => await this.thisService.postData(this.pharmaModel),
      e => this.fDialogService.error("saveData", e));
    this.setLoading(false);
    if (ret.result) {
      this.ref.close(ret.data);
      return;
    }

    this.fDialogService.warn("saveData", ret.msg);
  }
  closeThis(): void {
    this.ref.close();
  }
}
