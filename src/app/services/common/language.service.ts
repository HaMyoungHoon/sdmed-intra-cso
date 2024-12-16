import { Injectable } from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {CommonService} from "../rest/common.service";
import {getLocalStorage, setLocalStorage} from "../../guards/f-amhohwa";
import {getKeyName, LangType} from "../../models/common/lang-type";
import * as FConstants from "../../guards/f-constants";
import {restTry} from "../../guards/f-extensions";
import {PrimeNGConfig} from "primeng/api";

@Injectable({
  providedIn: "root"
})
export class LanguageService {
  langList: string[];

  constructor(private translateService: TranslateService, private commonService: CommonService, private primeNGConfig: PrimeNGConfig) {
    this.langList = Object.keys(LangType);
  }
  async onInit(): Promise<void> {
    for (let lang of this.langList) {
      this.translateService.addLangs([lang])
    }

    const localLang: string = getLocalStorage(FConstants.STORAGE_KEY_LANG);
    let browserLang: string | undefined = "";
    let existLang: string | undefined = "";
    let matchingLang: string | undefined = "";
    if (localLang === "NaN" || localLang.length <= 0) {
      browserLang = this.translateService.getBrowserLang();
      existLang = this.langList.find(lang => browserLang == lang);
      matchingLang = existLang ? browserLang : "ko";
      matchingLang = matchingLang == undefined ? "ko" : matchingLang;
    } else {
      matchingLang = localLang;
    }

    this.translateService.setDefaultLang(matchingLang);
    this.translateService.use(matchingLang);
    await this.setLanguage(matchingLang);
  }
  async change(lang: LangType): Promise<void> {
    const existLang = this.langList.find(x => getKeyName(lang) == x);
    if (existLang) {
      this.translateService.use(existLang);
      await this.setLanguage(existLang);
    }
  }
  async setLanguage(lang: string): Promise<void> {
    this.translateService.get("primeng").subscribe(x => {
      this.primeNGConfig.setTranslation(x);
    })
    await restTry(async() => await this.commonService.setLanguage(lang));
    setLocalStorage(FConstants.STORAGE_KEY_LANG, lang);
  }

  isKoLang(): boolean {
    return getLocalStorage(FConstants.STORAGE_KEY_LANG) == "ko";
  }
}
