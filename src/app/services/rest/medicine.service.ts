import { Injectable } from "@angular/core";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {RestResult} from "../../models/common/rest-result";
import {MedicineModel} from "../../models/rest/medicine-model";
import {MedicinePriceModel} from "../../models/rest/medicine-price-model";

@Injectable({
  providedIn: "root"
})
export class MedicineService {
  private baseUrl = "/apiCSO/v1/medicine";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  getMedicineAll(withAllPrice: boolean = false): Promise<RestResult<MedicineModel[]>> {
    this.httpResponse.addParam("withPrice", withAllPrice);
    return this.httpResponse.get(`${this.baseUrl}/all`);
  }
  getMedicineAllPage(page: number, size: number): Promise<RestResult<MedicineModel[]>> {
    return this.httpResponse.get(`${this.baseUrl}/all/${page}/${size}`);
  }
  getMedicinePriceList(kdCode: number): Promise<RestResult<MedicinePriceModel[]>> {
    this.httpResponse.addParam("kdCode", kdCode);
    return this.httpResponse.get(`${this.baseUrl}/price`);
  }
  getMedicineAllSearch(searchString: string, isSearchTypeCode: boolean = false): Promise<RestResult<MedicineModel[]>> {
    this.httpResponse.addParam("searchString", searchString);
    this.httpResponse.addParam("isSearchTypeCode", isSearchTypeCode);
    return this.httpResponse.get(`${this.baseUrl}/all/search`);
  }
  postDataUploadExcel(applyDate: string, file: File): Promise<RestResult<string>> {
    const formData = new FormData();
    formData.append("file", file);
    this.httpResponse.addParam("applyDate", applyDate);
    this.httpResponse.setMultipartContentType();
    return this.httpResponse.post(`${this.baseUrl}/dataUploadExcel`, formData);
  }
  getSampleDownloadExcel(): Promise<any> {
    return this.httpResponse.get(`${this.baseUrl}/sampleDownloadExcel`);
  }
}
