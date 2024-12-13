import { Injectable } from "@angular/core";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {RestResult} from "../../models/common/rest-result";
import {MedicineModel} from "../../models/rest/medicine-model";

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

  postMedicinePriceUpload(applyDate: string, file: File): Promise<RestResult<string>> {
    const formData = new FormData();
    formData.append("file", file);
    this.httpResponse.addParam("applyDate", applyDate);
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
