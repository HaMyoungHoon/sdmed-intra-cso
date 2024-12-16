import { Injectable } from "@angular/core";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {RestResult} from "../../models/common/rest-result";
import {UserDataModel} from "../../models/rest/user/user-data-model";

@Injectable({
  providedIn: "root"
})
export class MyInfoService {
  private baseUrl = "/apiCSO/intra/myInfo";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  getData(childView: boolean = false, relationView: boolean = false): Promise<RestResult<UserDataModel>> {
    this.httpResponse.addParam("childView", childView);
    this.httpResponse.addParam("relationView", relationView);
    return this.httpResponse.get(`${this.baseUrl}/data`);
  }
  putPasswordChange(currentPW: string, afterPW: string, confirmPW: string): Promise<RestResult<UserDataModel>> {
    this.httpResponse.addParam("currentPW", currentPW);
    this.httpResponse.addParam("afterPW", afterPW);
    this.httpResponse.addParam("confirmPW", confirmPW);
    return this.httpResponse.put(`${this.baseUrl}/passwordChange`);
  }
}
