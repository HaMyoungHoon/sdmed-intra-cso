import {ChangeDetectorRef, Component} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {LanguageService} from './services/common/language.service';
import {ToastModule} from 'primeng/toast';
import {Button} from 'primeng/button';
import {InputSwitchModule} from 'primeng/inputswitch';
import {FormsModule} from '@angular/forms';
import {AppConfigService} from './services/common/app-config.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule, Button, InputSwitchModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private cd: ChangeDetectorRef, private router: Router,
              public languageService: LanguageService, private appConfigService: AppConfigService) {
    languageService.onInit();
    appConfigService.onInit();
  }
}
