import { Injectable } from "@angular/core";
import {HosPharmaMedicinePairModel} from "../../models/rest/user/hos-pharma-medicine-pair-model";
import {RestResult} from "../../models/common/rest-result";
import {UserDataModel} from "../../models/rest/user/user-data-model";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {HospitalModel} from "../../models/rest/hospital/hospital-model";
import {PharmaModel} from "../../models/rest/pharma/pharma-model";

@Injectable({
  providedIn: "root"
})
export class UserMappingService {
  private baseUrl = "/apiCSO/intra/userMapping";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  getList(): Promise<RestResult<UserDataModel[]>> {
    return this.httpResponse.get(`${this.baseUrl}/list`);
  }
  getData(thisPK: string, childView: boolean = false, relationView: boolean = false, pharmaOwnMedicineView: boolean = false): Promise<RestResult<UserDataModel>> {
    this.httpResponse.addParam("childView", childView);
    this.httpResponse.addParam("relationView", relationView);
    this.httpResponse.addParam("pharmaOwnMedicineView", pharmaOwnMedicineView);
    return this.httpResponse.get(`${this.baseUrl}/data/user/${thisPK}`);
  }
  getHospitalAllSearch(searchString: string, isSearchTypeCode: boolean = false): Promise<RestResult<HospitalModel[]>> {
    this.httpResponse.addParam("searchString", searchString);
    this.httpResponse.addParam("isSearchTypeCode", isSearchTypeCode);
    return this.httpResponse.get(`${this.baseUrl}/list/hospitalSearch`);
  }
  getPharmaAllSearch(searchString: string, isSearchTypeCode: boolean = false): Promise<RestResult<PharmaModel[]>> {
    this.httpResponse.addParam("searchString", searchString);
    this.httpResponse.addParam("isSearchTypeCode", isSearchTypeCode);
    return this.httpResponse.get(`${this.baseUrl}/list/pharmaSearch`)
  }
  getPharmaData(hospitalPK: String, pharmaPK: string, pharmaOwnMedicineView: boolean = false): Promise<RestResult<PharmaModel>> {
    this.httpResponse.addParam("pharmaOwnMedicineView", pharmaOwnMedicineView);
    return this.httpResponse.get(`${this.baseUrl}/data/pharma/${hospitalPK}/${pharmaPK}`);
  }

  putUserRelationModifyByPK(userPK: string, hosPharmaMedicinePairModel: HosPharmaMedicinePairModel[]): Promise<RestResult<UserDataModel>> {
    return this.httpResponse.put(`${this.baseUrl}/data/user/${userPK}`, hosPharmaMedicinePairModel);
  }
  getExcelSample(): Promise<any> {
    return this.httpResponse.getBlob(`${this.baseUrl}/file/sample`);
  }
  getDownloadExcel(): Promise<any> {
    return this.httpResponse.getBlob(`${this.baseUrl}/file/download/excel`);
  }
  postExcel(file: File): Promise<RestResult<string>> {
    const formData = new FormData();
    formData.append("file", file);
    this.httpResponse.setMultipartContentType();
    return this.httpResponse.post(`${this.baseUrl}/file/excel`, formData);
  }
}
