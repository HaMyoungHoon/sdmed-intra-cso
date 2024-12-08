import { Injectable } from "@angular/core";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {RestResult} from "../../models/common/rest-result";
import {MedicineModel} from "../../models/rest/medicine-model";

@Injectable({
  providedIn: "root"
})
export class MedicinePriceListService {
//  private baseUrl = "/apiCSO/intra/medicinePriceList";
  private baseUrl = "http://localhost:25801/intra/medicinePriceList";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  getList(): Promise<RestResult<MedicineModel[]>> {
    return this.httpResponse.get(`${this.baseUrl}/list`);
  }
  getHistoryList(kdCode: number): Promise<RestResult<MedicineModel>> {
    this.httpResponse.addParam("kdCode", kdCode);
    return this.httpResponse.get(`${this.baseUrl}/list/price`);
  }
}
