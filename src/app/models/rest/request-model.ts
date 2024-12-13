import {RequestType} from "./request-type";
import {ResponseType} from "./response-type";

export class RequestModel {
  thisPK: string = "";
  requestUserPK: string = "";
  requestItemPK: string = "";
  responseUserPK: string = "";
  requestType: RequestType = RequestType.SignUp;
  responseType: ResponseType = ResponseType.None;
  requestDate: string = "";
  responseDate: string = "";
}
