import { Injectable } from "@angular/core";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {PharmaModel} from "../../models/rest/pharma/pharma-model";
import {RestResult} from "../../models/common/rest-result";
import {MedicineModel} from "../../models/rest/medicine/medicine-model";
import {BlobUploadModel} from "../../models/rest/blob-upload-model";
import * as FAmhohwa from "../../guards/f-amhohwa";
import * as FExtensions from "../../guards/f-extensions";
import * as FConstants from "../../guards/f-constants";

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
  getPharmaMedicineExcelSample(): Promise<any> {
    return this.httpResponse.getBlob(`${this.baseUrl}/file/sample/pharmaMedicine`);
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
  postPharmaMedicineExcel(file: File): Promise<RestResult<string>> {
    const formData = new FormData();
    formData.append("file", file);
    this.httpResponse.setMultipartContentType();
    return this.httpResponse.post(`${this.baseUrl}/file/excel/pharmaMedicine`, formData);
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

  getBlobModel(file: File, ext: string): BlobUploadModel {
    const thisPK = FAmhohwa.getThisPK();
    const blobName = `pharma/${FExtensions.currentDateYYYYMMdd()}/${FAmhohwa.getRandomUUID()}.${ext}`;
    const blobUrl = `${FConstants.BLOB_URL}/${FConstants.BLOB_CONTAINER_NAME}/${blobName}`;
    return new BlobUploadModel().builder(blobUrl, blobName, thisPK, file.name, FExtensions.getMimeTypeExt(ext));
  }
}
