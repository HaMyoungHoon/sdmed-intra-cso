import {BillType} from "./bill-type";
import {ContractType} from "./contract-type";
import {DeliveryDiv} from "./delivery-div";
import {PharmaModel} from "./pharma-model";

export class HospitalModel {
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
  contractType: ContractType = ContractType.None;
  deliveryDiv: DeliveryDiv = DeliveryDiv.None;
  licenseNumber: string = "";
  nursingHomeNumber: string = "";
  mail: string = "";
  mobilePhone: string = "";
  openDate?: string;
  closeDate?: string;
  etc1: string = "";
  etc2: string = "";
  imageUrl: string = "";
  pharmaList: PharmaModel[] = [];

  copyLhsFromRhs(lhs: HospitalModel, rhs: HospitalModel): void {
    lhs.thisPK = rhs.thisPK
    lhs.code = rhs.code
    lhs.orgName = rhs.orgName
    lhs.innerName = rhs.innerName
    lhs.ownerName = rhs.ownerName
    lhs.taxpayerNumber = rhs.taxpayerNumber
    lhs.phoneNumber = rhs.phoneNumber
    lhs.faxNumber = rhs.faxNumber
    lhs.zipCode = rhs.zipCode
    lhs.address = rhs.address
    lhs.addressDetail = rhs.addressDetail
    lhs.businessType = rhs.businessType
    lhs.businessItem = rhs.businessItem
    lhs.billType = rhs.billType
    lhs.contractType = rhs.contractType
    lhs.deliveryDiv = rhs.deliveryDiv
    lhs.licenseNumber = rhs.licenseNumber
    lhs.nursingHomeNumber = rhs.nursingHomeNumber
    lhs.mail = rhs.mail
    lhs.mobilePhone = rhs.mobilePhone
    lhs.openDate = rhs.openDate
    lhs.closeDate = rhs.closeDate
    lhs.etc1 = rhs.etc1
    lhs.etc2 = rhs.etc2
    lhs.imageUrl = rhs.imageUrl
    lhs.pharmaList = rhs.pharmaList
  }
}
