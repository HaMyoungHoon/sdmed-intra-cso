import {EDIState} from "./edi-state";

export class EdiUploadCheckSubModel {
  userPK: String = "";
  hospitalPK: String = "";
  pharmaPK?: String;
  pharmaName?: String;
  ediState?: EDIState;
  regDate?: Date;
  ediPK: String = "";
  reqApplyYear: String = "";
  reqApplyMonth: String = "";
  reqApplyDay: String = "";
  actualApplyYear?: String;
  actualApplyMonth?: String;
  actualApplyDay?: String;
  isCarriedOver: Boolean = false;
}
