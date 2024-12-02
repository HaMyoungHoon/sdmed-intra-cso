import { Injectable } from "@angular/core";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {RestResult} from "../../models/common/rest-result";
import {HospitalModel} from "../../models/rest/hospital-model";

@Injectable({
  providedIn: "root"
})
export class HospitalService {
//  private baseUrl = "/apiCSO/v1/hospital";
  private baseUrl = "http://localhost:25801/v1/hospital";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  getHospitalAll(): Promise<RestResult<HospitalModel[]>> {
    return this.httpResponse.get(`${this.baseUrl}/all`)
  }
  getHospitalAllPage(page: number, size: number): Promise<RestResult<HospitalModel[]>> {
    return this.httpResponse.get(`${this.baseUrl}/all/${page}/${size}`)
  }
  getHospitalAllSearch(searchString: string, isSearchTypeCode: boolean = false): Promise<RestResult<HospitalModel[]>> {
    this.httpResponse.addParam("searchString", searchString);
    this.httpResponse.addParam("isSearchTypeCode", isSearchTypeCode);
    return this.httpResponse.get(`${this.baseUrl}/all/search`);
  }
  postDataUploadExcel(file: File): Promise<RestResult<string>> {
    const formData = new FormData();
    formData.append("file", file, file.name);
    return this.httpResponse.post(`${this.baseUrl}/dataUploadExcel`);
  }
  getSampleDownloadExcel(): Promise<any> {
    return this.httpResponse.get(`${this.baseUrl}/sampleDownloadExcel`);
  }
}
