import { Injectable } from "@angular/core";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {RestResult} from "../../models/common/rest-result";
import {EDIPharmaDueDateModel} from "../../models/rest/edi/edi-pharma-due-date-model";
import {PharmaModel} from "../../models/rest/pharma/pharma-model";

@Injectable({
  providedIn: "root"
})
export class EdiDueDateService {
  private baseUrl = "/apiCSO/intra/ediDueDate";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  getList(date: string, isYear: boolean = false): Promise<RestResult<EDIPharmaDueDateModel[]>> {
    this.httpResponse.addParam("date", date);
    this.httpResponse.addParam("isYear", isYear);
    return this.httpResponse.get(`${this.baseUrl}/list`);
  }
  getListRange(startDate: string, endDate: string): Promise<RestResult<EDIPharmaDueDateModel[]>> {
    this.httpResponse.addParam("startDate", startDate);
    this.httpResponse.addParam("endDate", endDate);
    return this.httpResponse.get(`${this.baseUrl}/list/range`);
  }
  getData(pharmaPK: string, year: string): Promise<RestResult<EDIPharmaDueDateModel[]>> {
    return this.httpResponse.get(`${this.baseUrl}/data/${pharmaPK}/${year}`);
  }
  getListPharma(pharmaPK: string[], date: string): Promise<RestResult<EDIPharmaDueDateModel[]>> {
    this.httpResponse.addParam("pharmaPK", pharmaPK.join(","));
    this.httpResponse.addParam("date", date);
    return this.httpResponse.get(`${this.baseUrl}/list/pharma`);
  }
  getListPharmaAble(date: string): Promise<RestResult<PharmaModel[]>> {
    this.httpResponse.addParam("date", date);
    return this.httpResponse.get(`${this.baseUrl}/list/pharma/date`);
  }

  postData(pharmaPK: string, date: string): Promise<RestResult<EDIPharmaDueDateModel>> {
    this.httpResponse.addParam("date", date);
    return this.httpResponse.post(`${this.baseUrl}/data/${pharmaPK}`);
  }
  postList(pharmaPK: string[], date: string): Promise<RestResult<EDIPharmaDueDateModel[]>> {
    this.httpResponse.addParam("date", date);
    return this.httpResponse.post(`${this.baseUrl}/list`, pharmaPK);
  }

  putData(thisPK: string, date: string): Promise<RestResult<EDIPharmaDueDateModel>> {
    this.httpResponse.addParam("date", date);
    return this.httpResponse.put(`${this.baseUrl}/data/${thisPK}`);
  }

  deleteData(pharmaPK: string, date: string): Promise<RestResult<EDIPharmaDueDateModel>> {
    this.httpResponse.addParam("date", date);
    return this.httpResponse.delete(`${this.baseUrl}/data/${pharmaPK}`);
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
}
