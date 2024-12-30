import {HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import * as FAmhohwa from "../../guards/f-amhohwa";
import * as FConstants from "../../guards/f-constants";

export const HttpRequestInterceptorService: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const token = FAmhohwa.getLocalStorage(FConstants.AUTH_TOKEN);
  if (FAmhohwa.isExpired(token)) {
    FAmhohwa.removeLocalStorage(FConstants.AUTH_TOKEN);
  }
  let reqHeader = req.headers;
  if (token) {
    reqHeader = reqHeader.set(FConstants.AUTH_TOKEN, token);
  }

  return next(req.clone({ headers: reqHeader }));
}
