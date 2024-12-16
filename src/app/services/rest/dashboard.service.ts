import { Injectable } from "@angular/core";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {RestResult} from "../../models/common/rest-result";
import {RequestModel} from "../../models/rest/requst/request-model";
import {UserDataModel} from "../../models/rest/user/user-data-model";
import {ResponseCountModel} from "../../models/rest/requst/response-count-model";
import {RequestUserCountModel} from "../../models/rest/requst/request-user-count-model";

@Injectable({
  providedIn: "root"
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

  getCountOfResponseType(startDate: string, endDate: string): Promise<RestResult<ResponseCountModel[]>> {
    this.httpResponse.addParam("startDate", startDate);
    this.httpResponse.addParam("endDate", endDate);
    return this.httpResponse.get(`${this.baseUrl}/list/responseType/date`);
  }
  getTop10RequestUser(startDate: string, endDate: string): Promise<RestResult<RequestUserCountModel[]>> {
    this.httpResponse.addParam("startDate", startDate);
    this.httpResponse.addParam("endDate", endDate);
    return this.httpResponse.get(`${this.baseUrl}/list/requestUser/date`);
  }
}
