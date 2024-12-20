import {RequestType, stringToRequestType} from "./request-type";
import {ResponseType, stringToResponseType} from "./response-type";

export class RequestModel {
  thisPK: string = "";
  requestUserPK: string = "";
  requestItemPK: string = "";
  responseUserPK: string = "";
  requestUserID: string = "";
  requestType: RequestType = RequestType.SignUp;
  responseType: ResponseType = ResponseType.None;
  requestDate: Date = new Date;
  responseDate?: Date;
  constructor(data: RequestModel | undefined = undefined) {
    if (data) {
      this.copyRhs(data);
    }
  }

  copyLhsFromRhs(lhs: RequestModel, rhs: RequestModel): void {
    lhs.thisPK = rhs.thisPK
    lhs.requestUserPK = rhs.requestUserPK
    lhs.requestItemPK = rhs.requestItemPK
    lhs.responseUserPK = rhs.responseUserPK
    lhs.requestUserID = rhs.requestUserID
    lhs.requestType = rhs.requestType
    lhs.responseType = rhs.responseType
    lhs.requestDate = rhs.requestDate
    lhs.responseDate = rhs.responseDate
  }
  copyRhs(rhs: RequestModel): void {
    this.thisPK = rhs.thisPK
    this.requestUserPK = rhs.requestUserPK
    this.requestItemPK = rhs.requestItemPK
    this.responseUserPK = rhs.responseUserPK
    this.requestUserID = rhs.requestUserID
    this.requestType = rhs.requestType
    this.responseType = rhs.responseType
    this.requestDate = rhs.requestDate
    this.responseDate = rhs.responseDate
  }
}
