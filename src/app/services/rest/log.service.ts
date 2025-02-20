import { Injectable } from "@angular/core";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {RestResult} from "../../models/common/rest-result";
import {LogViewModel} from "../../models/rest/log-view-model";
import {RestPage} from "../../models/common/rest-page";

@Injectable({
  providedIn: "root"
})
export class LogService {
  private baseUrl = "/apiCSO/intra/log";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  getList(page: number = 0, size: number = 1000): Promise<RestResult<RestPage<LogViewModel[]>>> {
    this.httpResponse.addParam("page", page);
    this.httpResponse.addParam("size", size);
    return this.httpResponse.get(`${this.baseUrl}/list`);
  }
}
