import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import {provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling} from "@angular/router";

import { routes } from "./app.routes";
import {provideHttpClient, withFetch, withInterceptors} from "@angular/common/http";
import {HttpRequestInterceptorService} from "./services/common/http-request-interceptor.service";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {MessageService} from "primeng/api";
import {FDialogService} from "./services/common/f-dialog.service";
import {DialogService} from "primeng/dynamicdialog";
import {provideTranslateLoader} from "./guards/http-loader-factory";

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([HttpRequestInterceptorService])
    ),
    provideTranslateLoader(),
    provideHttpClient(withFetch()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes,
      withInMemoryScrolling({
        anchorScrolling: "enabled",
        scrollPositionRestoration: "enabled"
      }),
      withEnabledBlockingInitialNavigation()
    ),
    provideAnimationsAsync(),
    MessageService,
    FDialogService,
    DialogService
  ]
};
