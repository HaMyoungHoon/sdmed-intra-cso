import { Injectable } from "@angular/core";
import {RestResult} from "../../models/common/rest-result";
import {MedicineModel} from "../../models/rest/medicine/medicine-model";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {MedicineIngredientModel} from "../../models/rest/medicine/medicine-ingredient-model";
import {PharmaModel} from "../../models/rest/pharma/pharma-model";

@Injectable({
  providedIn: "root"
})
export class MedicineListService {
  private baseUrl = "/apiCSO/intra/medicineList";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  getList(): Promise<RestResult<MedicineModel[]>> {
    return this.httpResponse.get(`${this.baseUrl}/list`);
  }
  getData(thisPK: string): Promise<RestResult<MedicineModel>> {
    return this.httpResponse.get(`${this.baseUrl}/data/${thisPK}`);
  }
  getMainIngredientList(): Promise<RestResult<MedicineIngredientModel[]>> {
    return this.httpResponse.get(`${this.baseUrl}/list/mainIngredient`);
  }
  getPharmaList(): Promise<RestResult<PharmaModel[]>> {
    return this.httpResponse.get(`${this.baseUrl}/list/pharma`);
  }
  getExcelSample(): Promise<any> {
    return this.httpResponse.getBlob(`${this.baseUrl}/file/sample`);
  }

  postExcel(file: File): Promise<RestResult<string>> {
    const formData = new FormData();
    formData.append("file", file);
    this.httpResponse.setMultipartContentType();
    return this.httpResponse.post(`${this.baseUrl}/file/excel`, formData);
  }
  postData(medicineModel: MedicineModel): Promise<RestResult<MedicineModel>> {
    return this.httpResponse.post(`${this.baseUrl}/data`, medicineModel);
  }
  putData(medicineModel: MedicineModel): Promise<RestResult<MedicineModel>> {
    return this.httpResponse.put(`${this.baseUrl}/data`, medicineModel);
  }
}
