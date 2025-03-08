import {EdiUploadCheckSubModel} from "./edi-upload-check-sub-model";

export class EdiUploadCheckModel {
  id: string = "";
  name: string = "";
  userPK: string = "";
  hospitalPK: string = "";
  orgName: string = "";
  innerName: string = "";
  subModel: EdiUploadCheckSubModel[] = [];
}
