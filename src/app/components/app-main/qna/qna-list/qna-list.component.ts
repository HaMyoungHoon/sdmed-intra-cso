import { Component } from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";

@Component({
  selector: "app-qna-list",
  templateUrl: "./qna-list.component.html",
  styleUrl: "./qna-list.component.scss",
  standalone: false,
})
export class QnaListComponent extends FComponentBase {
  constructor() {
    super();
  }
}
