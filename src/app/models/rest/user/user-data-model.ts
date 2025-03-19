import {UserStatus} from "./user-status";
import {HospitalModel} from "../hospital/hospital-model";
import {UserFileModel} from "./user-file-model";
import {UserTrainingModel} from "./user-training-model";

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
  companyInnerName: string = "";
  companyNumber: string = "";
  companyAddress: string = "";
  bankAccount: string = "";
  csoReportDate?: Date;
  contractDate?: Date;
  regDate: Date = new Date();
  lastLoginDate?: Date;
  motherPK: string = "";
  children: UserDataModel[] = [];
  hosList: HospitalModel[] = [];
  fileList: UserFileModel[] = [];
  trainingList: UserTrainingModel[] = [];
  copyLhsFromRhs(lhs: UserDataModel, rhs: UserDataModel): void {
    lhs.pw = rhs.pw;
    lhs.name = rhs.name;
    lhs.mail = rhs.mail;
    lhs.phoneNumber = rhs.phoneNumber;
    lhs.role = rhs.role;
    lhs.dept = rhs.dept;
    lhs.status = rhs.status;
    lhs.companyName = rhs.companyName;
    lhs.companyInnerName = rhs.companyInnerName;
    lhs.companyNumber = rhs.companyNumber;
    lhs.companyAddress = rhs.companyAddress;
    lhs.bankAccount = rhs.bankAccount;
    lhs.csoReportDate = rhs.csoReportDate;
    lhs.contractDate = rhs.contractDate;
    lhs.regDate = rhs.regDate;
    lhs.lastLoginDate = rhs.lastLoginDate;
    lhs.children = rhs.children;
    lhs.hosList = rhs.hosList;
    lhs.fileList = rhs.fileList;
    lhs.trainingList = rhs.trainingList;
  }
}
