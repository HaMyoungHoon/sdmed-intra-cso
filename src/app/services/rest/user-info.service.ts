import { Injectable } from "@angular/core";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {RestResult} from "../../models/common/rest-result";
import {UserDataModel} from "../../models/rest/user/user-data-model";
import {UserRole} from "../../models/rest/user/user-role";
import {UserDept} from "../../models/rest/user/user-dept";
import {UserStatus} from "../../models/rest/user/user-status";
import {BlobUploadModel} from "../../models/rest/blob-upload-model";
import {currentDateYYYYMMdd, getMimeTypeExt} from "../../guards/f-extensions";
import {getRandomUUID, getThisPK} from "../../guards/f-amhohwa";

@Injectable({
  providedIn: "root"
})
export class UserInfoService {
  private baseUrl = "/apiCSO/intra/userInfo";
  private blobUrl = "https://mhhablob1.blob.core.windows.net";
  private containerName = "mhhablob1";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  getList(): Promise<RestResult<void>> {
    return this.httpResponse.get(`${this.baseUrl}/list`);
  }
  getData(thisPK: string, childView: boolean = false, relationView: boolean = false, pharmaOwnMedicineView: boolean = false): Promise<RestResult<UserDataModel>> {
    this.httpResponse.addParam("childView", childView);
    this.httpResponse.addParam("relationView", relationView);
    this.httpResponse.addParam("pharmaOwnMedicineView", pharmaOwnMedicineView);
    return this.httpResponse.get(`${this.baseUrl}/data/${thisPK}`);
  }
  getListChildAble(thisPK: string): Promise<RestResult<UserDataModel[]>> {
    return this.httpResponse.get(`${this.baseUrl}/list/childAble/${thisPK}`);
  }
  getExcelSample(): Promise<any> {
    return this.httpResponse.getBlob(`${this.baseUrl}/file/sample`);
  }

  postChildModify(thisPK: string, childPK: string[]): Promise<RestResult<string>> {
    return this.httpResponse.post(`${this.baseUrl}/data/${thisPK}`, childPK);
  }
  postExcel(file: File): Promise<RestResult<string>> {
    const formData = new FormData();
    formData.append("file", file);
    this.httpResponse.setMultipartContentType();
    return this.httpResponse.post(`${this.baseUrl}/file/excel`, formData);
  }

  putUser(userData: UserDataModel): Promise<RestResult<UserDataModel>> {
    return this.httpResponse.put(`${this.baseUrl}/data`, userData);
  }
  putUserTaxImageUrl(thisPK: string, blobModel: BlobUploadModel): Promise<RestResult<UserDataModel>> {
    return this.httpResponse.put(`${this.baseUrl}/file/${thisPK}/taxImage`, blobModel);
  }
  putUserBankImageUrl(thisPK: string, blobModel: BlobUploadModel): Promise<RestResult<UserDataModel>> {
    return this.httpResponse.put(`${this.baseUrl}/file/${thisPK}/bankImage`, blobModel);
  }

  getBlobModel(userId: string, file: File, ext: string): BlobUploadModel {
    const thisPK = getThisPK();
    const blobName = `${userId}/${currentDateYYYYMMdd()}/${getRandomUUID()}.${ext}`;
    const blobUrl = `${this.blobUrl}/${this.containerName}/${blobName}`;
    return new BlobUploadModel().builder(blobUrl, blobName, thisPK, file.name, getMimeTypeExt(ext));
  }
}
