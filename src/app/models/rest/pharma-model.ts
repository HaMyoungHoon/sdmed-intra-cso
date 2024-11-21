import {BillType} from "./bill-type";
import {PharmaType} from "./pharma-type";
import {PharmaGroup} from "./pharma-group";
import {ContractType} from "./contract-type";
import {DeliveryDiv} from "./delivery-div";

export interface PharmaModel {
  thisIndex: number;
  code: number;
  orgName: string;
  innerName: string;
  ownerName: string;
  taxpayerNumber: string;
  phoneNumber: string;
  faxNumber: string;
  zipCode: string;
  address: string;
  addressDetail: string;
  businessType: string;
  businessItem: string;
  billType: BillType;
  pharmaType: PharmaType;
  pharmaGroup: PharmaGroup;
  contractType: ContractType;
  deliveryDiv: DeliveryDiv;
  mail: string;
  mobilePhone: string;
  openDate?: string;
  closeDate?: string;
  etc1: string;
  etc2: string;
  imageUrl: string;
}
