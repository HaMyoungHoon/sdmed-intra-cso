import { Injectable } from "@angular/core";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {RestResult} from "../../models/common/rest-result";

@Injectable({
  providedIn: "root"
})
export class UserService {
  private baseUrl = "/apiCSO/v1/user";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  signIn(id: string, pw: string): Promise<RestResult<string>> {
    this.httpResponse.addParam("id", id);
    this.httpResponse.addParam("pw", pw);
    return this.httpResponse.get(`${this.baseUrl}/signIn`);
  }
  tokenRefresh(): Promise<RestResult<string>> {
    return this.httpResponse.post(`${this.baseUrl}/tokenRefresh`);
  }
}
