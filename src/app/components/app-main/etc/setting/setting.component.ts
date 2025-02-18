import {AfterViewInit, Component} from "@angular/core";
import {AppConfigService} from "../../../../services/common/app-config.service";

@Component({
  selector: "app-setting",
  templateUrl: "./setting.component.html",
  styleUrl: "./setting.component.scss",
  standalone: false,
})
export class SettingComponent implements AfterViewInit {
  infoSticky: boolean = false;
  toastLife: number = 3000;
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

  get stickyCheckIcon(): string {
    return this.infoSticky ? "pi pi-check-circle" : "pi pi-circle";
  }
}
