import {EDIState} from "./edi-state";
import {EDIUploadPharmaModel} from "./edi-upload-pharma-model";
import {EDIUploadFileModel} from "./edi-upload-file-model";
import {EDIUploadResponseModel} from "./edi-upload-response-model";

export class EDIUploadModel {
  thisPK: string = "";
  userPK: string = "";
  year: string = "";
  month: string = "";
  day: string = "";
  hospitalPK: string = "";
  orgName: string = "";
  name: string = "";
  ediState: EDIState = EDIState.None;
  regDate: Date = new Date();
  etc: string = "";
  pharmaList: EDIUploadPharmaModel[] = [];
  fileList: EDIUploadFileModel[] = [];
  responseList: EDIUploadResponseModel[] = [];

  copyLhsFromRhs(lhs: EDIUploadModel, rhs: EDIUploadModel): void {
    lhs.thisPK = rhs.thisPK;
    lhs.userPK = rhs.userPK;
    lhs.year = rhs.year;
    lhs.month = rhs.month;
    lhs.day = rhs.day;
    lhs.hospitalPK = rhs.hospitalPK;
    lhs.orgName = rhs.orgName;
    lhs.name = rhs.name;
    lhs.ediState = rhs.ediState;
    lhs.regDate = rhs.regDate;
    lhs.etc = rhs.etc;
    lhs.pharmaList = rhs.pharmaList;
    lhs.fileList = rhs.fileList;
    lhs.responseList = rhs.responseList;
  }
}
