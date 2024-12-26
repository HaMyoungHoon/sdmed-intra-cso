import { Injectable } from "@angular/core";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {RestResult} from "../../models/common/rest-result";
import {HospitalModel} from "../../models/rest/hospital/hospital-model";
import {BlobUploadModel} from "../../models/rest/blob-upload-model";
import * as FAmhohwa from "../../guards/f-amhohwa";
import * as FExtensions from "../../guards/f-extensions";
import * as FConstants from "../../guards/f-constants";

@Injectable({
  providedIn: "root"
})
export class HospitalListService {
  private baseUrl = "/apiCSO/intra/hospitalList";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  getList(): Promise<RestResult<HospitalModel[]>> {
    return this.httpResponse.get(`${this.baseUrl}/list`);
  }
  getData(thisPK: string): Promise<RestResult<HospitalModel>> {
    return this.httpResponse.get(`${this.baseUrl}/data/${thisPK}`);
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
  postData(hospitalModel: HospitalModel): Promise<RestResult<HospitalModel>> {
    return this.httpResponse.post(`${this.baseUrl}/data`, hospitalModel);
  }
  postImage(thisPK: string, file: File): Promise<RestResult<HospitalModel>> {
    const formData = new FormData();
    formData.append("file", file);
    this.httpResponse.setMultipartContentType();
    return this.httpResponse.post(`${this.baseUrl}/file/${thisPK}/image`, formData);
  }

  putData(hospitalModel: HospitalModel): Promise<RestResult<HospitalModel>> {
    return this.httpResponse.put(`${this.baseUrl}/data`, hospitalModel);
  }
  putImage(thisPK: string, blobModel: BlobUploadModel): Promise<RestResult<HospitalModel>> {
    return this.httpResponse.put(`${this.baseUrl}/file/${thisPK}/image`, blobModel);
  }
  getBlobModel(file: File, ext: string): BlobUploadModel {
    const thisPK = FAmhohwa.getThisPK();
    const blobName = `pharma/${FExtensions.currentDateYYYYMMdd()}/${FAmhohwa.getRandomUUID()}.${ext}`;
    const blobUrl = `${FConstants.BLOB_URL}/${FConstants.BLOB_CONTAINER_NAME}/${blobName}`;
    return FExtensions.applyClass(BlobUploadModel, (obj) => {
      obj.blobUrl = blobUrl;
      obj.blobName = blobName;
      obj.uploaderPK = thisPK;
      obj.originalFilename = file.name;
      obj.mimeType = FExtensions.getMimeTypeExt(ext);
    });
  }
}
