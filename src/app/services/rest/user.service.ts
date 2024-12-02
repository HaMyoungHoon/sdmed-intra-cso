import { Injectable } from "@angular/core";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {RestResult} from "../../models/common/rest-result";
import {UserDataModel} from "../../models/rest/user-data-model";
import {RestPage} from "../../models/common/rest-page";
import {UserStatus} from "../../models/rest/user-status";
import {UserRole} from "../../models/rest/user-role";
import {UserDept} from "../../models/rest/user-dept";
import {HosPharmaMedicinePairModel} from "../../models/rest/HosPharmaMedicinePairModel";

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
  getUserAllBusiness(): Promise<RestResult<UserDataModel[]>> {
    return this.httpResponse.get(`${this.baseUrl}/all/business`);
  }
  signIn(id: string, pw: string): Promise<RestResult<string>> {
    this.httpResponse.addParam("id", id);
    this.httpResponse.addParam("pw", pw);
    return this.httpResponse.get(`${this.baseUrl}/signIn`);
  }
  putPasswordChangeByID(id: string, changePW: string): Promise<RestResult<UserDataModel>> {
    this.httpResponse.addParam("id", id);
    this.httpResponse.addParam("changePW", changePW);
    return this.httpResponse.put(`${this.baseUrl}/passwordChange/id`);
  }
  putPasswordChangeByPK(userPK: string, changePW: string): Promise<RestResult<UserDataModel>> {
    this.httpResponse.addParam("userPK", userPK);
    this.httpResponse.addParam("changePW", changePW);
    return this.httpResponse.put(`${this.baseUrl}/passwordChange/pk`);
  }

  tokenRefresh(): Promise<RestResult<string>> {
    return this.httpResponse.post(`${this.baseUrl}/tokenRefresh`);
  }
  getUserDataByID(id?: string, childView: boolean = false, relationView: boolean = false, pharmaOwnMedicineView: boolean = false): Promise<RestResult<UserDataModel>> {
    if (id != null) {
      this.httpResponse.addParam("id", id);
    }
    this.httpResponse.addParam("childView", childView);
    this.httpResponse.addParam("relationView", relationView);
    this.httpResponse.addParam("pharmaOwnMedicineView", pharmaOwnMedicineView);
    return this.httpResponse.get(`${this.baseUrl}/userData/id`);
  }
  getUserDataByPK(userPK: string, childView: boolean = false, relationView: boolean = false, pharmaOwnMedicineView: boolean = false): Promise<RestResult<UserDataModel>> {
    this.httpResponse.addParam("userPK", userPK);
    this.httpResponse.addParam("childView", childView);
    this.httpResponse.addParam("relationView", relationView);
    this.httpResponse.addParam("pharmaOwnMedicineView", pharmaOwnMedicineView);
    return this.httpResponse.get(`${this.baseUrl}/userData/pk`);
  }

  putUserRelationModifyByPK(userPK: string, hosPharmaMedicinePairModel: HosPharmaMedicinePairModel[]): Promise<RestResult<UserDataModel>> {
    this.httpResponse.addParam("userPK", userPK);
    return this.httpResponse.put(`${this.baseUrl}/userRelModify/pk`, hosPharmaMedicinePairModel);
  }

  getMyRole(): Promise<RestResult<number>> {
    return this.httpResponse.get(`${this.baseUrl}/myRole`);
  }
  putUserRoleModifyByPK(userPK: string, roles: UserRole[]): Promise<RestResult<UserDataModel>> {
    this.httpResponse.addParam("userPK", userPK);
    return this.httpResponse.put(`${this.baseUrl}/userRoleModify/pk`, roles.map((x) => UserRole[x]));
  }
  putUserDeptModifyByPK(userPK: string, depts: UserDept[]): Promise<RestResult<UserDataModel>> {
    this.httpResponse.addParam("userPK", userPK);
    return this.httpResponse.put(`${this.baseUrl}/userDeptModify/pk`, depts);
  }
  putUserStatusModifyByPK(userPK: string, status: UserStatus): Promise<RestResult<UserDataModel>> {
    this.httpResponse.addParam("userPK", userPK);
    this.httpResponse.addParam("status", status);
    return this.httpResponse.put(`${this.baseUrl}/userStatusModify/pk`);
  }
  putUserRoleDeptStatusModifyByPK(userPK: string, roles: UserRole[], depts: UserDept[], status: UserStatus): Promise<RestResult<UserDataModel>> {
    this.httpResponse.addParam("userPK", userPK);
    this.httpResponse.addParam("status", status);
    const json = {
      "roles": roles.map((x) => UserRole[x]),
      "depts": depts.map((x) => UserDept[x]),
      "status": status
    };
    return this.httpResponse.put(`${this.baseUrl}/userRoleDeptStatusModify/pk`, json);
  }

  putUserBankImageUploadByPK(userPK: string, file: File): Promise<RestResult<UserDataModel>> {
    const formData = new FormData();
    formData.append("userPK", userPK);
    formData.append("file", file);
    this.httpResponse.setMultipartContentType();
    return this.httpResponse.put(`${this.baseUrl}/userBankImageUpload/pk`, formData);
  }
  putUserTaxImageUploadByPK(userPK: string, file: File): Promise<RestResult<UserDataModel>> {
    const formData = new FormData();
    formData.append("userPK", userPK);
    formData.append("file", file);
    this.httpResponse.setMultipartContentType();
    return this.httpResponse.put(`${this.baseUrl}/userTaxImageUpload/pk`, formData);
  }
  postDataUploadExcel(file: File): Promise<RestResult<string>> {
    const formData = new FormData();
    formData.append("file", file, file.name);
    return this.httpResponse.post(`${this.baseUrl}/dataUploadExcel`);
  }
  getSampleDownloadExcel(): Promise<any> {
    return this.httpResponse.getBlob(
      `${this.baseUrl}/sampleDownloadExcel`);
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
