import { Component } from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";

@Component({
  selector: "app-qna-view",
  templateUrl: "./qna-view.component.html",
  styleUrl: "./qna-view.component.scss",
  standalone: false,
})
export class QnaViewComponent extends FComponentBase {
  constructor() {
    super();
  }
}
