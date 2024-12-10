import { Injectable } from "@angular/core";
import {RestResult} from "../../models/common/rest-result";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";

@Injectable({
  providedIn: "root"
})
export class CommonService {
  private baseUrl = "/apiCSO/common";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  setLanguage(lang: string): Promise<RestResult<null>> {
    this.httpResponse.addParam("lang", lang);
    return this.httpResponse.post(`${this.baseUrl}/lang`);
  }
  getMyRole(): Promise<RestResult<number>> {
    return this.httpResponse.get(`${this.baseUrl}/myRole`);
  }
  getGenerateSas(blobUrl: string, containerName: string = ""): Promise<RestResult<string>> {
    if (containerName.length > 0) {
      this.httpResponse.addParam("containerName", containerName);
    }
    this.httpResponse.addParam("blobUrl", blobUrl);
    return this.httpResponse.get(`${this.baseUrl}/generate/sas`);
  }
}
