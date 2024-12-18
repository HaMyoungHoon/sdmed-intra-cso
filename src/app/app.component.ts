import {ChangeDetectorRef, Component} from "@angular/core";
import {Router, RouterOutlet} from "@angular/router";
import {LanguageService} from "./services/common/language.service";
import {ToastModule} from "primeng/toast";
import {InputSwitchModule} from "primeng/inputswitch";
import {FormsModule} from "@angular/forms";
import {AppConfigService} from "./services/common/app-config.service";


@Component({
  selector: "app-root",
  imports: [RouterOutlet, ToastModule, InputSwitchModule, FormsModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  standalone: true,
})
export class AppComponent {
  constructor(private cd: ChangeDetectorRef, private router: Router,
              public languageService: LanguageService, private appConfigService: AppConfigService) {
    languageService.onInit().then();
    appConfigService.appState
  }
}
