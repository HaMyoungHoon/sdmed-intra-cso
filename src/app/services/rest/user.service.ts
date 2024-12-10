import { Injectable } from "@angular/core";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {RestResult} from "../../models/common/rest-result";
import {UserDataModel} from "../../models/rest/user-data-model";
import {RestPage} from "../../models/common/rest-page";
import {UserStatus} from "../../models/rest/user-status";
import {UserRole} from "../../models/rest/user-role";
import {UserDept} from "../../models/rest/user-dept";
import {HosPharmaMedicinePairModel} from "../../models/rest/hos-pharma-medicine-pair-model";

@Injectable({
  providedIn: "root"
})
export class UserService {
  private baseUrl = "/apiCSO/v1/user";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  signIn(id: string, pw: string): Promise<RestResult<string>> {
    this.httpResponse.addParam("id", id);
    this.httpResponse.addParam("pw", pw);
    return this.httpResponse.get(`${this.baseUrl}/signIn`);
  }
  tokenRefresh(): Promise<RestResult<string>> {
    return this.httpResponse.post(`${this.baseUrl}/tokenRefresh`);
  }
}
