import { Injectable } from "@angular/core";
import {RestResult} from "../../models/common/rest-result";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {PharmaModel} from "../../models/rest/pharma-model";

@Injectable({
  providedIn: "root"
})
export class PharmaService {
//  private baseUrl = "/apiCSO/v1/pharma";
  private baseUrl = "http://localhost:25801/v1/pharma";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  getPharmaAll(): Promise<RestResult<PharmaModel[]>> {
    return this.httpResponse.get(`${this.baseUrl}/all`);
  }
  getPharmaAllPage(page: number, size: number): Promise<RestResult<PharmaModel[]>> {
    return this.httpResponse.get(`${this.baseUrl}/all/${page}/${size}`)
  }
  postDataUploadExcel(applyDate: string, file: File): Promise<RestResult<string>> {
    const formData = new FormData();
    formData.append("file", file, file.name);
    this.httpResponse.addParam("applyDate", applyDate);
    return this.httpResponse.post(`${this.baseUrl}/dataUploadExcel`);
  }
  getSampleDownloadExcel(): Promise<any> {
    return this.httpResponse.get(`${this.baseUrl}/sampleDownloadExcel`);
  }
}
