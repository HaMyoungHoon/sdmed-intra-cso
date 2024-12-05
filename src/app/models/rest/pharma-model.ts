import {BillType} from "./bill-type";
import {PharmaType} from "./pharma-type";
import {PharmaGroup} from "./pharma-group";
import {ContractType} from "./contract-type";
import {DeliveryDiv} from "./delivery-div";
import {MedicineModel} from "./medicine-model";

export class PharmaModel {
  thisPK: string = "";
  code: number = 0;
  orgName: string = "";
  innerName: string = "";
  ownerName: string = "";
  taxpayerNumber: string = "";
  phoneNumber: string = "";
  faxNumber: string = "";
  zipCode: string = "";
  address: string = "";
  addressDetail: string = "";
  businessType: string = "";
  businessItem: string = "";
  billType: BillType = BillType.None;
  pharmaType: PharmaType = PharmaType.None;
  pharmaGroup: PharmaGroup = PharmaGroup.None;
  contractType: ContractType = ContractType.None;
  deliveryDiv: DeliveryDiv = DeliveryDiv.None;
  mail: string = "";
  mobilePhone: string = "";
  openDate?: Date;
  closeDate?: Date;
  etc1: string = "";
  etc2: string = "";
  imageUrl: string = "";
  inVisible: boolean = false;
  medicineList: MedicineModel[] = [];
  relationMedicineList: MedicineModel[] = [];

  copyLhsFromRhs(lhs: PharmaModel, rhs: PharmaModel): void {
    lhs.thisPK = rhs.thisPK;
    lhs.code = rhs.code;
    lhs.orgName = rhs.orgName;
    lhs.innerName = rhs.innerName;
    lhs.ownerName = rhs.ownerName;
    lhs.taxpayerNumber = rhs.taxpayerNumber;
    lhs.phoneNumber = rhs.phoneNumber;
    lhs.faxNumber = rhs.faxNumber;
    lhs.zipCode = rhs.zipCode;
    lhs.address = rhs.address;
    lhs.addressDetail = rhs.addressDetail;
    lhs.businessType = rhs.businessType;
    lhs.businessItem = rhs.businessItem;
    lhs.billType = rhs.billType;
    lhs.pharmaType = rhs.pharmaType;
    lhs.pharmaGroup = rhs.pharmaGroup;
    lhs.contractType = rhs.contractType;
    lhs.deliveryDiv = rhs.deliveryDiv;
    lhs.mail = rhs.mail;
    lhs.mobilePhone = rhs.mobilePhone;
    lhs.openDate = rhs.openDate;
    lhs.closeDate = rhs.closeDate;
    lhs.etc1 = rhs.etc1;
    lhs.etc2 = rhs.etc2;
    lhs.imageUrl = rhs.imageUrl;
    lhs.inVisible = rhs.inVisible;
    lhs.medicineList = rhs.medicineList;
    lhs.relationMedicineList = rhs.relationMedicineList;
  }
}
