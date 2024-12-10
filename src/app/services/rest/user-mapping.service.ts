import { Injectable } from "@angular/core";
import {HosPharmaMedicinePairModel} from "../../models/rest/hos-pharma-medicine-pair-model";
import {RestResult} from "../../models/common/rest-result";
import {UserDataModel} from "../../models/rest/user-data-model";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {HospitalModel} from "../../models/rest/hospital-model";
import {PharmaModel} from "../../models/rest/pharma-model";

@Injectable({
  providedIn: "root"
})
export class UserMappingService {
  private baseUrl = "/apiCSO/intra/userMapping";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  getUserAllBusiness(): Promise<RestResult<UserDataModel[]>> {
    return this.httpResponse.get(`${this.baseUrl}/all/business`);
  }
  getData(thisPK: string, childView: boolean = false, relationView: boolean = false, pharmaOwnMedicineView: boolean = false): Promise<RestResult<UserDataModel>> {
    this.httpResponse.addParam("childView", childView);
    this.httpResponse.addParam("relationView", relationView);
    this.httpResponse.addParam("pharmaOwnMedicineView", pharmaOwnMedicineView);
    return this.httpResponse.get(`${this.baseUrl}/data/${thisPK}`);
  }
  getHospitalAllSearch(searchString: string, isSearchTypeCode: boolean = false): Promise<RestResult<HospitalModel[]>> {
    this.httpResponse.addParam("searchString", searchString);
    this.httpResponse.addParam("isSearchTypeCode", isSearchTypeCode);
    return this.httpResponse.get(`${this.baseUrl}/all/hospitalSearch`);
  }
  getPharmaAllSearch(searchString: string, isSearchTypeCode: boolean = false): Promise<RestResult<PharmaModel[]>> {
    this.httpResponse.addParam("searchString", searchString);
    this.httpResponse.addParam("isSearchTypeCode", isSearchTypeCode);
    return this.httpResponse.get(`${this.baseUrl}/all/pharmaSearch`)
  }
  getPharmaData(pharmaPK: string, pharmaOwnMedicineView: boolean = false): Promise<RestResult<PharmaModel>> {
    this.httpResponse.addParam("pharmaOwnMedicineView", pharmaOwnMedicineView);
    return this.httpResponse.get(`${this.baseUrl}/${pharmaPK}`);
  }

  putUserRelationModifyByPK(userPK: string, hosPharmaMedicinePairModel: HosPharmaMedicinePairModel[]): Promise<RestResult<UserDataModel>> {
    this.httpResponse.addParam("userPK", userPK);
    return this.httpResponse.put(`${this.baseUrl}/userRelModify/pk`, hosPharmaMedicinePairModel);
  }
}
