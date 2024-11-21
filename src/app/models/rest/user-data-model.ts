import {UserStatus} from "./user-status";

export interface UserDataModel {
  thisIndex: number;
  id: string;
  pw: string;
  name: string;
  mail: string;
  phoneNumber: string;
  role: number;
  dept: number;
  status: UserStatus;
  taxpayerImageUrl: string;
  companyName: string;
  companyNumber: string;
  companyAddress: string;
  bankAccountImageUrl: string;
  bankAccount: string;
  regDate: string;
  lastLoginDate?: string;
  children?: UserDataModel[];
}
