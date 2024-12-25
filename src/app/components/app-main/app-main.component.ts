import {AfterViewInit, ChangeDetectorRef, Component, ViewChild} from "@angular/core";
import {InputSwitchModule} from "primeng/inputswitch";
import {NavigationEnd, NavigationStart, Router, RouterOutlet} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {MenuConfigComponent} from "../common/menu-config/menu-config.component";
import * as FAmhohwa from "../../guards/f-amhohwa";
import * as FConstants from "../../guards/f-constants";
import {FDialogService} from "../../services/common/f-dialog.service";
import {NgIf} from "@angular/common";
import {ButtonModule} from "primeng/button";

@Component({
  selector: "app-app-main",
  imports: [InputSwitchModule, RouterOutlet, FormsModule, MenuConfigComponent, NgIf, ButtonModule],
  templateUrl: "./app-main.component.html",
  styleUrl: "./app-main.component.scss",
  standalone: true
})
export class AppMainComponent implements AfterViewInit {
  @ViewChild("MenuConfigComponent") menuConfig!: MenuConfigComponent;
  viewPage: boolean = false;
  constructor(private cd: ChangeDetectorRef, private router: Router, private fDialogService: FDialogService) {
  }

  ngAfterViewInit(): void {
    const authToken = FAmhohwa.getLocalStorage(FConstants.AUTH_TOKEN);
    if (FAmhohwa.isExpired(authToken)) {
      FAmhohwa.removeLocalStorage(FConstants.AUTH_TOKEN);
      this.initChildComponents(false);
      this.openSignIn();
      return;
    }

    this.initChildComponents(true);
    this.bindRouteEvents();
  }
  openSignIn(): void {
    this.fDialogService.openSignIn().subscribe(() => {
      this.closeSignIn();
    });
  }
  closeSignIn(): void {
    const authToken = FAmhohwa.getLocalStorage(FConstants.AUTH_TOKEN);
    if (FAmhohwa.isExpired(authToken)) {
      this.initChildComponents(false);
      return;
    }

    this.initChildComponents(true);
    this.cd.detectChanges();
    this.bindRouteEvents();
  }

  initChildComponents(data: boolean): void {
    this.viewPage = data;
    this.menuConfig.menuInit(data);
    const authToken = FAmhohwa.getLocalStorage(FConstants.AUTH_TOKEN);
    if (this.router.url == "/" && !FAmhohwa.isExpired(authToken)) {
      this.router.navigate([`/${FConstants.DASH_BOARD_URL}`]).then();
    }
  }

  unbindRouteEvents(): void {
  }
  bindRouteEvents(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const authToken = FAmhohwa.getLocalStorage(FConstants.AUTH_TOKEN);
        if (FAmhohwa.isExpired(authToken)) {
          FAmhohwa.removeLocalStorage(FConstants.AUTH_TOKEN);
          this.initChildComponents(false);
          this.openSignIn();
        }
      }
      if (event instanceof NavigationEnd) {
        this.menuConfig.menuClose();
      }
    });
  }
  get testVisible(): boolean {
    return false;
  }
  test(): void {

  }
}
