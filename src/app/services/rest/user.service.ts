import { Injectable } from '@angular/core';
import {HttpResponseInterceptorService} from '../common/http-response-interceptor.service';
import {RestResult} from '../../models/common/rest-result';
import {UserDataModel} from '../../models/rest/user-data-model';
import {RestPage} from '../../models/common/rest-page';

@Injectable({
  providedIn: 'root'
})
export class UserService {
//  private baseUrl = "/apiCSO/v1/user";
  private baseUrl = "http://localhost:25801/v1/user";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  getUserAll(): Promise<RestResult<UserDataModel[]>> {
    return this.httpResponse.get(`${this.baseUrl}/all`);
  }
  getUserAllPage(page: number, size: number): Promise<RestResult<RestPage<UserDataModel[]>>> {
    this.httpResponse.addParam("page", page);
    this.httpResponse.addParam("size", size);
    return this.httpResponse.get(`${this.baseUrl}/all`);
  }
  signIn(id: string, pw: string): Promise<RestResult<string>> {
    this.httpResponse.addParam("id", id);
    this.httpResponse.addParam("pw", pw);
    return this.httpResponse.get(`${this.baseUrl}/signIn`);
  }
  tokenRefresh(): Promise<RestResult<string>> {
    return this.httpResponse.post(`${this.baseUrl}/tokenRefresh`);
  }
}
