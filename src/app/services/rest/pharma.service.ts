import { Injectable } from "@angular/core";
import {RestResult} from "../../models/common/rest-result";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {PharmaModel} from "../../models/rest/pharma-model";
import {HospitalModel} from "../../models/rest/hospital-model";

@Injectable({
  providedIn: "root"
})
export class PharmaService {
  private baseUrl = "/apiCSO/v1/pharma";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  getPharmaAll(): Promise<RestResult<PharmaModel[]>> {
    return this.httpResponse.get(`${this.baseUrl}/all`);
  }
  getPharmaAllPage(page: number, size: number): Promise<RestResult<PharmaModel[]>> {
    return this.httpResponse.get(`${this.baseUrl}/all/${page}/${size}`)
  }
  getPharmaAllSearch(searchString: string, isSearchTypeCode: boolean = false): Promise<RestResult<PharmaModel[]>> {
    this.httpResponse.addParam("searchString", searchString);
    this.httpResponse.addParam("isSearchTypeCode", isSearchTypeCode);
    return this.httpResponse.get(`${this.baseUrl}/all/search`)
  }
  getPharmaData(pharmaPK: string, pharmaOwnMedicineView: boolean = false): Promise<RestResult<PharmaModel>> {
    this.httpResponse.addParam("pharmaOwnMedicineView", pharmaOwnMedicineView);
    return this.httpResponse.get(`${this.baseUrl}/${pharmaPK}`);
  }
  putPharmaModMedicine(pharmaPK: string, medicinePKList: string[]): Promise<RestResult<PharmaModel>> {
    return this.httpResponse.put(`${this.baseUrl}/${pharmaPK}/modMedicine`, medicinePKList);
  }
  postPharmaData(pharmaData: PharmaModel): Promise<RestResult<PharmaModel>> {
    return this.httpResponse.post(`${this.baseUrl}/add`, pharmaData);
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
    return this.httpResponse.getBlob(`${this.baseUrl}/sampleDownloadExcel`);
  }
  putPharmDataModify(pharmaData: PharmaModel): Promise<RestResult<PharmaModel>> {
    return this.httpResponse.put(`${this.baseUrl}/modify`, pharmaData);
  }
}
