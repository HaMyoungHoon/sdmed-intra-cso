import {Component} from "@angular/core";
import {FComponentBase} from "../../../guards/f-component-base";

@Component({
  selector: "app-dash-board",
  templateUrl: "./dash-board.component.html",
  styleUrl: "./dash-board.component.scss",
  standalone: false
})
export class DashBoardComponent extends FComponentBase {
  constructor() {
    super();
  }

  override ngInit(): void {
  }
}
