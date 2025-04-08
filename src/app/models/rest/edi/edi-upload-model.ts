import {EDIState} from "./edi-state";
import {EDIUploadPharmaModel} from "./edi-upload-pharma-model";
import {EDIUploadResponseModel} from "./edi-upload-response-model";
import {EDIType} from "./edi-type";

export class EDIUploadModel {
  thisPK: string = "";
  userPK: string = "";
  year: string = "";
  month: string = "";
  day: string = "";
  hospitalPK: string = "";
  orgName: string = "";
  tempHospitalPK: string = "";
  tempOrgName: string = "";
  id: string = "";
  name: string = "";
  ediState: EDIState = EDIState.None;
  ediStateDesc: string = "";
  ediType: EDIType = EDIType.DEFAULT;
  regDate: Date = new Date();
  etc: string = "";
  pharmaList: EDIUploadPharmaModel[] = [];
  responseList: EDIUploadResponseModel[] = [];

  copyLhsFromRhs(lhs: EDIUploadModel, rhs: EDIUploadModel): void {
    lhs.thisPK = rhs.thisPK;
    lhs.userPK = rhs.userPK;
    lhs.year = rhs.year;
    lhs.month = rhs.month;
    lhs.day = rhs.day;
    lhs.hospitalPK = rhs.hospitalPK;
    lhs.orgName = rhs.orgName;
    lhs.tempHospitalPK = rhs.tempHospitalPK;
    lhs.tempOrgName = rhs.tempOrgName;
    lhs.name = rhs.name;
    lhs.ediState = rhs.ediState;
    lhs.ediStateDesc = rhs.ediStateDesc;
    lhs.ediType = rhs.ediType;
    lhs.regDate = rhs.regDate;
    lhs.etc = rhs.etc;
    lhs.pharmaList = rhs.pharmaList;
    lhs.responseList = rhs.responseList;
  }
}
