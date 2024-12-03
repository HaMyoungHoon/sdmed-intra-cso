import { Injectable } from "@angular/core";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {RestResult} from "../../models/common/rest-result";
import {MedicineModel} from "../../models/rest/medicine-model";

@Injectable({
  providedIn: "root"
})
export class MedicineService {
//  private baseUrl = "/apiCSO/v1/medicine";
  private baseUrl = "http://localhost:25801/v1/medicine";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  getMedicineAll(): Promise<RestResult<MedicineModel[]>> {
    return this.httpResponse.get(`${this.baseUrl}/all`);
  }
  getMedicineAllPage(page: number, size: number): Promise<RestResult<MedicineModel[]>> {
    return this.httpResponse.get(`${this.baseUrl}/all/${page}/${size}`);
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
