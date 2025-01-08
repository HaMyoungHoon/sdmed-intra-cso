import { Injectable } from "@angular/core";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {RestResult} from "../../models/common/rest-result";
import {EDIUploadModel} from "../../models/rest/edi/edi-upload-model";
import {EDIUploadPharmaModel} from "../../models/rest/edi/edi-upload-pharma-model";
import {EDIPharmaDueDateModel} from "../../models/rest/edi/edi-pharma-due-date-model";
import {EDIUploadPharmaMedicineModel} from "../../models/rest/edi/edi-upload-pharma-medicine-model";
import {EDIUploadResponseModel} from "../../models/rest/edi/edi-upload-response-model";
import {EDIUploadFileModel} from "../../models/rest/edi/edi-upload-file-model";

@Injectable({
  providedIn: "root"
})
export class EdiListService {
  private baseUrl = "/apiCSO/intra/ediList";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  getList(startDate: string, endDate: string, myChild: boolean = true): Promise<RestResult<EDIUploadModel[]>> {
    this.httpResponse.addParam("myChild", myChild);
    this.httpResponse.addParam("startDate", startDate);
    this.httpResponse.addParam("endDate", endDate);
    return this.httpResponse.get(`${this.baseUrl}/list`);
  }
  getData(thisPK: string): Promise<RestResult<EDIUploadModel>> {
    return this.httpResponse.get(`${this.baseUrl}/data/${thisPK}`);
  }
  postData(ediPharmaPK: string, ediUploadResponseModel: EDIUploadResponseModel): Promise<RestResult<EDIUploadModel>> {
    return this.httpResponse.post(`${this.baseUrl}/data/${ediPharmaPK}`, ediUploadResponseModel);
  }
  putData(thisPK: string, ediUploadModel: EDIUploadModel): Promise<RestResult<EDIUploadModel>> {
    return this.httpResponse.put(`${this.baseUrl}/data/${thisPK}`, ediUploadModel);
  }
  putPharmaData(thisPK: string, ediUploadPharmaModel: EDIUploadPharmaModel): Promise<RestResult<EDIPharmaDueDateModel>> {
    return this.httpResponse.put(`${this.baseUrl}/data/pharma/${thisPK}`, ediUploadPharmaModel);
  }
  putPharmaDataState(thisPK: string, ediUploadPharmaModel: EDIUploadPharmaModel): Promise<RestResult<EDIPharmaDueDateModel>> {
    return this.httpResponse.put(`${this.baseUrl}/data/pharma/${thisPK}/state`, ediUploadPharmaModel);
  }
  putPharmaMedicineData(thisPK: string, ediUploadPharmaMedicineModel: EDIUploadPharmaMedicineModel): Promise<RestResult<EDIUploadPharmaMedicineModel>> {
    return this.httpResponse.put(`${this.baseUrl}/data/pharma/medicine/${thisPK}`, ediUploadPharmaMedicineModel);
  }
  deletePharmaMedicineData(thisPK: string): Promise<RestResult<EDIUploadPharmaMedicineModel>> {
    return this.httpResponse.delete(`${this.baseUrl}/data/pharma/medicine/${thisPK}`);
  }
  deletePharmaMedicineList(thisPK: string[]): Promise<RestResult<EDIUploadPharmaMedicineModel>> {
    this.httpResponse.addParam("thisPK", thisPK.join(","));
    return this.httpResponse.delete(`${this.baseUrl}/list/pharma/medicine`);
  }
  deleteEDIFile(thisPK: string): Promise<RestResult<EDIUploadFileModel>> {
    return this.httpResponse.delete(`${this.baseUrl}/data/file/${thisPK}`);
  }
}
