import {Component} from "@angular/core";
import {Router, RouterOutlet} from "@angular/router";
import {LanguageService} from "./services/common/language.service";
import {ToastModule} from "primeng/toast";
import {InputSwitchModule} from "primeng/inputswitch";
import {FormsModule} from "@angular/forms";
import {TranslatePipe} from "@ngx-translate/core";
import {NgIf} from "@angular/common";
import {Button} from "primeng/button";
import {StyleClass} from "primeng/styleclass";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, ToastModule, InputSwitchModule, FormsModule, TranslatePipe, NgIf, Button, StyleClass],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  standalone: true,
})
export class AppComponent {
  constructor(public languageService: LanguageService, public router: Router) {
    languageService.onInit().then();
  }

  get confirmAble(): string {
    return "confirm-able";
  }
}
