import {Component, Inject, OnInit, Renderer2} from "@angular/core";
import {Router, RouterOutlet} from "@angular/router";
import {LanguageService} from "./services/common/language.service";
import {ToastModule} from "primeng/toast";
import {InputSwitchModule} from "primeng/inputswitch";
import {FormsModule} from "@angular/forms";
import {TranslatePipe} from "@ngx-translate/core";
import {DOCUMENT, NgIf} from "@angular/common";
import {Button} from "primeng/button";
import {StyleClass} from "primeng/styleclass";
import * as FConstants from "./guards/f-constants";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, ToastModule, InputSwitchModule, FormsModule, TranslatePipe, NgIf, Button, StyleClass],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  standalone: true,
})
export class AppComponent implements OnInit {
  constructor(@Inject(DOCUMENT) private document: Document, private renderer: Renderer2, public languageService: LanguageService, public router: Router) {
    languageService.onInit().then();
  }
  ngOnInit(): void {
    this.injectScriptsGoogleMap();
    this.injectScriptsGoogleGeocode();
  }

  get confirmAble(): string {
    return "confirm-able";
  }
  injectScriptsGoogleMap(): void {
    if (this.document.getElementById("google-maps-script") !== null) {
      return;
    }
    const scriptBody = this.renderer.createElement("script");
    scriptBody.id = "google-maps-script"
    scriptBody.src = `https://maps.googleapis.com/maps/api/js?key=${FConstants.MAP_GOOGLE_API_KEY}&loading=async&libraries=marker`;
    scriptBody.async = true;
    scriptBody.defer = true;
    this.renderer.appendChild(this.document.head, scriptBody);
  }
  injectScriptsGoogleGeocode(): void {
    if (this.document.getElementById("google-geocode-script") !== null) {
      return;
    }
    const scriptBody = this.renderer.createElement("script");
    scriptBody.id = "google-geocode-script";
    scriptBody.src = `https://maps.googleapis.com/maps/api/geocode/json?key=${FConstants.MAP_GOOGLE_API_KEY}`;
    scriptBody.async = true;
    this.renderer.appendChild(this.document.head, scriptBody);
  }
}
