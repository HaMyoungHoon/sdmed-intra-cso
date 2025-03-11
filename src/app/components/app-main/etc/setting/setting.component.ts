import {AfterViewInit, Component, ViewChild} from "@angular/core";
import {AppConfigService} from "../../../../services/common/app-config.service";
import * as FImageCache from "../../../../guards/f-image-cache";
import * as FExtensions from "../../../../guards/f-extensions";
import * as FGoogleMapStyle from "../../../../guards/f-google-map-style";
import {GoogleMapComponent} from "../../../common/google-map/google-map.component";

@Component({
  selector: "app-setting",
  templateUrl: "./setting.component.html",
  styleUrl: "./setting.component.scss",
  standalone: false,
})
export class SettingComponent implements AfterViewInit {
  @ViewChild("googleMap") googleMap!: GoogleMapComponent;
  infoSticky: boolean = false;
  toastLife: number = 3000;
  isLoading: boolean = false;
  mapThemeNumber: number = 0;
  mapThemeList: {label: string, func: () => any}[] = FGoogleMapStyle.googleThemeList();
  selectedMapTheme?: {label: string, func: () => any};
  constructor(private appConfig: AppConfigService) {
    this.mapThemeNumber = this.appConfig.getMapThemeNumber();
    this.selectedMapTheme = this.mapThemeList[this.mapThemeNumber];
  }
  ngAfterViewInit(): void {
    this.infoSticky = this.appConfig.isInfoSticky();
    this.toastLife = this.appConfig.getToastLife();
  }

  toggleInfoSticky(): void {
    this.infoSticky = !this.infoSticky;
    this.appConfig.toggleInfoSticky(this.infoSticky);
  }
  toastLifeSave(): void {
    this.appConfig.setToastLife(this.toastLife);
    this.toastLife = this.appConfig.getToastLife();
  }
  async removeCache(): Promise<void> {
    this.isLoading = true;
    await FExtensions.tryCatchAsync(async() => await FImageCache.clearAllImage());
    this.isLoading = false;
    window.location.reload();
  }
  settingInit(): void {
    this.isLoading = true;
    this.appConfig.allStorageClear();
    this.isLoading = false;
    window.location.reload();
  }

  get stickyCheckIcon(): string {
    return this.infoSticky ? "pi pi-check-circle" : "pi pi-circle";
  }
  mapThemeChanged(): void {
    const selectedTheme = this.selectedMapTheme;
    if (selectedTheme) {
      this.mapThemeNumber = this.mapThemeList.findIndex(x => x.label == selectedTheme.label) ?? 0;
      this.appConfig.setMapThemeNumber(this.mapThemeNumber);
      this.googleMap.themeSelectionChange(selectedTheme);
    }
  }
}
