import {HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {getLocalStorage, isExpired, removeLocalStorage} from "../../guards/f-amhohwa";
import {AUTH_TOKEN} from "../../guards/f-constants";

export const HttpRequestInterceptorService: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const token = getLocalStorage(AUTH_TOKEN);
  if (isExpired(token)) {
    removeLocalStorage(AUTH_TOKEN);
  }
  let reqHeader = req.headers;
  if (token) {
    reqHeader = reqHeader.set(AUTH_TOKEN, token);
  }

  return next(req.clone({ headers: reqHeader }));
}
