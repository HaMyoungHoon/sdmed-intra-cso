import { Injectable } from "@angular/core";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {PharmaModel} from "../../models/rest/pharma/pharma-model";
import {RestResult} from "../../models/common/rest-result";
import {MedicineModel} from "../../models/rest/medicine/medicine-model";
import {BlobUploadModel} from "../../models/rest/blob-upload-model";

@Injectable({
  providedIn: "root"
})
export class PharmaListService {
  private baseUrl = "/apiCSO/intra/pharmaList";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  getList(): Promise<RestResult<PharmaModel[]>> {
    return this.httpResponse.get(`${this.baseUrl}/list`);
  }
  getData(thisPK: string, pharmaOwnMedicineView: boolean = false): Promise<RestResult<PharmaModel>> {
    this.httpResponse.addParam("pharmaOwnMedicineView", pharmaOwnMedicineView);
    return this.httpResponse.get(`${this.baseUrl}/data/${thisPK}`);
  }
  getMedicine(searchString: string, isSearchTypeCode: boolean = false): Promise<RestResult<MedicineModel[]>> {
    this.httpResponse.addParam("searchString", searchString);
    this.httpResponse.addParam("isSearchTypeCode", isSearchTypeCode);
    return this.httpResponse.get(`${this.baseUrl}/medicine/list`);
  }
  getExcelSample(): Promise<any> {
    return this.httpResponse.getBlob(`${this.baseUrl}/file/sample`);
  }

  postExcel(file: File): Promise<RestResult<string>> {
    const formData = new FormData();
    formData.append("file", file);
    this.httpResponse.setMultipartContentType();
    return this.httpResponse.post(`${this.baseUrl}/file/excel`, formData);
  }
  postData(pharmaModel: PharmaModel): Promise<RestResult<PharmaModel>> {
    return this.httpResponse.post(`${this.baseUrl}/data`, pharmaModel);
  }
  postImage(thisPK: string, file: File): Promise<RestResult<PharmaModel>> {
    const formData = new FormData();
    formData.append("file", file);
    this.httpResponse.setMultipartContentType();
    return this.httpResponse.post(`${this.baseUrl}/file/${thisPK}/image`, formData);
  }

  putData(pharmaModel: PharmaModel): Promise<RestResult<PharmaModel>> {
    return this.httpResponse.put(`${this.baseUrl}/data`, pharmaModel);
  }
  putMedicine(thisPK: string, medicinePKList: string[]): Promise<RestResult<PharmaModel>> {
    return this.httpResponse.put(`${this.baseUrl}/data/${thisPK}/medicine/list`, medicinePKList);
  }
  putImage(thisPK: string, blobModel: BlobUploadModel): Promise<RestResult<PharmaModel>> {
    return this.httpResponse.put(`${this.baseUrl}/file/${thisPK}/image`, blobModel);
  }
}
