import { Injectable } from "@angular/core";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {RestResult} from "../../models/common/rest-result";
import {MedicineModel} from "../../models/rest/medicine/medicine-model";

@Injectable({
  providedIn: "root"
})
export class MedicinePriceListService {
  private baseUrl = "/apiCSO/intra/medicinePriceList";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  getList(): Promise<RestResult<MedicineModel[]>> {
    return this.httpResponse.get(`${this.baseUrl}/list`);
  }
  getHistoryList(kdCode: number): Promise<RestResult<MedicineModel>> {
    this.httpResponse.addParam("kdCode", kdCode);
    return this.httpResponse.get(`${this.baseUrl}/list/price`);
  }
  getMedicinePriceApplyDate(): Promise<RestResult<string>> {
    return this.httpResponse.get(`${this.baseUrl}/data/price/date`);
  }

  postMedicinePriceUpload(applyDate: string, file: File): Promise<RestResult<string>> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("applyDate", applyDate);
    this.httpResponse.setMultipartContentType();
    return this.httpResponse.post(`${this.baseUrl}/file/priceExcel`, formData);
  }
  postMedicineIngredientUpload(file: File): Promise<RestResult<string>> {
    const formData = new FormData();
    formData.append("file", file);
    this.httpResponse.setMultipartContentType();
    return this.httpResponse.post(`${this.baseUrl}/file/ingredientExcel`, formData);
  }
}
