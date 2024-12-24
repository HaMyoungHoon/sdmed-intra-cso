import {afterNextRender, ChangeDetectorRef, Component} from "@angular/core";
import {ToolbarModule} from "primeng/toolbar";
import {ButtonModule} from "primeng/button";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {TranslatePipe} from "@ngx-translate/core";
import {LanguageService} from "../../../services/common/language.service";
import {MenuItem} from "primeng/api";
import {AppConfigService} from "../../../services/common/app-config.service";
import {MainMenuItem} from "../../../models/common/main-menu-item";
import {LangType} from "../../../models/common/lang-type";
import * as FAmhohwa from "../../../guards/f-amhohwa";
import * as FConstants from "../../../guards/f-constants";
import {FDialogService} from "../../../services/common/f-dialog.service";
import * as FExtensions from "../../../guards/f-extensions";
import {MenuModule} from "primeng/menu";
import {RippleModule} from "primeng/ripple";
import {BadgeModule} from "primeng/badge";
import {CheckboxModule} from "primeng/checkbox";
import {FormsModule} from "@angular/forms";
import {CommonService} from "../../../services/rest/common.service";
import {Tooltip} from "primeng/tooltip";
import {Drawer} from "primeng/drawer";


@Component({
  selector: "app-menu-config",
  imports: [ToolbarModule, ButtonModule, NgForOf, RouterLink, TranslatePipe, NgClass, NgIf, MenuModule, RippleModule, BadgeModule, CheckboxModule, FormsModule, Tooltip, Drawer],
  templateUrl: "./menu-config.component.html",
  styleUrl: "./menu-config.component.scss",
  standalone: true,
})
export class MenuConfigComponent {
  menuButtonVisible: boolean = false;
  menuItems: MenuItem[] = [];
  scales: number[] = [10,12,14,16,18];
  constructor(private cd: ChangeDetectorRef, private langService: LanguageService, private configService: AppConfigService, private commonService: CommonService, private fDialogService: FDialogService) {
    afterNextRender(() => {
      this.cd.markForCheck();
    });
  }
  menuInit(visible: boolean): void {
    this.menuButtonVisible = visible;
    this.menuItems = visible ? MainMenuItem() : [];
  }
  menuClose(): void {
    this.configService.hideMenu();
  }
  toggleMenu(): void {
    if (this.menuVisible) {
      this.configService.hideMenu();
    } else {
      this.configService.showMenu();
    }
  }
  async tokenRefresh(): Promise<void> {
    const ret = await FExtensions.restTry(async() => await this.commonService.tokenRefresh(),
      e => this.fDialogService.error("refresh", e));
    if (ret.result) {
      FAmhohwa.setLocalStorage(FConstants.AUTH_TOKEN, ret.data ?? "");
      return;
    }
  }
  get menuVisible(): boolean {
    return this.configService.isMenuActive();
  }
  get expiredDate(): string {
    return FExtensions.dateToMonthFullString(FAmhohwa.getTokenExpiredDate(FAmhohwa.getLocalStorage(FConstants.AUTH_TOKEN)));
  }
  get expiredButtonVisible(): boolean {
    if (!this.menuButtonVisible) {
      return false;
    }

    let authToken = FAmhohwa.getLocalStorage(FConstants.AUTH_TOKEN);
    if (authToken.length <= 0) {
      return false;
    }

    let tokenDate = FAmhohwa.getTokenExpiredDate(authToken);
    let now = new Date();
    tokenDate.setDate(tokenDate.getDate() - 2);

    return now.getTime() > tokenDate.getTime();
  }
  async langToEn(): Promise<void> {
    await this.langService.change(LangType.en);
  }
  async langToKo(): Promise<void> {
    await this.langService.change(LangType.ko);
  }
  decrementScale(): void {
    this.applyScale(this.scale - 2);
  }
  incrementScale(): void {
    this.applyScale(this.scale + 2);
  }
  applyScale(scale: number): void {
    this.configService.changeScale(scale);
  }
  changeTheme(toDark: boolean): void {
    this.configService.toggleDarkMode(toDark);
  }
  changeNewTab(_: any): void {
    this.configService.changeNewTab(!this.isNewTab);
  }
  get isNewTab(): boolean {
    return this.configService.isNewTab();
  }
  get scale(): number {
    return this.configService.getScale();
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
