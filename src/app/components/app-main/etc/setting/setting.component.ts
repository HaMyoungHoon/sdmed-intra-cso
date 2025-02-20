import {AfterViewInit, Component} from "@angular/core";
import {AppConfigService} from "../../../../services/common/app-config.service";
import * as FImageCache from "../../../../guards/f-image-cache";
import * as FExtensions from "../../../../guards/f-extensions";

@Component({
  selector: "app-setting",
  templateUrl: "./setting.component.html",
  styleUrl: "./setting.component.scss",
  standalone: false,
})
export class SettingComponent implements AfterViewInit {
  infoSticky: boolean = false;
  toastLife: number = 3000;
  isLoading: boolean = false;
  constructor(private appConfig: AppConfigService) {
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
}
