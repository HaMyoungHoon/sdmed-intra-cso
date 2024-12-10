import { Injectable } from "@angular/core";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {PharmaModel} from "../../models/rest/pharma-model";
import {RestResult} from "../../models/common/rest-result";
import {MedicineModel} from "../../models/rest/medicine-model";
import {BlobUploadModel} from "../../models/rest/blob-upload-model";
import {getRandomUUID, getThisPK} from "../../guards/f-amhohwa";
import {currentDateYYYYMMdd, getMimeTypeExt} from "../../guards/f-extensions";

@Injectable({
  providedIn: "root"
})
export class PharmaListService {
  private baseUrl = "/apiCSO/intra/pharmaList";
  private blobUrl = "https://mhhablob1.blob.core.windows.net";
  private containerName = "mhhablob1";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  getList(): Promise<RestResult<PharmaModel[]>> {
    return this.httpResponse.get(`${this.baseUrl}/list`);
  }
  getData(thisPK: string, pharmaOwnMedicineView: boolean = false): Promise<RestResult<PharmaModel>> {
    this.httpResponse.addParam("pharmaOwnMedicineView", pharmaOwnMedicineView);
    return this.httpResponse.get(`${this.baseUrl}/data/${thisPK}`);
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
  getExcelSample(): Promise<any> {
    return this.httpResponse.getBlob(`${this.baseUrl}/file/sample`);
  }
  putData(pharmaModel: PharmaModel): Promise<RestResult<PharmaModel>> {
    return this.httpResponse.put(`${this.baseUrl}/data`, pharmaModel);
  }
  postImage(thisPK: string, file: File): Promise<RestResult<PharmaModel>> {
    const formData = new FormData();
    formData.append("file", file);
    this.httpResponse.setMultipartContentType();
    return this.httpResponse.post(`${this.baseUrl}/file/${thisPK}/image`);
  }
  putMedicine(thisPK: string, medicinePKList: string[]): Promise<RestResult<PharmaModel>> {
    return this.httpResponse.put(`${this.baseUrl}/data/${thisPK}/medicine/list`, medicinePKList);
  }
  getMedicine(searchString: string, isSearchTypeCode: boolean = false): Promise<RestResult<MedicineModel[]>> {
    this.httpResponse.addParam("searchString", searchString);
    this.httpResponse.addParam("isSearchTypeCode", isSearchTypeCode);
    return this.httpResponse.get(`${this.baseUrl}/medicine/list`);
  }

  getPharmaMedicineExcelSample(): Promise<any> {
    return this.httpResponse.getBlob(`${this.baseUrl}/file/sample/pharmaMedicine`);
  }
  postPharmaMedicineExcel(file: File): Promise<RestResult<string>> {
    const formData = new FormData();
    formData.append("file", file);
    this.httpResponse.setMultipartContentType();
    return this.httpResponse.post(`${this.baseUrl}/file/excel/pharmaMedicine`, formData);
  }
  putImage(thisPK: string, blobModel: BlobUploadModel): Promise<RestResult<PharmaModel>> {
    return this.httpResponse.put(`${this.baseUrl}/file/${thisPK}/image`, blobModel);
  }
  getBlobModel(file: File, ext: string): BlobUploadModel {
    const thisPK = getThisPK();
    const blobName = `pharma/${currentDateYYYYMMdd()}/${getRandomUUID()}.${ext}`;
    const blobUrl = `${this.blobUrl}/${this.containerName}/${blobName}`;
    return new BlobUploadModel().builder(blobUrl, blobName, thisPK, file.name, getMimeTypeExt(ext));
  }
}
