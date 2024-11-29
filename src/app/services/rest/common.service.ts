import { Injectable } from "@angular/core";
import {RestResult} from "../../models/common/rest-result";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";

@Injectable({
  providedIn: "root"
})
export class CommonService {
//  private baseUrl = "/apiCSO/common";
  private baseUrl = "http://localhost:25801/common";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  setLanguage(lang: string): Promise<RestResult<null>> {
    this.httpResponse.addParam("lang", lang);
    return this.httpResponse.post(`${this.baseUrl}/lang`);
  }
}
