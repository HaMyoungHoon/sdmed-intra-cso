import {Component} from "@angular/core";
import {RouterOutlet} from "@angular/router";
import {LanguageService} from "./services/common/language.service";
import {ToastModule} from "primeng/toast";
import {InputSwitchModule} from "primeng/inputswitch";
import {FormsModule} from "@angular/forms";


@Component({
  selector: "app-root",
  imports: [RouterOutlet, ToastModule, InputSwitchModule, FormsModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  standalone: true,
})
export class AppComponent {
  constructor(public languageService: LanguageService) {
    languageService.onInit().then();
  }
}
