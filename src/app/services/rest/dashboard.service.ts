import { Injectable } from '@angular/core';
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {RestResult} from "../../models/common/rest-result";
import {RequestModel} from "../../models/rest/request-model";
import {UserDataModel} from "../../models/rest/user-data-model";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = "/apiCSO/intra/dashboard";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  getList(): Promise<RestResult<RequestModel[]>> {
    return this.httpResponse.get(`${this.baseUrl}/list/myChild`);
  }
  getListByNoResponse(): Promise<RestResult<RequestModel[]>> {
    return this.httpResponse.get(`${this.baseUrl}/list/all`);
  }
  getListByDate(startDate: string, endDate: string): Promise<RestResult<RequestModel[]>> {
    this.httpResponse.addParam("startDate", startDate);
    this.httpResponse.addParam("endDate", endDate);
    return this.httpResponse.get(`${this.baseUrl}/list/date`);
  }
  getUserData(thisPK: string): Promise<RestResult<UserDataModel>> {
    return this.httpResponse.get(`${this.baseUrl}/data/${thisPK}`);
  }
}
