import { Injectable } from '@angular/core';
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {RestResult} from "../../models/common/rest-result";
import {EdiUploadCheckModel} from "../../models/rest/edi/edi-upload-check-model";
import {UserDataModel} from "../../models/rest/user/user-data-model";

@Injectable({
  providedIn: 'root'
})
export class EdiCheckListService {
  private baseUrl = "/apiCSO/intra/ediCheck";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  getList(date: string, isEDIDate: boolean = true, isMyChild: boolean = true): Promise<RestResult<EdiUploadCheckModel[]>> {
    this.httpResponse.addParam("date", date);
    this.httpResponse.addParam("isEDIDate", isEDIDate);
    this.httpResponse.addParam("isMyChild", isMyChild);
    return this.httpResponse.get(`${this.baseUrl}/list`);
  }
  getData(date: string, userPK: string, isEDIDate: boolean = true): Promise<RestResult<EdiUploadCheckModel[]>> {
    this.httpResponse.addParam("date", date);
    this.httpResponse.addParam("isEDIDate", isEDIDate);
    return this.httpResponse.get(`${this.baseUrl}/data/${userPK}`);
  }
  getUserList(isMyChild: boolean = true): Promise<RestResult<UserDataModel[]>> {
    this.httpResponse.addParam("isMyChild", isMyChild);
    return this.httpResponse.get(`${this.baseUrl}/list/user`);
  }
}
