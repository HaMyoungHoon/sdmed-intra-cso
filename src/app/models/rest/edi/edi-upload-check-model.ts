import {EdiUploadCheckSubModel} from "./edi-upload-check-sub-model";

export class EdiUploadCheckModel {
  name: string = "";
  userPK: string = "";
  hospitalPK: string = "";
  hospitalName: string = "";
  subModel: EdiUploadCheckSubModel[] = [];
}
