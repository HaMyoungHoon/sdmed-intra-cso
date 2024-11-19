import {HttpClient} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {Injectable, Provider} from "@angular/core";
import {TranslateLoader, TranslateModule, TranslationObject} from "@ngx-translate/core";
import {Observable} from "rxjs";

export function HttpLoaderFactory(httpClient: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(httpClient)
}

@Injectable({
  providedIn: "root"
})
export class CustomTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient) {
  }

  getTranslation(lang: string): Observable<TranslationObject> {
    return this.http.get<Record<string, string>>(`/assets/i18n/${lang}.json`);
  }
}
export function provideTranslateLoader(): Provider[] {
  return [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: CustomTranslateLoader
      }
    }).providers!
  ];
}
