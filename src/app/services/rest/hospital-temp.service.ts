import { Injectable } from "@angular/core";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {RestResult} from "../../models/common/rest-result";
import {HospitalTempModel} from "../../models/rest/hospital/hospital-temp-model";
import {RestPage} from "../../models/common/rest-page";
import {HospitalTempFileModel} from "../../models/rest/hospital/hospital-temp-file-model";

@Injectable({
  providedIn: "root"
})
export class HospitalTempService {
  private baseUrl = "/apiCSO/intra/hospitalTemp";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  getList(page: number = 0, size: number = 100): Promise<RestResult<RestPage<HospitalTempModel[]>>> {
    this.httpResponse.addParam("page", page);
    this.httpResponse.addParam("size", size);
    return this.httpResponse.get(`${this.baseUrl}/list`);
  }
  getData(thisPK: string): Promise<RestResult<HospitalTempModel>> {
    return this.httpResponse.get(`${this.baseUrl}/data/${thisPK}`);
  }
  getListSearch(searchString: string): Promise<RestResult<HospitalTempModel[]>> {
    this.httpResponse.addParam("searchString", searchString);
    return this.httpResponse.get(`${this.baseUrl}/list/search`);
  }
  getListNearBy(latitude: number, longitude: number, distance: number = 1): Promise<RestResult<HospitalTempModel[]>> {
    this.httpResponse.addParam("latitude", latitude);
    this.httpResponse.addParam("longitude", longitude);
    this.httpResponse.addParam("distance", distance);
    return this.httpResponse.get(`${this.baseUrl}/list/nearby`);
  }

  postDataFile(hospitalTempFileModel: HospitalTempFileModel): Promise<RestResult<HospitalTempFileModel>> {
    return this.httpResponse.post(`${this.baseUrl}/data/file`, hospitalTempFileModel);
  }
}
