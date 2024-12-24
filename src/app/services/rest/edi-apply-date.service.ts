import { Injectable } from "@angular/core";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {RestResult} from "../../models/common/rest-result";
import {EDIApplyDateModel} from "../../models/rest/edi/edi-apply-date-model";
import {EDIApplyDateState} from "../../models/rest/edi/edi-apply-date-state";

@Injectable({
  providedIn: "root"
})
export class EdiApplyDateService {
  private baseUrl = "/apiCSO/intra/ediApplyDate";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  getList(): Promise<RestResult<EDIApplyDateModel[]>> {
    return this.httpResponse.get(`${this.baseUrl}/list`);
  }
  getUseApplyDate(): Promise<RestResult<EDIApplyDateModel[]>> {
    return this.httpResponse.get(`${this.baseUrl}/list/use`);
  }
  postData(applyDate: string): Promise<RestResult<EDIApplyDateModel>> {
    this.httpResponse.addParam("applyDate", applyDate);
    return this.httpResponse.post(`${this.baseUrl}/data`);
  }
  putData(thisPK: string, ediApplyDateState: EDIApplyDateState): Promise<RestResult<EDIApplyDateModel>> {
    this.httpResponse.addParam("ediApplyDateState", ediApplyDateState);
    return this.httpResponse.put(`${this.baseUrl}/data/${thisPK}`);
  }
}
