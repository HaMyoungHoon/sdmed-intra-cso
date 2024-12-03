import {afterNextRender, ChangeDetectorRef, Component} from "@angular/core";
import {ToolbarModule} from "primeng/toolbar";
import {Button} from "primeng/button";
import {SidebarModule} from "primeng/sidebar";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {TranslatePipe} from "@ngx-translate/core";
import {LanguageService} from "../../../services/common/language.service";
import {MenuItem} from "primeng/api";
import {AppConfigService} from "../../../services/common/app-config.service";
import {MainMenuItem} from "../../../models/common/main-menu-item";
import {LangType} from "../../../models/common/lang-type";
import {getLocalStorage, getTokenExpiredDate, setLocalStorage} from "../../../guards/f-amhohwa";
import * as FConstants from "../../../guards/f-constants";
import {UserService} from "../../../services/rest/user.service";
import {FDialogService} from "../../../services/common/f-dialog.service";
import {dateToMonthFullString, restTry} from "../../../guards/f-extensions";
import {MenuModule} from "primeng/menu";
import {Ripple} from "primeng/ripple";
import {BadgeModule} from "primeng/badge";


@Component({
  selector: "app-menu-config",
  imports: [ToolbarModule, Button, SidebarModule, NgForOf, RouterLink, TranslatePipe, NgClass, NgIf, MenuModule, Ripple, BadgeModule ],
  templateUrl: "./menu-config.component.html",
  styleUrl: "./menu-config.component.scss",
  standalone: true,
})
export class MenuConfigComponent {
  menuButtonVisible: boolean;
  menuVisible: boolean;
  menuItems: MenuItem[];
  scale: number = 14;
  scales: number[] = [10,12,14,16,18];
  constructor(private cd: ChangeDetectorRef, private langService: LanguageService, private configService: AppConfigService, private userService: UserService, private fDialogService: FDialogService) {
    this.menuButtonVisible = false;
    this.menuVisible = false;
    this.menuItems = [];
    this.scale = this.configService.getScale();
    afterNextRender(() => {
      this.cd.markForCheck();
    });
  }
  menuInit(visible: boolean): void {
    this.menuButtonVisible = visible;
    this.menuVisible = false;
    this.menuItems = visible ? MainMenuItem() : [];
  }
  menuClose(): void {
    this.menuVisible = false;
  }
  toggleMenu(): void {
    this.menuVisible = !this.menuVisible;
  }
  async tokenRefresh(): Promise<void> {
    const ret = await restTry(async() => await this.userService.tokenRefresh(),
      e => this.fDialogService.error("refresh", e));
    if (ret.result) {
      setLocalStorage(FConstants.AUTH_TOKEN, ret.data ?? "");
      return;
    }
  }
  get expiredDate(): string {
    return dateToMonthFullString(getTokenExpiredDate(getLocalStorage(FConstants.AUTH_TOKEN)));
  }
  get expiredButtonVisible(): boolean {
    if (!this.menuButtonVisible) {
      return false;
    }

    let authToken = getLocalStorage(FConstants.AUTH_TOKEN);
    if (authToken.length <= 0) {
      return false;
    }

    let tokenDate = getTokenExpiredDate(authToken);
    let now = new Date();
    tokenDate.setDate(tokenDate.getDate() - 2);

    return now.getTime() > tokenDate.getTime();
  }
  langToEn(): void {
    this.langService.change(LangType.en);
  }
  langToKo(): void {
    this.langService.change(LangType.ko);
  }
  decrementScale(): void {
    this.scale = this.scale - 2;
    this.applyScale();
  }
  incrementScale(): void {
    this.scale = this.scale + 2;
    this.applyScale();
  }
  applyScale(): void {
    this.configService.changeScale(this.scale);
  }
  changeTheme(toDark: boolean): void {
    this.configService.changeTheme(toDark);
  }

  get isKoLang(): boolean {
    return this.langService.isKoLang();
  }
  get isDarkMode(): boolean {
    return this.configService.isDarkMode();
  }
  isSVGIcon(item: MenuItem): boolean {
    const ret = item["path"];
    return !!ret;
  }
  fillColor(): string {
    if (this.isDarkMode) {
      return "#FFFFFF";
    } else {
      return "#4b5563"
    }
  }
}
