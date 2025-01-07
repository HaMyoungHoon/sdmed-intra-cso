import {UserStatus} from "./user-status";
import {HospitalModel} from "../hospital/hospital-model";
import {UserFileModel} from "./user-file-model";

export class UserDataModel {
  thisPK: string = "";
  id: string = "";
  pw: string = "";
  name: string = "";
  mail: string = "";
  phoneNumber: string = "";
  role: number = 0;
  dept: number = 0;
  status: UserStatus = UserStatus.None;
  companyName: string = "";
  companyNumber: string = "";
  companyAddress: string = "";
  bankAccount: string = "";
  regDate: string = "";
  lastLoginDate?: string = "";
  motherPK: string = "";
  children: UserDataModel[] = [];
  hosList: HospitalModel[] = [];
  fileList: UserFileModel[] = [];
  copyLhsFromRhs(lhs: UserDataModel, rhs: UserDataModel): void {
    lhs.pw = rhs.pw;
    lhs.name = rhs.name;
    lhs.mail = rhs.mail;
    lhs.phoneNumber = rhs.phoneNumber;
    lhs.role = rhs.role;
    lhs.dept = rhs.dept;
    lhs.status = rhs.status;
    lhs.companyName = rhs.companyName;
    lhs.companyNumber = rhs.companyNumber;
    lhs.companyAddress = rhs.companyAddress;
    lhs.bankAccount = rhs.bankAccount;
    lhs.regDate = rhs.regDate;
    lhs.lastLoginDate = rhs.lastLoginDate;
    lhs.children = rhs.children;
    lhs.hosList = rhs.hosList;
    lhs.fileList = rhs.fileList;
  }
}
