import { Injectable } from "@angular/core";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {RestResult} from "../../models/common/rest-result";
import {QnAHeaderModel} from "../../models/rest/qna/qna-header-model";
import {QnAReplyModel} from "../../models/rest/qna/qna-reply-model";
import {QnAContentModel} from "../../models/rest/qna/qna-content-model";

@Injectable({
  providedIn: "root"
})
export class QnaListService {
  private baseUrl = "/apiCSO/intra/qnaList";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  getList(): Promise<RestResult<QnAHeaderModel[]>> {
    return this.httpResponse.get(`${this.baseUrl}/list/myChild`);
  }
  getListByNoResponse(): Promise<RestResult<QnAHeaderModel[]>> {
    return this.httpResponse.get(`${this.baseUrl}/list/all`);
  }
  getListByDate(startDate: string, endDate: string): Promise<RestResult<QnAHeaderModel[]>> {
    this.httpResponse.addParam("startDate", startDate);
    this.httpResponse.addParam("endDate", endDate);
    return this.httpResponse.get(`${this.baseUrl}/list/date`);
  }
  getHeaderData(thisPK: string): Promise<RestResult<QnAHeaderModel>> {
    return this.httpResponse.get(`${this.baseUrl}/data/header/${thisPK}`);
  }
  getContentData(thisPK: string): Promise<RestResult<QnAContentModel>> {
    return this.httpResponse.get(`${this.baseUrl}/data/content/${thisPK}`);
  }

  postReply(thisPK: string, qnaReplyModel: QnAReplyModel): Promise<RestResult<QnAReplyModel>> {
    return this.httpResponse.post(`${this.baseUrl}/data/${thisPK}`, qnaReplyModel);
  }

  putData(thisPK: string): Promise<RestResult<QnAHeaderModel>> {
    return this.httpResponse.put(`${this.baseUrl}/data/${thisPK}`);
  }
}
