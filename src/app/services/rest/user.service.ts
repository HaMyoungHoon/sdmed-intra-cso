import { Injectable } from "@angular/core";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {RestResult} from "../../models/common/rest-result";
import {UserDataModel} from "../../models/rest/user-data-model";
import {RestPage} from "../../models/common/rest-page";
import {UserStatus} from "../../models/rest/user-status";
import {UserRole} from "../../models/rest/user-role";
import {UserDept} from "../../models/rest/user-dept";

@Injectable({
  providedIn: "root"
})
export class UserService {
//  private baseUrl = "/apiCSO/v1/user";
  private baseUrl = "http://localhost:25801/v1/user";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  getUserAll(): Promise<RestResult<UserDataModel[]>> {
    return this.httpResponse.get(`${this.baseUrl}/all`);
  }
  getUserAllPage(page: number, size: number): Promise<RestResult<RestPage<UserDataModel[]>>> {
    this.httpResponse.addParam("page", page);
    this.httpResponse.addParam("size", size);
    return this.httpResponse.get(`${this.baseUrl}/all`);
  }
  signIn(id: string, pw: string): Promise<RestResult<string>> {
    this.httpResponse.addParam("id", id);
    this.httpResponse.addParam("pw", pw);
    return this.httpResponse.get(`${this.baseUrl}/signIn`);
  }
  putPasswordChange(id: string, changePW: string): Promise<RestResult<UserDataModel>> {
    this.httpResponse.addParam("id", id);
    this.httpResponse.addParam("changePW", changePW);
    return this.httpResponse.put(`${this.baseUrl}/passwordChange`);
  }
  tokenRefresh(): Promise<RestResult<string>> {
    return this.httpResponse.post(`${this.baseUrl}/tokenRefresh`);
  }
  getUserData(id?: string): Promise<RestResult<UserDataModel>> {
    if (id != null) {
      this.httpResponse.addParam("id", id);
    }
    return this.httpResponse.get(`${this.baseUrl}/userData`);
  }
  putUserRoleModify(id: string, roles: UserRole[]): Promise<RestResult<UserDataModel>> {
    this.httpResponse.addParam("id", id);
    return this.httpResponse.put(`${this.baseUrl}/userRoleModify`, roles.map((x) => UserRole[x]));
  }
  putUserDeptModify(id: string, depts: UserDept[]): Promise<RestResult<UserDataModel>> {
    this.httpResponse.addParam("id", id);
    return this.httpResponse.put(`${this.baseUrl}/userDeptModify`, depts);
  }
  putUserStatusModify(id: string, status: UserStatus): Promise<RestResult<UserDataModel>> {
    this.httpResponse.addParam("id", id);
    this.httpResponse.addParam("status", status);
    return this.httpResponse.put(`${this.baseUrl}/userStatusModify`);
  }
  postDataUploadExcel(file: File): Promise<RestResult<string>> {
    const formData = new FormData();
    formData.append("file", file, file.name);
    return this.httpResponse.post(`${this.baseUrl}/dataUploadExcel`);
  }
  getSampleDownloadExcel(): Promise<any> {
    return this.httpResponse.getBlob(`${this.baseUrl}/sampleDownloadExcel`);
  }
  postAddChild(motherID: string, childID: string[]): Promise<RestResult<UserDataModel>> {
    this.httpResponse.addParam("motherID", motherID);
    return this.httpResponse.post(`${this.baseUrl}/addChild`, childID);
  }
  putDelChild(motherID: string, childID: string[]): Promise<RestResult<UserDataModel>> {
    this.httpResponse.addParam("motherID", motherID);
    return this.httpResponse.put(`${this.baseUrl}/delChild`);
  }
}
