import { Injectable } from "@angular/core";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {RestResult} from "../../models/common/rest-result";
import {HospitalModel} from "../../models/rest/hospital-model";
import {BlobUploadModel} from "../../models/rest/blob-upload-model";
import {getRandomUUID, getThisPK} from "../../guards/f-amhohwa";
import {currentDateYYYYMMdd, getMimeTypeExt} from "../../guards/f-extensions";

@Injectable({
  providedIn: "root"
})
export class HospitalListService {
  private baseUrl = "/apiCSO/intra/hospitalList";
  private blobUrl = "https://mhhablob1.blob.core.windows.net";
  private containerName = "mhhablob1";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  getList(): Promise<RestResult<HospitalModel[]>> {
    return this.httpResponse.get(`${this.baseUrl}/list`);
  }
  getData(thisPK: string): Promise<RestResult<HospitalModel>> {
    return this.httpResponse.get(`${this.baseUrl}/data/${thisPK}`);
  }
  postExcel(file: File): Promise<RestResult<string>> {
    const formData = new FormData();
    formData.append("file", file);
    this.httpResponse.setMultipartContentType();
    return this.httpResponse.post(`${this.baseUrl}/file/excel`, formData);
  }
  postData(hospitalModel: HospitalModel): Promise<RestResult<HospitalModel>> {
    return this.httpResponse.post(`${this.baseUrl}/data`, hospitalModel);
  }
  getExcelSample(): Promise<any> {
    return this.httpResponse.getBlob(`${this.baseUrl}/file/sample`);
  }
  putData(hospitalModel: HospitalModel): Promise<RestResult<HospitalModel>> {
    return this.httpResponse.put(`${this.baseUrl}/data`, hospitalModel);
  }
  postImage(thisPK: string, file: File): Promise<RestResult<HospitalModel>> {
    const formData = new FormData();
    formData.append("file", file);
    this.httpResponse.setMultipartContentType();
    return this.httpResponse.post(`${this.baseUrl}/file/${thisPK}/image`);
  }
  putImage(thisPK: string, blobModel: BlobUploadModel): Promise<RestResult<HospitalModel>> {
    return this.httpResponse.put(`${this.baseUrl}/file/${thisPK}/image`, blobModel);
  }
  getBlobModel(file: File, ext: string): BlobUploadModel {
    const thisPK = getThisPK();
    const blobName = `pharma/${currentDateYYYYMMdd()}/${getRandomUUID()}.${ext}`;
    const blobUrl = `${this.blobUrl}/${this.containerName}/${blobName}`;
    return new BlobUploadModel().builder(blobUrl, blobName, thisPK, file.name, getMimeTypeExt(ext));
  }
}
