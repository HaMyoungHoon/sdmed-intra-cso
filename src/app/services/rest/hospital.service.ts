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
  getHospitalData(thisPK: string): Promise<RestResult<HospitalModel>> {
    return this.httpResponse.get(`${this.baseUrl}/${thisPK}`);
  }
  postDataUploadExcel(file: File): Promise<RestResult<string>> {
    const formData = new FormData();
    formData.append("file", file);
    this.httpResponse.setMultipartContentType();
    return this.httpResponse.post(`${this.baseUrl}/dataUploadExcel`, formData);
  }
  postImageUpload(thisPK: string, file: File): Promise<RestResult<HospitalModel>> {
    const formData = new FormData();
    formData.append("thisPK", thisPK);
    formData.append("file", file);
    this.httpResponse.setMultipartContentType();
    return this.httpResponse.post(`${this.baseUrl}/imageUpload`, formData);
  }
  getSampleDownloadExcel(): Promise<any> {
    return this.httpResponse.get(`${this.baseUrl}/sampleDownloadExcel`);
  }
  putHospitalDataModify(hospitalData: HospitalModel): Promise<RestResult<HospitalModel>> {
    return this.httpResponse.put(`${this.baseUrl}/modify`, hospitalData);
  }
}
