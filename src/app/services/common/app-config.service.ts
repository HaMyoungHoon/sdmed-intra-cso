import {effect, Inject, Injectable, PLATFORM_ID, signal, WritableSignal} from '@angular/core';
import * as FConstants from "../../guards/f-constants"
import {AppConfig} from '../../models/common/app-config';
import {AppState} from '../../models/common/app-state';
import {Subject} from 'rxjs';
import {getLocalStorage, setLocalStorage} from '../../guards/f-amhohwa';
import {isPlatformBrowser} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private _config: AppConfig = {
    theme: FConstants.DEF_LIGHT_THEME,
    darkMode: false,
    scale: 14,
  }
  state: AppState = {
    configActive: false,
    menuActive: false,
    newsActive: false,
  }

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    this._config.scale = +getLocalStorage(FConstants.STORAGE_KEY_SCALE);
  }
  onInit(): void {
    if (this.isDarkMode()) {
      this.changeTheme(true);
    } else {
      this.changeTheme(false);
    }
    this.changeScale(this.getScale());
  }
  updateStyle(config: AppConfig): boolean {
    return config.theme !== this._config.theme || config.darkMode !== this._config.darkMode;
  }
  onConfigUpdate(): void {
    this._config.darkMode = this.isDarkMode();
    this._config.scale = this.getScale();
  }
  showMenu(): void {
    this.state.menuActive = true;
  }
  hideMenu(): void {
    this.state.menuActive = false;
  }
  showConfig(): void {
    this.state.configActive = true;
  }
  hideConfig(): void {
    this.state.configActive = false;
  }
  showNews(): void {
    this.state.newsActive = true;
  }
  hideNews(): void {
    this.state.newsActive = false;
  }
  getScale(): number {
    let scale = +getLocalStorage(FConstants.STORAGE_KEY_SCALE);
    if (scale < 10 || scale > 18) {
      return 14;
    }

    return scale;
  }
  isDarkMode(): boolean {
    return getLocalStorage(FConstants.STORAGE_KEY_IS_DARK) == "true";
  }
  changeTheme(toDark: boolean): void {
    const newHref = toDark ? FConstants.DEF_DARK_THEME : FConstants.DEF_LIGHT_THEME;
    let themeLink = <HTMLLinkElement>document.getElementById(FConstants.THEME_LINK);
    const cloneLinkElement = <HTMLLinkElement>themeLink.cloneNode(true);
    cloneLinkElement.setAttribute('href', newHref);
    cloneLinkElement.setAttribute('id', FConstants.THEME_LINK + '-clone');
    themeLink.parentNode!.insertBefore(cloneLinkElement, themeLink.nextSibling);
    cloneLinkElement.addEventListener('load', () => {
      themeLink.remove();
      cloneLinkElement.setAttribute('id', FConstants.THEME_LINK);
    });
    this.onConfigUpdate();
    setLocalStorage(FConstants.STORAGE_KEY_IS_DARK, `${toDark}`);
  }
  changeScale(value: number): void {
    if (value < 10) {
      value = 14;
    }
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.style.fontSize = `${value}px`;
    }
    setLocalStorage(FConstants.STORAGE_KEY_SCALE, value.toString());
    this.onConfigUpdate();
  }
}
