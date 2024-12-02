import {AfterViewInit, Component} from "@angular/core";
import {getLocalStorage, isExpired} from "./f-amhohwa";
import * as FConstants from "./f-constants";

@Component({
  template: "",
  standalone: false
})
export abstract class FComponentBase implements AfterViewInit {

  ngAfterViewInit(): void {
    const authToken = getLocalStorage(FConstants.AUTH_TOKEN);
    if (isExpired(authToken)) {
      return;
    }
    this.ngInit();
  }

  ngInit(): void {

  }
}
