import { Injectable } from "@angular/core";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {RestResult} from "../../models/common/rest-result";
import {RequestModel} from "../../models/rest/requst/request-model";
import {UserDataModel} from "../../models/rest/user/user-data-model";
import {ResponseCountModel} from "../../models/rest/requst/response-count-model";
import {RequestUserCountModel} from "../../models/rest/requst/request-user-count-model";
import {ResponseTypeToString} from "../../models/rest/requst/response-type";

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
  getRequestData(requestItemPK: string): Promise<RestResult<RequestModel>> {
    return this.httpResponse.get(`${this.baseUrl}/data/requestData/${requestItemPK}`);
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
  putRequestRecep(data: RequestModel): Promise<RestResult<RequestModel>> {
    return this.httpResponse.put(`${this.baseUrl}/data/${data.thisPK}/recep`);
  }
  putRequestModelResponseData(data: RequestModel): Promise<RestResult<RequestModel>> {
    this.httpResponse.addParam("responseType", data.responseType);
    return this.httpResponse.put(`${this.baseUrl}/data/${data.thisPK}`);
  }
}
