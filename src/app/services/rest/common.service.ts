import { Injectable } from "@angular/core";
import {RestResult} from "../../models/common/rest-result";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {UserDataModel} from "../../models/rest/user/user-data-model";
import {UserStatus} from "../../models/rest/user/user-status";
import {HttpResponse} from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class CommonService {
  private baseUrl = "/apiCSO/common";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  signIn(id: string, pw: string): Promise<RestResult<string>> {
    this.httpResponse.addParam("id", id);
    this.httpResponse.addParam("pw", pw);
    return this.httpResponse.get(`${this.baseUrl}/signIn`);
  }
  signUp(confirmPW: string, data: UserDataModel): Promise<RestResult<UserDataModel>> {
    this.httpResponse.addParam("confirmPW", confirmPW);
    return this.httpResponse.post(`${this.baseUrl}/signUp`, data);
  }
  newUser(confirmPW: string, data: UserDataModel): Promise<RestResult<UserDataModel>> {
    this.httpResponse.addParam("confirmPW", confirmPW);
    return this.httpResponse.post(`${this.baseUrl}/newUser`, data);
  }
  tokenRefresh(): Promise<RestResult<string>> {
    return this.httpResponse.post(`${this.baseUrl}/tokenRefresh`);
  }
  setLanguage(lang: string): Promise<RestResult<null>> {
    this.httpResponse.addParam("lang", lang);
    return this.httpResponse.post(`${this.baseUrl}/lang`);
  }
  getMyRole(): Promise<RestResult<number>> {
    return this.httpResponse.get(`${this.baseUrl}/myRole`);
  }
  getMyState(): Promise<RestResult<UserStatus>> {
    return this.httpResponse.get(`${this.baseUrl}/myState`);
  }
  getGenerateSas(blobUrl: string, containerName: string = ""): Promise<RestResult<string>> {
    if (containerName.length > 0) {
      this.httpResponse.addParam("containerName", containerName);
    }
    this.httpResponse.addParam("blobUrl", blobUrl);
    return this.httpResponse.get(`${this.baseUrl}/generate/sas`);
  }


  downloadFile(url: string): Promise<HttpResponse<Blob>> {
    return this.httpResponse.getBlob(url);
  }
}
