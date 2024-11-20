import {AfterViewInit, Component} from "@angular/core";
import {getLocalStorage, isExpired} from "../../../guards/f-amhohwa";
import * as FConstants from "../../../guards/f-constants";

@Component({
  selector: "app-dash-board",
  templateUrl: "./dash-board.component.html",
  styleUrl: "./dash-board.component.scss"
})
export class DashBoardComponent implements AfterViewInit{
  constructor() {
  }

  ngAfterViewInit(): void {
    const authToken = getLocalStorage(FConstants.AUTH_TOKEN);
    if (isExpired(authToken)) {
      return;
    }
  }
}
