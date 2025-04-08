import { Injectable } from "@angular/core";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {RestResult} from "../../models/common/rest-result";
import {EDIUploadModel} from "../../models/rest/edi/edi-upload-model";
import {EDIUploadPharmaModel} from "../../models/rest/edi/edi-upload-pharma-model";
import {EDIPharmaDueDateModel} from "../../models/rest/edi/edi-pharma-due-date-model";
import {EDIUploadPharmaMedicineModel} from "../../models/rest/edi/edi-upload-pharma-medicine-model";
import {EDIUploadResponseModel} from "../../models/rest/edi/edi-upload-response-model";
import {EDIUploadPharmaFileModel} from "../../models/rest/edi/edi-upload-pharma-file-model";
import {HospitalTempModel} from "../../models/rest/hospital/hospital-temp-model";

@Injectable({
  providedIn: "root"
})
export class EdiListService {
  private baseUrl = "/apiCSO/intra/ediList";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  getList(startDate: string, endDate: string, myChild: boolean = true): Promise<RestResult<EDIUploadModel[]>> {
    this.httpResponse.addParam("myChild", myChild);
    this.httpResponse.addParam("withFile", true);
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
  postEDINewData(ediPK: string, ediUploadResponseModel: EDIUploadResponseModel): Promise<RestResult<EDIUploadModel>> {
    return this.httpResponse.post(`${this.baseUrl}/data/new-edi/${ediPK}`, ediUploadResponseModel);
  }
  putData(thisPK: string, ediUploadModel: EDIUploadModel): Promise<RestResult<EDIUploadModel>> {
    return this.httpResponse.put(`${this.baseUrl}/data/${thisPK}`, ediUploadModel);
  }
  putHospitalTempData(thisPK: string, hospitalTempModel: HospitalTempModel): Promise<RestResult<EDIUploadModel>> {
    return this.httpResponse.put(`${this.baseUrl}/data/hospitalTemp/${thisPK}`, hospitalTempModel);
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
  deleteEDIPharmaFile(thisPK: string): Promise<RestResult<EDIUploadPharmaFileModel>> {
    return this.httpResponse.delete(`${this.baseUrl}/data/pharma/file/${thisPK}`);
  }
}
