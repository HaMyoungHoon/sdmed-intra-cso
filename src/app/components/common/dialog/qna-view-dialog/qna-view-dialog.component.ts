import { Component } from "@angular/core";
import {FDialogComponentBase} from "../../../../guards/f-dialog-component-base";

@Component({
  selector: "app-qna-view-dialog",
  imports: [],
  templateUrl: "./qna-view-dialog.component.html",
  styleUrl: "./qna-view-dialog.component.scss",
  standalone: true
})
export class QnaViewDialogComponent extends FDialogComponentBase {
  constructor() {
    super();
  }
}
