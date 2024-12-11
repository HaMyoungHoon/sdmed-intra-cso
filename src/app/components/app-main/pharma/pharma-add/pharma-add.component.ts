import {Component} from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {UserRole} from "../../../../models/rest/user-role";
import {PharmaModel} from "../../../../models/rest/pharma-model";
import {allBillTypeDescArray, BillType, BillTypeDescToBillType, billTypeToBillTypeDesc} from "../../../../models/rest/bill-type";
import {allPharmaTypeDescArray, PharmaType, PharmaTypeDescToPharmaType, pharmaTypeToPharmaTypeDesc} from "../../../../models/rest/pharma-type";
import {allPharmaGroupDescArray, PharmaGroup, PharmaGroupDescToPharmaGroup, pharmaGroupToPharmaGroupDesc} from "../../../../models/rest/pharma-group";
import {allContractTypeDescArray, ContactTypeDescToContactType, ContractType, contractTypeToContractTypeDesc} from "../../../../models/rest/contract-type";
import {allDeliveryDivDescArray, DeliveryDiv, DeliveryDivDescToDeliveryDiv, deliveryDivToDeliveryDivDesc} from "../../../../models/rest/delivery-div";
import {PharmaListService} from "../../../../services/rest/pharma-list.service";
import {restTry} from "../../../../guards/f-extensions";

@Component({
  selector: "app-pharma-add",
  templateUrl: "./pharma-add.component.html",
  styleUrl: "./pharma-add.component.scss",
  standalone: false,
})
export class PharmaAddComponent extends FComponentBase {
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
  }

  override async ngInit(): Promise<void> {

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
      window.close();
      return;
    }

    this.fDialogService.warn("saveData", ret.msg);
  }
}
